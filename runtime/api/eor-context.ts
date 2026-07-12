import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactIndex } from '../index/interfaces.ts';
import { buildFilesystemIndex } from '../index/filesystem-index.ts';
import { loadCompetencyTopics } from '../index/competency-manifest.ts';
import { MarkdownParser } from '../parser/markdown-parser.ts';
import type { Parser } from '../parser/interfaces.ts';
import { createResolver } from '../resolver/dependency-resolver.ts';
import type { DependencyResolver } from '../resolver/interfaces.ts';
import { ArtifactStore } from '../resolver/artifact-store.ts';
import { createRouter } from '../router/capability-router.ts';
import type { Router } from '../router/interfaces.ts';
import { createValidator } from '../validator/ekl-validator.ts';
import type { Validator } from '../validator/interfaces.ts';

export type RuntimePhase = 'INIT' | 'READY' | 'ACTIVE' | 'SHUTDOWN';

export class EorContext {
  phase: RuntimePhase = 'INIT';
  index: ArtifactIndex | null = null;
  readonly parser: Parser;
  readonly validator: Validator;
  resolver: DependencyResolver | null = null;
  router: Router | null = null;
  store: ArtifactStore | null = null;
  readonly repositoryRoot: string;

  constructor(repositoryRoot: string) {
    this.repositoryRoot = repositoryRoot;
    this.parser = new MarkdownParser();
    this.validator = createValidator({
      ownershipRegistryPath: join(repositoryRoot, 'OWNERS.md'),
    });
  }

  async initialize(): Promise<void> {
    this.phase = 'INIT';
    this.index = await buildFilesystemIndex({
      root: this.repositoryRoot,
      excludeResearch: true,
    });

    this.resolver = createResolver({
      repositoryRoot: this.repositoryRoot,
      index: this.index,
      parser: this.parser,
      excludeLifecycleCreated: false,
    });

    this.router = createRouter({
      repositoryRoot: this.repositoryRoot,
      index: this.index,
    });

    this.store = new ArtifactStore(this.index, this.parser, this.repositoryRoot);
    this.phase = 'ACTIVE';
  }

  async shutdown(): Promise<void> {
    this.phase = 'SHUTDOWN';
  }

  requireIndex(): ArtifactIndex {
    if (!this.index) {
      throw new Error('EOR context is not initialized');
    }
    return this.index;
  }

  requireResolver(): DependencyResolver {
    if (!this.resolver) {
      throw new Error('EOR resolver is not initialized');
    }
    return this.resolver;
  }

  requireRouter(): Router {
    if (!this.router) {
      throw new Error('EOR router is not initialized');
    }
    return this.router;
  }

  requireStore(): ArtifactStore {
    if (!this.store) {
      throw new Error('EOR artifact store is not initialized');
    }
    return this.store;
  }

  async loadCompetencyTopicCount(competencyId: string): Promise<number> {
    const topics = await loadCompetencyTopics(this.repositoryRoot, competencyId);
    return topics.length;
  }

  async readRepositoryFile(relativePath: string): Promise<string> {
    return readFile(join(this.repositoryRoot, relativePath), 'utf8');
  }
}
