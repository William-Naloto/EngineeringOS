import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactId } from '../ast/interfaces.ts';
import { graphFromNodes } from '../validator/graph-rules.ts';
import { buildDependencyEdges } from '../validator/graph-rules.ts';
import { DEFAULT_VALIDATION_CONFIG } from '../validator/default-config.ts';
import type { ValidationTier } from '../ast/interfaces.ts';
import { parseContractYaml } from '../parser/parse-contract-yaml.ts';

import {
  contractFromEntry,
  domainFromId,
  isArtifactStatus,
  isArtifactType,
  matchesQuery,
  toArtifactDetail,
  toArtifactSummary,
} from './artifacts.ts';
import type { EorContext } from './eor-context.ts';
import type { ToolName, ToolResponse } from './interfaces.ts';
import {
  asBoolean,
  asNumber,
  asString,
  failure,
  pickInput,
  success,
  timed,
} from './response.ts';
import { toApiGraphEdgeType, dedupeGraphEdges } from './graph-edges.ts';
import { runExport, ExportNotImplementedError, ExportUnsupportedTargetError } from '../compiler/export-service.ts';
import { runCompile, CompileNotImplementedError } from '../compiler/compile-service.ts';
import { runCapture, CaptureError } from '../capture/capture-service.ts';
import type { CompilerTargetId } from '../compiler/interfaces.ts';

type Handler = (ctx: EorContext, input: Record<string, unknown>) => Promise<ToolResponse<unknown>>;

const TOOL_DESCRIPTIONS: Record<ToolName, string> = {
  'engineeringos.status': 'Repository and runtime health status',
  'engineeringos.capabilities': 'List capabilities with optional filtering',
  'engineeringos.competencies': 'List competencies with topic counts',
  'engineeringos.skills': 'Search skills within capability scope',
  'engineeringos.find': 'Find artifacts by id, query, or type',
  'engineeringos.review': 'Review a capability and its resolved subgraph',
  'engineeringos.compile': 'Compile resolved knowledge for a compiler target',
  'engineeringos.dependencies': 'Show dependency graph for an artifact',
  'engineeringos.roadmap': 'Return roadmap status from ROADMAP.md',
  'engineeringos.progress': 'Return sprint progress from PROGRESS.md',
  'engineeringos.validate': 'Validate repository or scoped artifacts',
  'engineeringos.graph': 'Return capability orchestration graph',
  'engineeringos.search': 'Keyword search across artifacts',
  'engineeringos.adr': 'Search Architecture Decision Records',
  'engineeringos.pack': 'Return pack information and contained artifacts',
  'engineeringos.owner': 'Show ownership for artifacts',
  'engineeringos.evidence': 'Return evidence chain for an artifact',
  'engineeringos.snapshot': 'Generate consultant snapshot for a capability',
  'engineeringos.export': 'Export documentation for a compiler target',
  'engineeringos.capture': 'Run capture pipeline: learn, list, review, extract, status',
};

export function createToolHandlers(): Map<ToolName, Handler> {
  const handlers = new Map<ToolName, Handler>();

  handlers.set('engineeringos.status', handleStatus);
  handlers.set('engineeringos.capabilities', handleCapabilities);
  handlers.set('engineeringos.competencies', handleCompetencies);
  handlers.set('engineeringos.skills', handleSkills);
  handlers.set('engineeringos.find', handleFind);
  handlers.set('engineeringos.review', handleReview);
  handlers.set('engineeringos.compile', handleCompile);
  handlers.set('engineeringos.dependencies', handleDependencies);
  handlers.set('engineeringos.roadmap', handleRoadmap);
  handlers.set('engineeringos.progress', handleProgress);
  handlers.set('engineeringos.validate', handleValidate);
  handlers.set('engineeringos.graph', handleGraph);
  handlers.set('engineeringos.search', handleSearch);
  handlers.set('engineeringos.adr', handleAdr);
  handlers.set('engineeringos.pack', handlePack);
  handlers.set('engineeringos.owner', handleOwner);
  handlers.set('engineeringos.evidence', handleEvidence);
  handlers.set('engineeringos.snapshot', handleSnapshot);
  handlers.set('engineeringos.export', handleExport);
  handlers.set('engineeringos.capture', handleCapture);

  return handlers;
}

