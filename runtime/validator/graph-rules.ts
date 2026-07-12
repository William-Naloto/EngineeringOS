import type { ArtifactId, ASTGraph, Edge, EdgeType, KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { issue } from './issues.ts';

export function buildDependencyEdges(node: KnowledgeNode): Edge[] {
  const edges: Edge[] = [];
  const from = node.contract.id;

  for (const target of node.contract.dependencies) {
    edges.push({ from, to: target, type: 'depends_on' });
  }

  const orchestrates = node.contract.orchestrates;
  if (!orchestrates) {
    return edges;
  }

  for (const target of orchestrates.competencies ?? []) {
    edges.push({ from, to: target, type: 'orchestrates_competency' });
  }
  for (const target of orchestrates.agents ?? []) {
    edges.push({ from, to: target, type: 'orchestrates_agent' });
  }
  for (const target of orchestrates.skills ?? []) {
    edges.push({ from, to: target, type: 'orchestrates_skill' });
  }
  for (const target of orchestrates.workflows ?? []) {
    edges.push({ from, to: target, type: 'orchestrates_workflow' });
  }

  if (node.contract.replaces) {
    edges.push({ from, to: node.contract.replaces, type: 'replaces' });
  }

  return edges;
}

export function detectCycles(graph: ASTGraph): ValidationIssue[] {
  const adjacency = new Map<ArtifactId, ArtifactId[]>();

  for (const edge of graph.edges) {
    const targets = adjacency.get(edge.from) ?? [];
    targets.push(edge.to);
    adjacency.set(edge.from, targets);
  }

  const visiting = new Set<ArtifactId>();
  const visited = new Set<ArtifactId>();
  const issues: ValidationIssue[] = [];

  const dfs = (nodeId: ArtifactId, path: ArtifactId[]): void => {
    if (visiting.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      const cycle = [...path.slice(cycleStart), nodeId].join(' → ');
      issues.push(
        issue(
          nodeId,
          'dependency',
          'CYCLE_DETECTED',
          `Circular dependency detected: ${cycle}`,
        ),
      );
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visiting.add(nodeId);
    path.push(nodeId);

    for (const next of adjacency.get(nodeId) ?? []) {
      dfs(next, path);
    }

    path.pop();
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return issues;
}

export function validateDuplicateIds(graph: ASTGraph): ValidationIssue[] {
  const seen = new Map<ArtifactId, number>();

  for (const node of graph.nodes.values()) {
    seen.set(node.contract.id, (seen.get(node.contract.id) ?? 0) + 1);
  }

  const issues: ValidationIssue[] = [];
  for (const [id, count] of seen) {
    if (count > 1) {
      issues.push(
        issue(id, 'dependency', 'DUPLICATE_ID', `Artifact id "${id}" appears ${count} times in graph`),
      );
    }
  }

  return issues;
}

export function validateUnresolvedReferences(graph: ASTGraph): ValidationIssue[] {
  const knownIds = new Set(graph.nodes.keys());
  const issues: ValidationIssue[] = [];

  for (const node of graph.nodes.values()) {
    const refs = collectReferences(node);
    for (const ref of refs) {
      if (!knownIds.has(ref)) {
        issues.push(
          issue(
            node.contract.id,
            'dependency',
            'UNRESOLVED_REFERENCE',
            `Reference "${ref}" is not present in the validation graph`,
            'dependencies',
          ),
        );
      }
    }
  }

  return issues;
}

function collectReferences(node: KnowledgeNode): ArtifactId[] {
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

export function graphFromNodes(nodes: KnowledgeNode[]): ASTGraph {
  const nodeMap = new Map<ArtifactId, KnowledgeNode>();
  const edges: Edge[] = [];

  for (const node of nodes) {
    nodeMap.set(node.contract.id, node);
    edges.push(...buildDependencyEdges(node));
  }

  return {
    nodes: nodeMap,
    edges,
    metadata: {
      resolvedAt: new Date().toISOString(),
      nodeCount: nodeMap.size,
      edgeCount: edges.length,
    },
  };
}

export type { EdgeType };
