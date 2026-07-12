/**
 * EOR Dependency Resolver — interface definitions only.
 * @see docs/mcp/runtime.md §6
 */

import type {
  ArtifactId,
  ArtifactStatus,
  ConfidenceLevel,
  Edge,
  KnowledgeNode,
} from '../ast/interfaces.ts';

export interface ResolveConfig {
  capabilities: ArtifactId[];
  minStatus: ArtifactStatus;
  minConfidence: ConfidenceLevel;
  maxArtifactsPerSession: number;
  includeOrphanSkills: boolean;
  projectOverlayPath?: string;
}

export interface ResolvedGraph {
  nodes: KnowledgeNode[];
  edges: Edge[];
  order: ArtifactId[];
  stats: ResolveStats;
}

export interface ResolveStats {
  totalNodes: number;
  capabilities: number;
  competencies: number;
  skills: number;
  standards: number;
}

/**
 * Expands scoped requests into minimal, ordered artifact subgraphs.
 * MUST apply capability-first expansion.
 */
export interface DependencyResolver {
  resolve(config: ResolveConfig): Promise<ResolvedGraph>;
  expandOrchestration(capabilityId: ArtifactId): Promise<ArtifactId[]>;
  expandDependencies(nodeId: ArtifactId): Promise<ArtifactId[]>;
  topologicalSort(nodes: KnowledgeNode[], edges: Edge[]): ArtifactId[];
}