export function getToolDescription(name: ToolName): string {
  return TOOL_DESCRIPTIONS[name];
}

async function handleStatus(ctx: EorContext): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const index = ctx.requireIndex();
    const types: Record<string, number> = {};

    for (const entry of index.listAll()) {
      types[entry.type] = (types[entry.type] ?? 0) + 1;
    }

    return {
      repository: {
        root: ctx.repositoryRoot,
        ekl_version: '1.0.0',
        release: '0.1.1',
        artifact_count: index.listAll().length,
      },
      runtime: {
        phase: ctx.phase,
        eor_version: '0.1.0',
      },
      index: {
        built_at: index.builtAt,
        entries: index.listAll().length,
        types,
      },
    };
  });

  return success(result, durationMs);
}

async function handleCapabilities(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const index = ctx.requireIndex();
    const domain = asString(pickInput(input, 'domain', 'domain'));
    const status = pickInput(input, 'status', 'status');
    const provides = asString(pickInput(input, 'provides', 'provides'));
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 50);

    const capabilities = [];

    for (const entry of index.listByType('capability')) {
      const contract = await contractFromEntry(ctx.repositoryRoot, entry);
      if (!contract) {
        continue;
      }
      if (domain && domainFromId(contract.id) !== domain) {
        continue;
      }
      if (isArtifactStatus(status) && contract.status !== status) {
        continue;
      }
      if (provides && !contract.provides.includes(provides)) {
        continue;
      }
      capabilities.push(toArtifactSummary(entry, contract));
    }

    return {
      capabilities: capabilities.slice(0, limit),
      total: capabilities.length,
    };
  });

  return success(result, durationMs, result.capabilities.length);
}

async function handleCompetencies(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const index = ctx.requireIndex();
    const status = pickInput(input, 'status', 'status');
    const enablesCapability = asString(
      pickInput(input, 'enablesCapability', 'enables_capability'),
    );
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 50);

    const competencies = [];

    for (const entry of index.listByType('competency')) {
      const contract = await contractFromEntry(ctx.repositoryRoot, entry);
      if (!contract) {
        continue;
      }
      if (isArtifactStatus(status) && contract.status !== status) {
        continue;
      }

      const manifest = await readManifest(ctx, entry.path);
      const enables = Array.isArray(manifest?.enables_capabilities)
        ? manifest.enables_capabilities.map(String)
        : [];

      if (enablesCapability && !enables.includes(enablesCapability)) {
        continue;
      }

      const topicCount = await ctx.loadCompetencyTopicCount(contract.id);
      competencies.push({
        id: contract.id,
        version: contract.version,
        status: contract.status,
        topic_count: topicCount,
        enables_capabilities: enables,
      });
    }

    return {
      competencies: competencies.slice(0, limit),
      total: competencies.length,
    };
  });

  return success(result, durationMs);
}

async function handleSkills(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const router = ctx.requireRouter();
    const capability = asString(pickInput(input, 'capability', 'capability'));
    const query = asString(pickInput(input, 'query', 'query'));
    const includeOrphan = asBoolean(pickInput(input, 'includeOrphan', 'include_orphan'), false);
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 50);

    let skillIds: ArtifactId[];

    if (capability) {
      const resolved = await ctx.requireResolver().resolve({
        capabilities: [capability],
        minStatus: 'draft',
        minConfidence: 'Unknown',
        maxArtifactsPerSession: 200,
        includeOrphanSkills: false,
      });
      skillIds = resolved.nodes.filter((node) => node.type === 'skill').map((node) => node.contract.id);
    } else {
      skillIds = await router.matchByType('skill', { query }, {
        capabilityFirst: true,
        includeOrphanSkills: includeOrphan,
        excludeResearch: true,
        excludeLifecycleCreated: false,
        migrationMode: false,
      });
    }

    const index = ctx.requireIndex();
    const skills = [];

    for (const id of skillIds) {
      const entry = index.lookup(id);
      if (!entry) {
        continue;
      }
      const contract = await contractFromEntry(ctx.repositoryRoot, entry);
      if (!contract) {
        continue;
      }
      if (query && !matchesQuery(`${contract.id} ${entry.path}`, query)) {
        continue;
      }
      skills.push(toArtifactSummary(entry, contract));
    }

    return {
      skills: skills.slice(0, limit),
      total: skills.length,
      scoped_by_capability: capability,
    };
  });

  return success(result, durationMs, result.skills.length);
}

