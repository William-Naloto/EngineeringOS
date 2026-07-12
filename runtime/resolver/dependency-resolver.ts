import type { ArtifactId, ArtifactType, KnowledgeNode } from '../ast/interfaces.ts';
import type { ArtifactIndex } from '../index/interfaces.ts';

import { filterNodes } from './filters.ts';
import type { ResolveConfig, ResolvedGraph, ResolveStats, DependencyResolver } from './interfaces.ts';
import { ArtifactStore, ResolverException } from './artifact-store.ts';
import { collectEdges, topologicalSort } from './topological-sort.ts';
import type { Parser } from '../parser/interfaces.ts';

export interface EklDependencyResolverOptions {
  repositoryRoot: string;
  index: ArtifactIndex;
  parser: Parser;
  excludeLifecycleCreated?: boolean;
  migrationMode?: boolean;
}

export class EklDependencyResolver implements DependencyResolver {
  private readonly store: ArtifactStore;
  private readonly excludeLifecycleCreated: boolean;
  private readonly migrationMode: boolean;
  private readonly options: EklDependencyResolverOptions;

  constructor(options: EklDependencyResolverOptions) {
    this.options = options;
    this.store = new ArtifactStore(
      options.index,
      options.parser,
      options.repositoryRoot,
    );
    this.excludeLifecycleCreated = options.excludeLifecycleCreated ?? true;
    this.migrationMode = options.migrationMode ?? false;
  }

  async resolve(config: ResolveConfig): Promise<ResolvedGraph> {
    if (config.capabilities.length === 0) {
      throw new ResolverException('INVALID_CAPABILITY', 'At least one capability must be provided');
    }

    const seedIds = new Set<ArtifactId>();

    for (const capabilityId of config.capabilities) {
      const capability = await this.store.load(capabilityId);
      if (!capability || capability.type !== 'capability') {
        throw new ResolverException('NOT_FOUND', `Capability not found: ${capabilityId}`);
      }
      seedIds.add(capabilityId);

      const orchestrated = await this.store.expandOrchestrationIds(capabilityId);
      for (const id of orchestrated) {
        seedIds.add(id);
      }
    }

    const withDependencies = await this.store.expandDependencyIds(seedIds);
    const loaded: KnowledgeNode[] = [];

    for (const id of withDependencies) {
      const node = await this.store.load(id);
      if (node) {
        loaded.push(node);
      }
    }

    const filtered = filterNodes(loaded, {
      minStatus: config.minStatus,
      minConfidence: config.minConfidence,
      excludeLifecycleCreated: this.excludeLifecycleCreated,
      migrationMode: this.migrationMode,
    });

    if (filtered.length > config.maxArtifactsPerSession) {
      throw new ResolverException(
        'SCOPE_TOO_LARGE',
        `Resolved ${filtered.length} artifacts; max is ${config.maxArtifactsPerSession}`,
      );
    }

    const edges = collectEdges(filtered);
    const order = topologicalSort(filtered, edges);

    return {
      nodes: sortNodes(filtered, order),
      edges,
      order,
      stats: buildStats(filtered),
    };
  }

  async expandOrchestration(capabilityId: ArtifactId): Promise<ArtifactId[]> {
    return this.store.expandOrchestrationIds(capabilityId);
  }

  async expandDependencies(nodeId: ArtifactId): Promise<ArtifactId[]> {
    return this.store.expandDependencyIds([nodeId]);
  }

  topologicalSort(nodes: KnowledgeNode[], edges: ReturnType<typeof collectEdges>): ArtifactId[] {
    return topologicalSort(nodes, edges);
  }
}

function sortNodes(nodes: KnowledgeNode[], order: ArtifactId[]): KnowledgeNode[] {
  const byId = new Map(nodes.map((node) => [node.contract.id, node]));
  return order.map((id) => byId.get(id)).filter((node): node is KnowledgeNode => Boolean(node));
}

function buildStats(nodes: KnowledgeNode[]): ResolveStats {
  return {
    totalNodes: nodes.length,
    capabilities: countType(nodes, 'capability'),
    competencies: countType(nodes, 'competency'),
    skills: countType(nodes, 'skill'),
    standards: countType(nodes, 'standard'),
  };
}

function countType(nodes: KnowledgeNode[], type: ArtifactType): number {
  return nodes.filter((node) => node.type === type).length;
}

export function createResolver(options: EklDependencyResolverOptions): DependencyResolver {
  return new EklDependencyResolver(options);
}
