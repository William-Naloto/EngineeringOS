import type { ArtifactStatus, ConfidenceLevel, KnowledgeNode } from '../ast/interfaces.ts';

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

export function meetsStatusFilter(node: KnowledgeNode, minStatus: ArtifactStatus): boolean {
  return STATUS_RANK[node.contract.status] >= STATUS_RANK[minStatus];
}

export function meetsConfidenceFilter(
  node: KnowledgeNode,
  minConfidence: ConfidenceLevel,
): boolean {
  return CONFIDENCE_RANK[node.contract.confidence] >= CONFIDENCE_RANK[minConfidence];
}

export function shouldExcludeLifecycle(
  node: KnowledgeNode,
  excludeLifecycleCreated: boolean,
): boolean {
  if (!excludeLifecycleCreated) {
    return false;
  }
  return node.contract.lifecycle === 'created';
}

export function shouldExcludeDeprecated(
  node: KnowledgeNode,
  migrationMode: boolean,
): boolean {
  if (migrationMode) {
    return false;
  }
  return node.contract.status === 'deprecated';
}

export function filterNodes(
  nodes: KnowledgeNode[],
  options: {
    minStatus: ArtifactStatus;
    minConfidence: ConfidenceLevel;
    excludeLifecycleCreated: boolean;
    migrationMode: boolean;
  },
): KnowledgeNode[] {
  return nodes.filter(
    (node) =>
      meetsStatusFilter(node, options.minStatus) &&
      meetsConfidenceFilter(node, options.minConfidence) &&
      !shouldExcludeLifecycle(node, options.excludeLifecycleCreated) &&
      !shouldExcludeDeprecated(node, options.migrationMode),
  );
}