async function handleFind(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const index = ctx.requireIndex();
    const id = asString(pickInput(input, 'id', 'id'));
    const query = asString(pickInput(input, 'query', 'query'));
    const type = pickInput(input, 'type', 'type');
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 20);

    const artifacts = [];

    if (id) {
      const entry = index.lookup(id);
      if (entry) {
        const contract = await contractFromEntry(ctx.repositoryRoot, entry);
        if (contract) {
          artifacts.push(toArtifactSummary(entry, contract));
        }
      }
    } else {
      for (const entry of index.listAll()) {
        if (isArtifactType(type) && entry.type !== type) {
          continue;
        }
        const contract = await contractFromEntry(ctx.repositoryRoot, entry);
        if (!contract) {
          continue;
        }
        const haystack = `${contract.id} ${entry.path}`;
        if (query && !matchesQuery(haystack, query)) {
          continue;
        }
        artifacts.push(toArtifactSummary(entry, contract));
      }
    }

    return {
      artifacts: artifacts.slice(0, limit),
      total: artifacts.length,
    };
  });

  return success(result, durationMs, result.artifacts.length);
}

async function handleReview(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const capability = asString(pickInput(input, 'capability', 'capability'));
  if (!capability) {
    return failure('INVALID_INPUT', 'capability is required', 0);
  }

  const { result, durationMs } = await timed(async () => {
    const includeBody = asBoolean(pickInput(input, 'includeBody', 'include_body'), true);
    const includeEvidence = asBoolean(pickInput(input, 'includeEvidence', 'include_evidence'), true);

    const graph = await ctx.requireResolver().resolve({
      capabilities: [capability],
      minStatus: 'draft',
      minConfidence: 'Unknown',
      maxArtifactsPerSession: 200,
      includeOrphanSkills: false,
    });

    const validation = await ctx.validator.validateGraph(graphFromNodes(graph.nodes));

    const byType = (type: string) =>
      graph.nodes
        .filter((node) => node.type === type)
        .map((node) => toArtifactDetail(node, { includeBody, includeEvidence }));

    const capabilityNode = graph.nodes.find((node) => node.contract.id === capability);

    return {
      capability: capabilityNode
        ? toArtifactDetail(capabilityNode, { includeBody, includeEvidence })
        : null,
      resolved: {
        competencies: byType('competency'),
        skills: byType('skill'),
        workflows: byType('workflow'),
        standards: byType('standard'),
        agents: byType('agent'),
      },
      validation: {
        valid: validation.valid,
        errors: [...validation.graphErrors, ...validation.nodeResults.flatMap((r) => r.errors)],
        warnings: validation.nodeResults.flatMap((r) => r.warnings),
      },
      order: graph.order,
    };
  });

  return success(result, durationMs, result.order.length);
}

async function handleDependencies(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const id = asString(pickInput(input, 'id', 'id'));
  if (!id) {
    return failure('INVALID_INPUT', 'id is required', 0);
  }

  const timedResult = await timed(async () => {
    const depth = asNumber(pickInput(input, 'depth', 'depth'), -1);
    const direction = asString(pickInput(input, 'direction', 'direction')) ?? 'downstream';

    const seed = await ctx.requireStore().load(id);
    if (!seed) {
      throw new Error(`NOT_FOUND:${id}`);
    }

    const nodes = [seed];
    const collected = new Set<ArtifactId>([id]);

    if (direction === 'downstream' || direction === 'both') {
      await expandDirection(ctx, id, 'downstream', collected, nodes, depth);
    }
    if (direction === 'upstream' || direction === 'both') {
      await expandDirection(ctx, id, 'upstream', collected, nodes, depth);
    }

    const edges = nodes.flatMap((node) => buildDependencyEdges(node));

    return {
      root: id,
      nodes: nodes.map((node) => ({
        id: node.contract.id,
        type: node.type,
        version: node.contract.version,
        status: node.contract.status,
      })),
      edges: edges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        type: toApiGraphEdgeType(edge.type),
      })),
    };
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message.startsWith('NOT_FOUND:')) {
      return null;
    }
    throw error;
  });

  if (!timedResult) {
    return failure('NOT_FOUND', `Artifact not found: ${id}`, 0);
  }

  return success(timedResult.result, timedResult.durationMs, timedResult.result.nodes.length);
}

