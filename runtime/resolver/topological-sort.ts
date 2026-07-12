import type { ArtifactId, Edge, KnowledgeNode } from '../ast/interfaces.ts';
import { buildDependencyEdges } from '../validator/graph-rules.ts';

const TYPE_PRIORITY: Record<string, number> = {
  standard: 0,
  topic: 1,
  skill: 2,
  workflow: 3,
  agent: 4,
  competency: 5,
  capability: 6,
};

export function topologicalSort(nodes: KnowledgeNode[], edges: Edge[]): ArtifactId[] {
  const nodeIds = new Set(nodes.map((node) => node.contract.id));
  const inDegree = new Map<ArtifactId, number>();
  const adjacency = new Map<ArtifactId, ArtifactId[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      continue;
    }

    if (edge.type !== 'depends_on') {
      continue;
    }

    // from depends on to — prerequisite to must precede from
    adjacency.get(edge.to)?.push(edge.from);
    inDegree.set(edge.from, (inDegree.get(edge.from) ?? 0) + 1);
  }

  const queue = [...nodeIds]
    .filter((id) => (inDegree.get(id) ?? 0) === 0)
    .sort(compareIds);

  const order: ArtifactId[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    order.push(current);

    for (const next of adjacency.get(current) ?? []) {
      const degree = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, degree);
      if (degree === 0) {
        queue.push(next);
        queue.sort(compareIds);
      }
    }
  }

  if (order.length !== nodeIds.size) {
    return [...nodeIds].sort(compareIds);
  }

  return order;
}

function compareIds(a: ArtifactId, b: ArtifactId): number {
  const typeA = a.split('.')[0];
  const typeB = b.split('.')[0];
  const priorityDiff = (TYPE_PRIORITY[typeA] ?? 99) - (TYPE_PRIORITY[typeB] ?? 99);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return a.localeCompare(b);
}

export function collectEdges(nodes: KnowledgeNode[]): Edge[] {
  return nodes.flatMap((node) => buildDependencyEdges(node));
}
