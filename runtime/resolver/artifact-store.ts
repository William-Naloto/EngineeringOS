import { join } from 'node:path';

import type { ArtifactId, KnowledgeNode } from '../ast/interfaces.ts';
import type { ArtifactIndex } from '../index/interfaces.ts';
import { loadCompetencyManifestNode, loadCompetencyTopics } from '../index/competency-manifest.ts';
import type { Parser } from '../parser/interfaces.ts';

export class ResolverException extends Error {
  readonly code: 'NOT_FOUND' | 'SCOPE_TOO_LARGE' | 'INVALID_CAPABILITY';

  constructor(code: ResolverException['code'], message: string) {
    super(message);
    this.name = 'ResolverException';
    this.code = code;
  }
}

export class ArtifactStore {
  private readonly cache = new Map<ArtifactId, KnowledgeNode>();
  private readonly index: ArtifactIndex;
  private readonly parser: Parser;
  private readonly repositoryRoot: string;

  constructor(index: ArtifactIndex, parser: Parser, repositoryRoot: string) {
    this.index = index;
    this.parser = parser;
    this.repositoryRoot = repositoryRoot;
  }

  async load(id: ArtifactId): Promise<KnowledgeNode | undefined> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const entry = this.index.lookup(id);
    if (!entry) {
      return undefined;
    }

    const absolutePath = join(this.repositoryRoot, entry.path);

    if (entry.path.endsWith('manifest.yaml')) {
      const manifestNode = await loadCompetencyManifestNode(this.repositoryRoot, entry.path);
      if (!manifestNode) {
        return undefined;
      }
      this.cache.set(id, manifestNode);
      return manifestNode;
    }

    try {
      const result = await this.parser.parseFile(absolutePath);
      this.cache.set(id, result.node);
      return result.node;
    } catch {
      return undefined;
    }
  }

  async expandOrchestrationIds(capabilityId: ArtifactId): Promise<ArtifactId[]> {
    const node = await this.load(capabilityId);
    if (!node || node.type !== 'capability') {
      return [];
    }

    const ids = new Set<ArtifactId>();
    const orchestrates = node.contract.orchestrates;

    for (const competencyId of orchestrates?.competencies ?? []) {
      ids.add(competencyId);
      const topics = await loadCompetencyTopics(this.repositoryRoot, competencyId);
      for (const topicId of topics) {
        ids.add(topicId);
      }
    }

    for (const agentId of orchestrates?.agents ?? []) {
      ids.add(agentId);
    }
    for (const skillId of orchestrates?.skills ?? []) {
      ids.add(skillId);
    }
    for (const workflowId of orchestrates?.workflows ?? []) {
      ids.add(workflowId);
    }

    return [...ids];
  }

  async expandDependencyIds(seedIds: Iterable<ArtifactId>): Promise<ArtifactId[]> {
    const queue = [...seedIds];
    const collected = new Set<ArtifactId>();

    while (queue.length > 0) {
      const id = queue.shift();
      if (!id || collected.has(id)) {
        continue;
      }

      collected.add(id);
      const node = await this.load(id);
      if (!node) {
        continue;
      }

      for (const dependencyId of node.contract.dependencies) {
        if (!collected.has(dependencyId)) {
          queue.push(dependencyId);
        }
      }
    }

    return [...collected];
  }
}