async function handleRoadmap(ctx: EorContext): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const markdown = await ctx.readRepositoryFile('ROADMAP.md');
    const milestones = [...markdown.matchAll(/\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|/g)].map(
      (match) => ({
        name: match[1].trim(),
        focus: match[2].trim(),
        status: match[3].trim(),
      }),
    );

    const current = markdown.match(/\*\*Current milestone:\*\*\s*(.+)/)?.[1]?.trim() ?? 'Unknown';

    return {
      current_milestone: current,
      milestones,
    };
  });

  return success(result, durationMs);
}

async function handleProgress(ctx: EorContext): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const markdown = await ctx.readRepositoryFile('PROGRESS.md');
    const items = [...markdown.matchAll(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g)]
      .filter((match) => !match[1].includes('---') && match[1].trim() !== 'Deliverable')
      .map((match) => ({
        item: match[1].trim(),
        status: match[2].trim(),
      }));

    const current = markdown.match(/\*\*Milestone:\*\*\s*(.+)/)?.[1]?.trim() ?? 'Unknown';

    return {
      current_sprint: current,
      items,
    };
  });

  return success(result, durationMs);
}

async function handleValidate(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const scope = asString(pickInput(input, 'scope', 'scope')) ?? 'all';
    const capability = asString(pickInput(input, 'capability', 'capability'));
    const tiers = input.tiers;
    const failOnWarnings = asBoolean(pickInput(input, 'failOnWarnings', 'fail_on_warnings'), false);

    let nodes = [];

    if (scope === 'capability' && capability) {
      const graph = await ctx.requireResolver().resolve({
        capabilities: [capability],
        minStatus: 'draft',
        minConfidence: 'Unknown',
        maxArtifactsPerSession: 200,
        includeOrphanSkills: false,
      });
      nodes = graph.nodes;
    } else {
      const index = ctx.requireIndex();
      for (const entry of index.listAll()) {
        const node = await ctx.requireStore().load(entry.id);
        if (node) {
          nodes.push(node);
        }
      }
    }

    const validation = await ctx.validator.validateGraph(graphFromNodes(nodes), {
      ...DEFAULT_VALIDATION_CONFIG,
      tiers: Array.isArray(tiers) ? (tiers as ValidationTier[]) : DEFAULT_VALIDATION_CONFIG.tiers,
      failOnWarnings,
    });

    return {
      valid: validation.valid,
      artifacts_checked: nodes.length,
      errors: [...validation.graphErrors, ...validation.nodeResults.flatMap((r) => r.errors)],
      warnings: validation.nodeResults.flatMap((r) => r.warnings),
    };
  });

  return success(result, durationMs, result.artifacts_checked);
}

async function handleGraph(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const capability = asString(pickInput(input, 'capability', 'capability'));
    const format = asString(pickInput(input, 'format', 'format')) ?? 'json';

    const capabilities = capability
      ? [capability]
      : ctx.requireIndex().listByType('capability').map((entry) => entry.id);

    const allNodes = [];
    const allEdges = [];

    for (const capabilityId of capabilities.slice(0, 5)) {
      try {
        const graph = await ctx.requireResolver().resolve({
          capabilities: [capabilityId],
          minStatus: 'draft',
          minConfidence: 'Unknown',
          maxArtifactsPerSession: 200,
          includeOrphanSkills: false,
        });
        allNodes.push(...graph.nodes);
        allEdges.push(...graph.edges);
      } catch {
        continue;
      }
    }

    const uniqueNodes = dedupeNodes(allNodes);
    const nodes = uniqueNodes.map((node) => ({
      id: node.contract.id,
      type: node.type,
      version: node.contract.version,
      status: node.contract.status,
    }));

    const edges = dedupeGraphEdges(
      allEdges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        type: toApiGraphEdgeType(edge.type),
      })),
    );

    const response: {
      nodes: Array<{ id: string; type: string; version: string; status: string }>;
      edges: Array<{ from: string; to: string; type: string }>;
      mermaid?: string;
    } = { nodes, edges };
    if (format === 'mermaid') {
      response.mermaid = toMermaid(nodes, edges);
    }

    return response;
  });

  return success(result, durationMs, result.nodes.length);
}

