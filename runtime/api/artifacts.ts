import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactStatus, ArtifactType, KnowledgeNode } from '../ast/interfaces.ts';
import type { IndexEntry } from '../ast/interfaces.ts';
import { loadCompetencyManifestNode } from '../index/competency-manifest.ts';
import { extractFrontmatter } from '../parser/extract-frontmatter.ts';
import { parseContract } from '../parser/parse-contract.ts';

import type { ArtifactDetail, ArtifactSummary } from './interfaces.ts';

export async function contractFromEntry(
  repositoryRoot: string,
  entry: IndexEntry,
): Promise<ReturnType<typeof parseContract> | null> {
  try {
    if (entry.path.endsWith('manifest.yaml')) {
      const node = await loadCompetencyManifestNode(repositoryRoot, entry.path);
      return node?.contract ?? null;
    }

    const raw = await readFile(join(repositoryRoot, entry.path), 'utf8');
    const { frontmatter } = extractFrontmatter(raw);
    return parseContract(frontmatter);
  } catch {
    return null;
  }
}

export function toArtifactSummary(
  entry: IndexEntry,
  contract: NonNullable<Awaited<ReturnType<typeof contractFromEntry>>>,
): ArtifactSummary {
  return {
    id: contract.id,
    type: entry.type,
    version: contract.version,
    status: contract.status,
    lifecycle: contract.lifecycle,
    owner: contract.owner,
    confidence: contract.confidence,
    path: entry.path,
    provides: contract.provides,
  };
}

export function toArtifactDetail(
  node: KnowledgeNode,
  options: { includeBody?: boolean; includeEvidence?: boolean } = {},
): ArtifactDetail {
  const detail: ArtifactDetail = {
    id: node.contract.id,
    type: node.type,
    version: node.contract.version,
    status: node.contract.status,
    lifecycle: node.contract.lifecycle,
    owner: node.contract.owner,
    confidence: node.contract.confidence,
    path: node.path,
    provides: node.contract.provides,
    dependencies: node.contract.dependencies,
    orchestrates: node.contract.orchestrates,
  };

  if (options.includeBody) {
    detail.body = node.body.raw;
  }

  if (options.includeEvidence) {
    detail.evidence = node.evidence.entries;
  }

  return detail;
}

export function matchesQuery(haystack: string, query: string): boolean {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(Boolean);
  const target = haystack.toLowerCase();
  return terms.every((term) => target.includes(term));
}

export function domainFromId(id: string): string | undefined {
  const parts = id.split('.');
  return parts.length >= 2 ? parts[1] : undefined;
}

export function isArtifactStatus(value: unknown): value is ArtifactStatus {
  return value === 'draft' || value === 'experimental' || value === 'stable' || value === 'deprecated';
}

export function isArtifactType(value: unknown): value is ArtifactType {
  return (
    value === 'capability' ||
    value === 'competency' ||
    value === 'agent' ||
    value === 'topic' ||
    value === 'skill' ||
    value === 'workflow' ||
    value === 'standard' ||
    value === 'template' ||
    value === 'pack' ||
    value === 'adr'
  );
}
