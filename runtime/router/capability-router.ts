import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactId, ArtifactStatus, ArtifactType, ConfidenceLevel } from '../ast/interfaces.ts';
import type { ArtifactIndex } from '../index/interfaces.ts';
import { extractFrontmatter } from '../parser/extract-frontmatter.ts';
import { parseContract } from '../parser/parse-contract.ts';

import type {
  MatchedSignal,
  RouteContext,
  RouteResult,
  Router,
  RouterConfig,
} from './interfaces.ts';

const DEFAULT_ROUTER_CONFIG: RouterConfig = {
  capabilityFirst: true,
  includeOrphanSkills: false,
  excludeResearch: true,
  excludeLifecycleCreated: true,
  migrationMode: false,
};

interface CapabilityMetadata {
  id: ArtifactId;
  status: ArtifactStatus;
  lifecycle: string;
  confidence: ConfidenceLevel;
  tags: string[];
  triggers: string[];
  provides: string[];
  path: string;
}

export interface EklRouterOptions {
  repositoryRoot: string;
  index: ArtifactIndex;
}

export class EklRouter implements Router {
  private capabilityCache: CapabilityMetadata[] | null = null;
  private readonly options: EklRouterOptions;

  constructor(options: EklRouterOptions) {
    this.options = options;
  }

  async route(context: RouteContext, config?: RouterConfig): Promise<RouteResult> {
    const resolved = { ...DEFAULT_ROUTER_CONFIG, ...config };
    const matchedCapabilities = await this.matchCapabilities(context, resolved);
    const signals: MatchedSignal[] = [];

    if (context.capability) {
      signals.push({
        signal: 'capability',
        value: context.capability,
        matchedIds: matchedCapabilities,
      });
    }

    if (context.tag) {
      signals.push({
        signal: 'tag',
        value: context.tag,
        matchedIds: matchedCapabilities,
      });
    }

    if (context.query) {
      signals.push({
        signal: 'query',
        value: context.query,
        matchedIds: matchedCapabilities,
      });
    }

    if (context.filePattern) {
      const fileMatches = await this.matchByFilePattern(context.filePattern, resolved);
      signals.push({
        signal: 'file_pattern',
        value: context.filePattern,
        matchedIds: fileMatches,
      });
      for (const id of fileMatches) {
        if (!matchedCapabilities.includes(id)) {
          matchedCapabilities.push(id);
        }
      }
    }

    const filteredCapabilities = matchedCapabilities.filter((id) =>
      this.capabilityPassesFilters(id, context, resolved),
    );

    const matchedArtifacts: ArtifactId[] = [...filteredCapabilities];

    if (context.query) {
      if (resolved.capabilityFirst) {
        if (resolved.includeOrphanSkills) {
          await this.appendQueryMatches(matchedArtifacts, ['skill'], context, resolved);
        }
      } else {
        await this.appendQueryMatches(
          matchedArtifacts,
          ['skill', 'agent', 'workflow'],
          context,
          resolved,
        );
      }
    }

    return {
      matchedCapabilities: filteredCapabilities,
      matchedArtifacts,
      signals,
    };
  }

  async matchCapabilities(context: RouteContext, config?: RouterConfig): Promise<ArtifactId[]> {
    const resolved = { ...DEFAULT_ROUTER_CONFIG, ...config };
    const capabilities = await this.loadCapabilities();

    if (context.capability) {
      const match = capabilities.find((item) => item.id === context.capability);
      return match ? [match.id] : [];
    }

    const matches = new Set<ArtifactId>();

    if (context.tag) {
      for (const capability of capabilities) {
        if (capability.tags.includes(context.tag)) {
          matches.add(capability.id);
        }
      }
    }

    if (context.query) {
      const terms = tokenize(context.query);
      for (const capability of capabilities) {
        if (matchesQuery(capability, terms)) {
          matches.add(capability.id);
        }
      }
    }

    if (matches.size === 0 && !context.tag && !context.query && !context.filePattern) {
      return capabilities.map((item) => item.id);
    }

    return [...matches].filter((id) => this.capabilityPassesFilters(id, context, resolved));
  }