async function handleSearch(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const query = asString(pickInput(input, 'query', 'query'));
  if (!query) {
    return failure('INVALID_INPUT', 'query is required', 0);
  }

  const { result, durationMs } = await timed(async () => {
    const type = pickInput(input, 'type', 'type');
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 20);
    const index = ctx.requireIndex();
    const results = [];

    for (const entry of index.listAll()) {
      if (isArtifactType(type) && entry.type !== type) {
        continue;
      }

      const contract = await contractFromEntry(ctx.repositoryRoot, entry);
      if (!contract) {
        continue;
      }

      const haystack = `${contract.id} ${entry.path} ${contract.provides.join(' ')}`;
      if (!matchesQuery(haystack, query)) {
        continue;
      }

      const node = await ctx.requireStore().load(entry.id);
      results.push({
        artifact: toArtifactSummary(entry, contract),
        score: 1,
        snippet: node?.body.raw.slice(0, 160) ?? entry.path,
      });
    }

    return {
      results: results.slice(0, limit),
      total: results.length,
    };
  });

  return success(result, durationMs, result.results.length);
}

async function handleAdr(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const query = asString(pickInput(input, 'query', 'query'));
    const number = pickInput(input, 'number', 'number');
    const limit = asNumber(pickInput(input, 'limit', 'limit'), 10);
    const adrDir = join(ctx.repositoryRoot, 'adr');
    const files = await readdir(adrDir);
    const adrs = [];

    for (const file of files.filter((name) => name.endsWith('.md')).sort()) {
      const match = /^(\d+)-/.exec(file);
      const adrNumber = match ? Number(match[1]) : 0;
      if (typeof number === 'number' && adrNumber !== number) {
        continue;
      }

      const raw = await readFile(join(adrDir, file), 'utf8');
      const title = raw.match(/^#\s+(.+)$/m)?.[1] ?? file;
      if (query && !matchesQuery(`${title} ${file} ${raw}`, query)) {
        continue;
      }

      adrs.push({
        number: adrNumber,
        title,
        path: `adr/${file}`,
        status: raw.includes('Accepted') ? 'Accepted' : 'Draft',
        snippet: raw.slice(0, 160),
      });
    }

    return {
      adrs: adrs.slice(0, limit),
      total: adrs.length,
    };
  });

  return success(result, durationMs);
}

