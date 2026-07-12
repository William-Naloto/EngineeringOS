import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildFilesystemIndex } from '../index/filesystem-index.ts';
import { MarkdownParser } from '../parser/markdown-parser.ts';
import { createResolver } from './dependency-resolver.ts';
import { ResolverException } from './artifact-store.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

async function createTestResolver() {
  const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });
  return createResolver({
    repositoryRoot: repoRoot,
    index,
    parser: new MarkdownParser(),
    excludeLifecycleCreated: false,
    migrationMode: false,
  });
}

describe('EklDependencyResolver', () => {
  it('resolves capability.engineering.review-pr with orchestrated topics', async () => {
    const resolver = await createTestResolver();
    const graph = await resolver.resolve({
      capabilities: ['capability.engineering.review-pr'],
      minStatus: 'draft',
      minConfidence: 'Unknown',
      maxArtifactsPerSession: 50,
      includeOrphanSkills: false,
    });

    const ids = graph.nodes.map((node) => node.contract.id);

    assert.ok(ids.includes('capability.engineering.review-pr'));
    assert.ok(ids.includes('competency.principal-software-architect'));
    assert.ok(ids.includes('topic.architecture.design-principles'));
    assert.ok(graph.stats.capabilities >= 1);
    assert.ok(graph.order[0] !== 'capability.engineering.review-pr' || graph.order.length === 1);
    assert.equal(graph.order.length, graph.nodes.length);
  });

  it('expands orchestration ids for a capability', async () => {
    const resolver = await createTestResolver();
    const ids = await resolver.expandOrchestration('capability.engineering.review-pr');

    assert.ok(ids.includes('competency.principal-software-architect'));
    assert.ok(ids.includes('topic.architecture.architecture-review'));
    assert.ok(ids.includes('agent.reviewer'));
  });

  it('rejects scope larger than maxArtifactsPerSession', async () => {
    const resolver = await createTestResolver();

    await assert.rejects(
      () =>
        resolver.resolve({
          capabilities: ['capability.engineering.review-pr'],
          minStatus: 'draft',
          minConfidence: 'Unknown',
          maxArtifactsPerSession: 3,
          includeOrphanSkills: false,
        }),
      (error: unknown) => error instanceof ResolverException && error.code === 'SCOPE_TOO_LARGE',
    );
  });
});

describe('FilesystemArtifactIndex', () => {
  it('indexes capabilities and topics from the repository', async () => {
    const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });

    assert.ok(index.lookup('capability.engineering.review-pr'));
    assert.ok(index.lookup('topic.architecture.design-principles'));
    assert.ok(index.lookup('competency.principal-software-architect'));
    assert.ok(index.listByType('capability').length >= 1);
  });

  it('stores overlay entry paths relative to repository root', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'eor-index-'));
    const overlayRoot = join(tempRoot, '.engineeringos');
    const artifactBody = `---
id: capability.test.overlay
version: "0.1.0"
status: draft
lifecycle: created
owner: test
classification: Experimental
confidence: Unknown
dependencies: []
provides: []
requires: []
references: []
updated: 2026-07-12
reviewed: null
---

# Overlay capability
`;

    try {
      await mkdir(join(overlayRoot, 'capabilities'), { recursive: true });
      await writeFile(join(overlayRoot, 'capabilities', 'overlay.md'), artifactBody, 'utf8');

      const index = await buildFilesystemIndex({
        root: tempRoot,
        overlayPath: overlayRoot,
        excludeResearch: true,
      });

      const entry = index.lookup('capability.test.overlay');
      assert.ok(entry);
      assert.equal(entry.path, '.engineeringos/capabilities/overlay.md');
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
