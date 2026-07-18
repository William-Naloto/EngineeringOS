/**
 * Obsidian vault compiler — MVP export from EKL filesystem index.
 */

import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { ArtifactId, ArtifactStatus, IndexEntry } from '../../ast/interfaces.ts';
import type { ArtifactIndex } from '../../index/interfaces.ts';
import type { DependencyResolver } from '../../resolver/interfaces.ts';
import type { CompilationResult, CompileConfig, OutputFile } from '../interfaces.ts';

import { vaultPathForEntry } from './vault-paths.ts';
import { collectKnownIds, injectWikilinks } from './wikilinks.ts';
import { meetsMinStatus, parseStatusFromRaw } from './status-filter.ts';
import { resolveScopedEntries, shouldExportEntry } from '../resolve-scope.ts';

function injectWikilinksInBody(raw: string, knownIds: ReadonlySet<string>): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!match) {
    return injectWikilinks(raw, knownIds);
  }

  const frontmatter = match[0];
  const body = raw.slice(frontmatter.length);
  return frontmatter + injectWikilinks(body, knownIds);
}

export interface ObsidianExportOptions {
  repositoryRoot: string;
  outputDir: string;
  index: ArtifactIndex;
  resolver?: DependencyResolver;
  scope: 'all' | 'pack' | 'capability';
  pack?: string;
  capability?: ArtifactId;
  minStatus?: ArtifactStatus;
  injectWikilinks?: boolean;
}

export interface ObsidianExportResult {
  target: 'obsidian';
  outputDir: string;
  filesWritten: number;
  outputFiles: string[];
  warnings: string[];
}

export async function exportObsidianVault(
  options: ObsidianExportOptions,
): Promise<ObsidianExportResult> {
  const entries = await resolveScopedEntries({
    index: options.index,
    resolver: options.resolver,
    scope: options.scope,
    pack: options.pack,
    capability: options.capability,
  });
  const knownIds = collectKnownIds(entries.map((entry) => entry.id));
  const outputFiles: string[] = [];
  const warnings: string[] = [];
  const injectLinks = options.injectWikilinks ?? true;
  const minStatus = options.minStatus;
  const linkEdges: Array<{ from: ArtifactId; to: ArtifactId }> = [];

  for (const entry of entries) {
    if (!shouldExportEntry(entry)) {
      continue;
    }

    const vaultPath = vaultPathForEntry(entry);
    const absolutePath = join(options.outputDir, vaultPath);
    await mkdir(dirname(absolutePath), { recursive: true });

    const sourcePath = join(options.repositoryRoot, entry.path);
    let raw = await readFile(sourcePath, 'utf8');

    if (minStatus) {
      const status = parseStatusFromRaw(raw);
      if (!meetsMinStatus(status, minStatus)) {
        warnings.push(`Skipped ${entry.id}: status ${status ?? 'unknown'} below minStatus ${minStatus}`);
        continue;
      }
    }

    if (injectLinks && entry.path.endsWith('.md')) {
      raw = injectWikilinksInBody(raw, knownIds);
      collectLinkEdges(entry.id, raw, knownIds, linkEdges);
    }

    await writeFile(absolutePath, raw, 'utf8');
    outputFiles.push(vaultPath);
  }

  const templateFiles = await exportTemplates(options);
  outputFiles.push(...templateFiles);

  const indexFiles = await writeVaultIndexes(options, entries, outputFiles, linkEdges);
  outputFiles.push(...indexFiles);

  return {
    target: 'obsidian',
    outputDir: options.outputDir,
    filesWritten: outputFiles.length,
    outputFiles,
    warnings,
  };
}

export async function compileObsidianGraph(
  graph: { nodes: Array<{ contract: { id: ArtifactId; status: ArtifactStatus } }> },
  config: CompileConfig,
  repositoryRoot: string,
  index: ArtifactIndex,
): Promise<CompilationResult> {
  const capability = graph.nodes.find((node) => node.contract.id.startsWith('capability.'))?.contract.id;
  if (!capability) {
    throw new Error('Resolved graph must include a capability node');
  }

  const result = await exportObsidianVault({
    repositoryRoot,
    outputDir: config.outputDir,
    index,
    scope: 'capability',
    capability,
    minStatus: config.minStatus,
    injectWikilinks: true,
  });

  return {
    target: 'obsidian',
    capability,
    artifactsCompiled: result.filesWritten,
    outputFiles: result.outputFiles.map((path) => ({
      path,
      type: path.endsWith('.yaml') ? 'yaml' : 'markdown',
      sizeBytes: 0,
    })),
    warnings: result.warnings,
    metadata: {
      eklVersion: '1.0.0',
      compiledAt: new Date().toISOString(),
      deterministic: true,
    },
  };
}

async function exportTemplates(options: ObsidianExportOptions): Promise<string[]> {
  const templatesDir = join(options.repositoryRoot, 'templates');
  const outputTemplatesDir = join(options.outputDir, '_templates');
  const outputFiles: string[] = [];

  let files: string[];
  try {
    files = await readdir(templatesDir);
  } catch {
    return outputFiles;
  }

  await mkdir(outputTemplatesDir, { recursive: true });

  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue;
    }
    const source = join(templatesDir, file);
    const target = join(outputTemplatesDir, file);
    await copyFile(source, target);
    outputFiles.push(`_templates/${file}`);
  }

  return outputFiles;
}