async function handlePack(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const id = asString(pickInput(input, 'id', 'id'));
  if (!id) {
    return failure('INVALID_INPUT', 'id is required', 0);
  }

  const timedResult = await timed(async () => {
    const includeArtifacts = asBoolean(
      pickInput(input, 'includeArtifacts', 'include_artifacts'),
      true,
    );
    const packSlug = id.replace(/^pack\./, '');
    const manifestPath = `packs/${packSlug}/manifest.yaml`;
    const entry = ctx.requireIndex().lookup(id) ?? ctx.requireIndex().lookupByPath(manifestPath);

    let manifest;
    try {
      const raw = await ctx.readRepositoryFile(manifestPath);
      manifest = parseContractYaml(raw);
    } catch {
      throw new Error('NOT_FOUND');
    }

    const packEntry = entry ?? {
      id,
      path: manifestPath,
      type: 'pack' as const,
      mtime: new Date().toISOString(),
      parsed: false,
    };

    const contract = await contractFromEntry(ctx.repositoryRoot, packEntry);

    const response: Record<string, unknown> = {
      pack: contract
        ? toArtifactSummary(packEntry, contract)
        : { id, type: 'pack', version: '0.0.0', status: 'draft' },
      manifest: {
        skills: manifest.skills ?? [],
        workflows: manifest.workflows ?? [],
        templates: manifest.templates ?? [],
      },
    };

    if (includeArtifacts) {
      const artifacts = [];
      for (const skillId of (manifest.skills as string[] | undefined) ?? []) {
        const skillEntry = ctx.requireIndex().lookup(skillId);
        if (!skillEntry) {
          continue;
        }
        const skillContract = await contractFromEntry(ctx.repositoryRoot, skillEntry);
        if (skillContract) {
          artifacts.push(toArtifactSummary(skillEntry, skillContract));
        }
      }
      response.artifacts = artifacts;
    }

    return response;
  }).catch(() => null);

  if (!timedResult) {
    return failure('NOT_FOUND', `Pack not found: ${id}`, 0);
  }

  const artifacts = timedResult.result.artifacts;
  return success(
    timedResult.result,
    timedResult.durationMs,
    Array.isArray(artifacts) ? artifacts.length : undefined,
  );
}

async function handleOwner(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const { result, durationMs } = await timed(async () => {
    const id = asString(pickInput(input, 'id', 'id'));
    const owner = asString(pickInput(input, 'owner', 'owner'));
    const index = ctx.requireIndex();
    const artifacts = [];

    for (const entry of index.listAll()) {
      const contract = await contractFromEntry(ctx.repositoryRoot, entry);
      if (!contract) {
        continue;
      }
      if (id && contract.id !== id) {
        continue;
      }
      if (owner && contract.owner !== owner) {
        continue;
      }
      artifacts.push(toArtifactSummary(entry, contract));
    }

    const targetOwner = owner ?? (id ? artifacts[0]?.owner : undefined);
    const ownersMarkdown = await ctx.readRepositoryFile('OWNERS.md');
    const registryMatch = targetOwner ? ownersMarkdown.includes(`\`${targetOwner}\``) : false;

    return {
      owner: targetOwner,
      artifacts,
      registry_match: registryMatch,
    };
  });

  return success(result, durationMs, result.artifacts.length);
}

async function handleEvidence(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const id = asString(pickInput(input, 'id', 'id'));
  if (!id) {
    return failure('INVALID_INPUT', 'id is required', 0);
  }

  const transitive = asBoolean(pickInput(input, 'transitive', 'transitive'), false);

  const timedResult = await timed(async () => {
    const node = await ctx.requireStore().load(id);
    if (!node) {
      throw new Error('NOT_FOUND');
    }

    const evidence = node.evidence.entries.map((entry) => ({
      source: entry.source,
      type: entry.type,
      confidence_contribution: entry.confidenceContribution,
    }));

    if (transitive) {
      const deps = await ctx.requireResolver().expandDependencies(id);
      for (const depId of deps) {
        if (depId === id) {
          continue;
        }
        const depNode = await ctx.requireStore().load(depId);
        if (!depNode) {
          continue;
        }
        for (const entry of depNode.evidence.entries) {
          evidence.push({
            source: entry.source,
            type: entry.type,
            confidence_contribution: entry.confidenceContribution,
            from_artifact: depId,
          } as never);
        }
      }
    }

    return {
      artifact_id: id,
      confidence: node.contract.confidence,
      evidence,
    };
  }).catch(() => null);

  if (!timedResult) {
    return failure('NOT_FOUND', `Artifact not found: ${id}`, 0);
  }

  return success(timedResult.result, timedResult.durationMs);
}

