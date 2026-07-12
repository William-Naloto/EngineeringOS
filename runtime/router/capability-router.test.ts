import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildFilesystemIndex } from '../index/filesystem-index.ts';
import { createRouter } from './capability-router.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

async function createTestRouter() {
  const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });
  return createRouter({ repositoryRoot: repoRoot, index });
}

describe('EklRouter', () => {
  it('matches capability by explicit id', async () => {
    const router = await createTestRouter();
    const result = await router.route({
      capability: 'capability.engineering.review-pr',
    }, {
      capabilityFirst: true,
      includeOrphanSkills: false,
      excludeResearch: true,
      excludeLifecycleCreated: false,
      migrationMode: false,
    });

    assert.deepEqual(result.matchedCapabilities, ['capability.engineering.review-pr']);
  });

  it('matches capabilities by query triggers', async () => {
    const router = await createTestRouter();
    const result = await router.matchCapabilities({
      query: 'pull request review',
    }, {
      capabilityFirst: true,
      includeOrphanSkills: false,
      excludeResearch: true,
      excludeLifecycleCreated: false,
      migrationMode: false,
    });

    assert.ok(result.includes('capability.engineering.review-pr'));
  });

  it('does not include orphan skills unless configured', async () => {
    const router = await createTestRouter();
    const result = await router.route({
      query: 'semantic model',
    }, {
      capabilityFirst: true,
      includeOrphanSkills: false,
      excludeResearch: true,
      excludeLifecycleCreated: false,
      migrationMode: false,
    });

    const skillMatches = result.matchedArtifacts.filter((id) => id.startsWith('skill.'));
    assert.equal(skillMatches.length, 0);
  });

  it('includes direct agent matches when capability-first is disabled', async () => {
    const router = await createTestRouter();
    const config = {
      capabilityFirst: true,
      includeOrphanSkills: false,
      excludeResearch: true,
      excludeLifecycleCreated: false,
      migrationMode: false,
    } as const;

    const capabilityFirst = await router.route({ query: 'reviewer' }, config);
    const nonCapabilityFirst = await router.route(
      { query: 'reviewer' },
      { ...config, capabilityFirst: false },
    );

    assert.ok(!capabilityFirst.matchedArtifacts.includes('agent.reviewer'));
    assert.ok(nonCapabilityFirst.matchedArtifacts.includes('agent.reviewer'));
  });

  it('lists capabilities by type', async () => {
    const router = await createTestRouter();
    const capabilities = await router.matchByType('capability', undefined, {
      capabilityFirst: true,
      includeOrphanSkills: false,
      excludeResearch: true,
      excludeLifecycleCreated: false,
      migrationMode: false,
    });

    assert.ok(capabilities.length >= 1);
    assert.ok(capabilities.every((id) => id.startsWith('capability.')));
  });
});