function collectLinkEdges(
  fromId: ArtifactId,
  content: string,
  knownIds: ReadonlySet<string>,
  edges: Array<{ from: ArtifactId; to: ArtifactId }>,
): void {
  const pattern = /\[\[([^\]]+)\]\]/g;
  for (const match of content.matchAll(pattern)) {
    const target = match[1];
    if (knownIds.has(target)) {
      edges.push({ from: fromId, to: target });
    }
  }
}

function toMermaidOverview(edges: Array<{ from: ArtifactId; to: ArtifactId }>): string {
  const unique = new Map<string, { from: ArtifactId; to: ArtifactId }>();
  for (const edge of edges) {
    unique.set(`${edge.from}->${edge.to}`, edge);
  }

  const lines = ['graph LR'];
  for (const edge of unique.values()) {
    const from = edge.from.replace(/\./g, '_');
    const to = edge.to.replace(/\./g, '_');
    lines.push(`  ${from}["${edge.from}"] --> ${to}["${edge.to}"]`);
  }

  return lines.join('\n');
}

async function writeVaultIndexes(
  options: ObsidianExportOptions,
  entries: IndexEntry[],
  exportedPaths: string[],
  linkEdges: Array<{ from: ArtifactId; to: ArtifactId }>,
): Promise<string[]> {
  const indexDir = join(options.outputDir, '_index');
  await mkdir(indexDir, { recursive: true });

  const capabilities = entries.filter((entry) => entry.type === 'capability');
  const packs = entries.filter((entry) => entry.type === 'pack');
  const skills = entries.filter((entry) => entry.type === 'skill');

  const capabilitiesMd = [
    '# Capabilities',
    '',
    `> Generated: ${new Date().toISOString()}`,
    '',
    '| ID | Path |',
    '|----|------|',
    ...capabilities.map((entry) => {
      const vaultPath = vaultPathForEntry(entry);
      return `| [[${entry.id}]] | ${vaultPath} |`;
    }),
    '',
    '## Dataview',
    '',
    '```dataview',
    'TABLE status, confidence, provides, file.link AS note',
    'FROM "Capabilities"',
    'SORT id ASC',
    '```',
    '',
  ].join('\n');

  const matrixMd = [
    '# Capability Matrix',
    '',
    `> Generated: ${new Date().toISOString()}`,
    '',
    '```dataview',
    'TABLE status, confidence, provides',
    'FROM "Capabilities"',
    'SORT status ASC, id ASC',
    '```',
    '',
    '## Packs',
    '',
    '```dataview',
    'TABLE file.link AS pack',
    'FROM "Packs"',
    'SORT file.name ASC',
    '```',
    '',
    '## Skills',
    '',
    '```dataview',
    'TABLE file.link AS skill',
    'FROM "Skills"',
    'SORT file.path ASC',
    '```',
    '',
  ].join('\n');

  const readmeMd = [
    '# EngineeringOS Vault',
    '',
    'Exported from EngineeringOS EKL canonical repository.',
    '',
    `- **Artifacts exported:** ${exportedPaths.length}`,
    `- **Capabilities:** ${capabilities.length}`,
    `- **Packs:** ${packs.length}`,
    `- **Skills:** ${skills.length}`,
    '',
    '## Navigation',
    '',
    '- [[_index/CAPABILITIES]]',
    '- [[_index/CAPABILITY_MATRIX]]',
    '- [[_index/graph-overview]]',
    '',
    '## Recommended plugins',
    '',
    '- Dataview',
    '- Templater',
    '- Obsidian Git',
    '- Mermaid',
    '',
  ].join('\n');

  const graphOverviewMd = [
    '# Graph Overview',
    '',
    `> Generated: ${new Date().toISOString()}`,
    '',
    `Links discovered: ${linkEdges.length}`,
    '',
    '```mermaid',
    toMermaidOverview(linkEdges),
    '```',
    '',
    '## Link index',
    '',
    ...linkEdges.slice(0, 100).map((edge) => `- [[${edge.from}]] → [[${edge.to}]]`),
    linkEdges.length > 100 ? `\n_…and ${linkEdges.length - 100} more links._` : '',
    '',
  ].join('\n');

  const files = [
    ['CAPABILITIES.md', capabilitiesMd],
    ['CAPABILITY_MATRIX.md', matrixMd],
    ['graph-overview.md', graphOverviewMd],
  ] as const;

  for (const [name, content] of files) {
    await writeFile(join(indexDir, name), `${content}\n`, 'utf8');
  }

  await writeFile(join(options.outputDir, 'README.md'), `${readmeMd}\n`, 'utf8');

  return ['README.md', '_index/CAPABILITIES.md', '_index/CAPABILITY_MATRIX.md', '_index/graph-overview.md'];
}