async function handleSnapshot(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const capability = asString(pickInput(input, 'capability', 'capability'));
  if (!capability) {
    return failure('INVALID_INPUT', 'capability is required', 0);
  }

  const { result, durationMs } = await timed(async () => {
    const format = asString(pickInput(input, 'format', 'format')) ?? 'markdown';
    const includeEvidence = asBoolean(pickInput(input, 'includeEvidence', 'include_evidence'), true);
    const includeGraph = asBoolean(pickInput(input, 'includeGraph', 'include_graph'), true);

    const graph = await ctx.requireResolver().resolve({
      capabilities: [capability],
      minStatus: 'draft',
      minConfidence: 'Unknown',
      maxArtifactsPerSession: 200,
      includeOrphanSkills: false,
    });

    if (format === 'json') {
      return {
        capability,
        format,
        content: JSON.stringify(graph, null, 2),
        artifacts_included: graph.nodes.length,
        generated_at: new Date().toISOString(),
      };
    }

    const lines = [`# Snapshot: ${capability}`, '', `Generated: ${new Date().toISOString()}`, ''];

    for (const id of graph.order) {
      const node = graph.nodes.find((item) => item.contract.id === id);
      if (!node) {
        continue;
      }
      lines.push(`## ${node.contract.id}`, '', node.body.raw, '');
      if (includeEvidence && node.evidence.entries.length > 0) {
        lines.push('### Evidence', '');
        for (const entry of node.evidence.entries) {
          lines.push(`- ${entry.source} (${entry.type})`);
        }
        lines.push('');
      }
    }

    if (includeGraph) {
      lines.push('## Graph', '', '```mermaid', toMermaid(
        graph.nodes.map((node) => ({
          id: node.contract.id,
          type: node.type,
          version: node.contract.version,
          status: node.contract.status,
        })),
        graph.edges.map((edge) => ({
          from: edge.from,
          to: edge.to,
          type: toApiGraphEdgeType(edge.type),
        })),
      ), '```');
    }

    return {
      capability,
      format,
      content: lines.join('\n'),
      artifacts_included: graph.nodes.length,
      generated_at: new Date().toISOString(),
    };
  });

  return success(result, durationMs, result.artifacts_included);
}

async function handleCompile(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const target = asString(pickInput(input, 'target', 'target')) as CompilerTargetId | undefined;
  const capability = asString(pickInput(input, 'capability', 'capability'));
  const outputDir = asString(pickInput(input, 'outputDir', 'output_dir'));

  if (!target) {
    return failure('INVALID_INPUT', 'target is required', 0);
  }
  if (!capability) {
    return failure('INVALID_INPUT', 'capability is required', 0);
  }

  try {
    const { result, durationMs } = await timed(async () =>
      runCompile(ctx, {
        target,
        capability,
        outputDir,
        minStatus: (asString(pickInput(input, 'minStatus', 'min_status')) ?? 'draft') as never,
      }),
    );

    return success(result, durationMs, result.artifacts_compiled);
  } catch (error) {
    if (error instanceof CompileNotImplementedError) {
      return failure('NOT_IMPLEMENTED', error.message, 0);
    }
    throw error;
  }
}

async function handleExport(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const target = asString(pickInput(input, 'target', 'target')) as CompilerTargetId | undefined;

  if (!target) {
    return failure('INVALID_INPUT', 'target is required', 0);
  }

  try {
    const minStatusRaw = asString(pickInput(input, 'minStatus', 'min_status'));
    const { result, durationMs } = await timed(async () =>
      runExport(ctx, {
        target,
        scope: (asString(pickInput(input, 'scope', 'scope')) ?? 'all') as 'all' | 'pack' | 'capability',
        pack: asString(pickInput(input, 'pack', 'pack')),
        capability: asString(pickInput(input, 'capability', 'capability')),
        outputDir: asString(pickInput(input, 'outputDir', 'output_dir')),
        ...(minStatusRaw ? { minStatus: minStatusRaw as never } : {}),
      }),
    );

    return success(result, durationMs, result.files_written);
  } catch (error) {
    if (error instanceof ExportNotImplementedError || error instanceof ExportUnsupportedTargetError) {
      return failure('NOT_IMPLEMENTED', error.message, 0);
    }
    throw error;
  }
}