  async matchByType(
    type: ArtifactType,
    filter?: RouteContext,
    config?: RouterConfig,
  ): Promise<ArtifactId[]> {
    const resolved = { ...DEFAULT_ROUTER_CONFIG, ...config };
    const entries = this.options.index.listByType(type);

    const ids: ArtifactId[] = [];
    for (const entry of entries) {
      if (resolved.excludeResearch && entry.path.includes('research/')) {
        continue;
      }

      const contract = await this.loadContractMetadata(entry.path);
      if (!contract) {
        continue;
      }

      if (filter?.minStatus && !meetsStatus(contract.status, filter.minStatus)) {
        continue;
      }

      if (filter?.minConfidence && !meetsConfidence(contract.confidence, filter.minConfidence)) {
        continue;
      }

      if (resolved.excludeLifecycleCreated && contract.lifecycle === 'created') {
        continue;
      }

      if (!resolved.migrationMode && contract.status === 'deprecated') {
        continue;
      }

      if (filter?.query && (type === 'skill' || type === 'agent' || type === 'workflow')) {
        const terms = tokenize(filter.query);
        const haystack = [contract.id, entry.path, ...contract.provides, ...(contract.tags ?? [])].join(' ');
        if (!terms.every((term) => haystack.toLowerCase().includes(term))) {
          continue;
        }
      }

      ids.push(entry.id);
    }

    return ids;
  }

  private async matchByFilePattern(
    pattern: string,
    config: RouterConfig,
  ): Promise<ArtifactId[]> {
    const capabilities = await this.loadCapabilities();
    const normalized = pattern.toLowerCase();

    return capabilities
      .filter((capability) => {
        if (config.excludeResearch && capability.path.includes('research/')) {
          return false;
        }
        return capability.path.toLowerCase().includes(normalized);
      })
      .map((capability) => capability.id);
  }

  private capabilityPassesFilters(
    id: ArtifactId,
    context: RouteContext,
    config: RouterConfig,
  ): boolean {
    const capability = this.capabilityCache?.find((item) => item.id === id);
    if (!capability) {
      return false;
    }

    if (config.excludeResearch && capability.path.includes('research/')) {
      return false;
    }

    if (context.minStatus && !meetsStatus(capability.status, context.minStatus)) {
      return false;
    }

    if (context.minConfidence && !meetsConfidence(capability.confidence, context.minConfidence)) {
      return false;
    }

    if (config.excludeLifecycleCreated && capability.lifecycle === 'created') {
      return false;
    }

    if (!config.migrationMode && capability.status === 'deprecated') {
      return false;
    }

    return true;
  }

  private async loadCapabilities(): Promise<CapabilityMetadata[]> {
    if (this.capabilityCache) {
      return this.capabilityCache;
    }

    const entries = this.options.index.listByType('capability');
    const capabilities: CapabilityMetadata[] = [];

    for (const entry of entries) {
      const contract = await this.loadContractMetadata(entry.path);
      if (!contract) {
        continue;
      }

      capabilities.push({
        id: contract.id,
        status: contract.status,
        lifecycle: contract.lifecycle,
        confidence: contract.confidence,
        tags: contract.tags ?? [],
        triggers: contract.triggers ?? [],
        provides: contract.provides,
        path: entry.path,
      });
    }

    this.capabilityCache = capabilities;
    return capabilities;
  }

  private async loadContractMetadata(path: string) {
    try {
      const raw = await readFile(join(this.options.repositoryRoot, path), 'utf8');
      const { frontmatter } = extractFrontmatter(raw);
      return parseContract(frontmatter);
    } catch {
      return null;
    }
  }

  private async appendQueryMatches(
    matchedArtifacts: ArtifactId[],
    types: ArtifactType[],
    context: RouteContext,
    config: RouterConfig,
  ): Promise<void> {
    for (const type of types) {
      const typeMatches = await this.matchByType(type, context, config);
      for (const id of typeMatches) {
        if (!matchedArtifacts.includes(id)) {
          matchedArtifacts.push(id);
        }
      }
    }
  }
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function matchesQuery(capability: CapabilityMetadata, terms: string[]): boolean {
  const haystack = [
    capability.id,
    capability.path,
    ...capability.triggers,
    ...capability.provides,
    ...capability.tags,
  ]
    .join(' ')
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

const STATUS_RANK: Record<ArtifactStatus, number> = {
  draft: 0,
  experimental: 1,
  stable: 2,
  deprecated: 3,
};

const CONFIDENCE_RANK: Record<ConfidenceLevel, number> = {
  Unknown: 0,
  Low: 1,
  Medium: 2,
  High: 3,
};

function meetsStatus(actual: ArtifactStatus, minimum: ArtifactStatus): boolean {
  return STATUS_RANK[actual] >= STATUS_RANK[minimum];
}

function meetsConfidence(actual: ConfidenceLevel, minimum: ConfidenceLevel): boolean {
  return CONFIDENCE_RANK[actual] >= CONFIDENCE_RANK[minimum];
}

export function createRouter(options: EklRouterOptions): Router {
  return new EklRouter(options);
}
