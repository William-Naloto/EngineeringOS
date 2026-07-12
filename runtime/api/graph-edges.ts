import type { EdgeType } from '../ast/interfaces.ts';

/** Graph edge types exposed by the MCP API — @see docs/mcp/api.md GraphEdge */
export type ApiGraphEdgeType =
  | 'depends_on'
  | 'orchestrates'
  | 'topic_of'
  | 'replaces'
  | 'enables';

/**
 * Map internal AST edge types to the API GraphEdge contract.
 */
export function toApiGraphEdgeType(edgeType: EdgeType): ApiGraphEdgeType {
  switch (edgeType) {
    case 'depends_on':
      return 'depends_on';
    case 'orchestrates_competency':
    case 'orchestrates_skill':
    case 'orchestrates_workflow':
    case 'orchestrates_agent':
      return 'orchestrates';
    case 'topic_of':
      return 'topic_of';
    case 'replaces':
      return 'replaces';
    case 'enables_capability':
      return 'enables';
    default: {
      const exhaustive: never = edgeType;
      return exhaustive;
    }
  }
}

/** Deduplicate graph edges by endpoint pair and API edge type. */
export function dedupeGraphEdges<T extends { from: string; to: string; type: string }>(
  edges: T[],
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const edge of edges) {
    const key = `${edge.from}|${edge.to}|${edge.type}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(edge);
  }

  return unique;
}