async function handleCapture(
  ctx: EorContext,
  input: Record<string, unknown>,
): Promise<ToolResponse<unknown>> {
  const action = asString(pickInput(input, 'action', 'action')) as
    | 'learn'
    | 'list'
    | 'review'
    | 'extract'
    | 'status'
    | undefined;

  if (!action) {
    return failure('INVALID_INPUT', 'action is required (learn|list|review|extract|status)', 0);
  }

  try {
    const { result, durationMs } = await timed(async () =>
      runCapture(ctx.repositoryRoot, action, input),
    );
    return success(result, durationMs);
  } catch (error) {
    if (error instanceof CaptureError) {
      return failure('INVALID_INPUT', error.message, 0);
    }
    throw error;
  }
}

function handleNotImplemented(feature: string): Handler {
  return async (_ctx, _input) =>
    failure('NOT_IMPLEMENTED', `${feature} is not implemented in EOR v0.1.0`, 0);
}

async function readManifest(ctx: EorContext, path: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await ctx.readRepositoryFile(path);
    return parseContractYaml(raw);
  } catch {
    return null;
  }
}

async function expandDirection(
  ctx: EorContext,
  rootId: ArtifactId,
  direction: 'downstream' | 'upstream',
  collected: Set<ArtifactId>,
  nodes: { contract: { id: ArtifactId; dependencies: ArtifactId[] } }[],
  depth: number,
): Promise<void> {
  const queue: Array<{ id: ArtifactId; level: number }> = [{ id: rootId, level: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    const node = await ctx.requireStore().load(current.id);
    if (!node) {
      continue;
    }

    if (!collected.has(current.id)) {
      collected.add(current.id);
      nodes.push(node);
    }

    if (depth >= 0 && current.level >= depth) {
      continue;
    }

    const nextIds =
      direction === 'downstream'
        ? collectReferences(node)
        : await findReferrers(ctx, current.id);

    for (const nextId of nextIds) {
      if (!collected.has(nextId)) {
        queue.push({ id: nextId, level: current.level + 1 });
      }
    }
  }
}

function collectReferences(node: {
  contract: {
    id: ArtifactId;
    dependencies: ArtifactId[];
    orchestrates?: {
      competencies?: ArtifactId[];
      agents?: ArtifactId[];
      skills?: ArtifactId[];
      workflows?: ArtifactId[];
    };
    replaces?: ArtifactId;
  };
}): ArtifactId[] {
  const refs = [...node.contract.dependencies];
  const orchestrates = node.contract.orchestrates;
  if (orchestrates) {
    refs.push(
      ...(orchestrates.competencies ?? []),
      ...(orchestrates.agents ?? []),
      ...(orchestrates.skills ?? []),
      ...(orchestrates.workflows ?? []),
    );
  }
  if (node.contract.replaces) {
    refs.push(node.contract.replaces);
  }
  return refs;
}

async function findReferrers(ctx: EorContext, targetId: ArtifactId): Promise<ArtifactId[]> {
  const referrers: ArtifactId[] = [];

  for (const entry of ctx.requireIndex().listAll()) {
    if (entry.id === targetId) {
      continue;
    }

    const contract = await contractFromEntry(ctx.repositoryRoot, entry);
    if (!contract) {
      continue;
    }

    const refs = [...contract.dependencies];
    const orchestrates = contract.orchestrates;
    if (orchestrates) {
      refs.push(
        ...(orchestrates.competencies ?? []),
        ...(orchestrates.agents ?? []),
        ...(orchestrates.skills ?? []),
        ...(orchestrates.workflows ?? []),
      );
    }

    if (refs.includes(targetId)) {
      referrers.push(entry.id);
    }
  }

  return referrers;
}

function dedupeNodes<T extends { contract: { id: string } }>(nodes: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const node of nodes) {
    if (seen.has(node.contract.id)) {
      continue;
    }
    seen.add(node.contract.id);
    unique.push(node);
  }
  return unique;
}

function toMermaid(
  nodes: Array<{ id: string; type: string }>,
  edges: Array<{ from: string; to: string; type: string }>,
): string {
  const lines = ['graph TD'];
  for (const node of nodes) {
    const safeId = node.id.replace(/\./g, '_');
    lines.push(`  ${safeId}["${node.id}"]`);
  }
  for (const edge of edges) {
    lines.push(`  ${edge.from.replace(/\./g, '_')} --> ${edge.to.replace(/\./g, '_')}`);
  }
  return lines.join('\n');
}
