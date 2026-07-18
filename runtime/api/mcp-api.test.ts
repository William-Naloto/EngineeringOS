import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createEngineeringOsRuntime } from './runtime.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

describe('EngineeringOsMcpApi', () => {
  it('lists all MCP tools', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const tools = runtime.api.listTools();

    assert.ok(tools.includes('engineeringos.status'));
    assert.ok(tools.includes('engineeringos.review'));
    assert.ok(tools.includes('engineeringos.compile'));
    assert.equal(tools.length, 20);
    await runtime.shutdown();
  });

  it('returns repository status', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.status', {});

    assert.equal(response.ok, true);
    assert.equal(response.meta.eorVersion, '0.1.0');
    assert.ok(response.data);
    await runtime.shutdown();
  });

  it('lists capabilities', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.capabilities', {
      domain: 'engineering',
      limit: 10,
    });

    assert.equal(response.ok, true);
    const data = response.data as { capabilities: Array<{ id: string }> };
    assert.ok(data.capabilities.some((item) => item.id === 'capability.engineering.review-pr'));
    await runtime.shutdown();
  });

  it('reviews a capability subgraph', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.review', {
      capability: 'capability.engineering.review-pr',
      include_body: false,
    });

    assert.equal(response.ok, true);
    const data = response.data as { order: string[] };
    assert.ok(data.order.includes('capability.engineering.review-pr'));
    assert.ok(data.order.length > 5);
    await runtime.shutdown();
  });

  it('matches capabilities via router-backed search', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.search', {
      query: 'review-pr',
      limit: 5,
    });

    assert.equal(response.ok, true);
    const data = response.data as { results: Array<{ artifact: { id: string } }> };
    assert.ok(data.results.length >= 1);
    await runtime.shutdown();
  });

  it('returns NOT_IMPLEMENTED for claude compile', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.compile', {
      target: 'claude',
      capability: 'capability.engineering.review-pr',
    });

    assert.equal(response.ok, false);
    assert.equal(response.error?.code, 'NOT_IMPLEMENTED');
    await runtime.shutdown();
  });

  it('compiles cursor capability bundle', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.compile', {
      target: 'cursor',
      capability: 'capability.fabric.monitoring',
    });

    assert.equal(response.ok, true);
    const data = response.data as { artifacts_compiled: number; output_dir: string };
    assert.equal(data.output_dir.includes('capability-fabric-monitoring'), true);
    assert.ok(data.artifacts_compiled >= 8);
    await runtime.shutdown();
  });

  it('exports obsidian vault', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const outputDir = join(repoRoot, 'dist', 'test-obsidian-export');
    const response = await runtime.api.invoke('engineeringos.export', {
      target: 'obsidian',
      scope: 'all',
      output_dir: outputDir,
    });

    assert.equal(response.ok, true);
    const data = response.data as { files_written: number; output_files: string[] };
    assert.ok(data.files_written >= 40);
    assert.ok(data.output_files.includes('Capabilities/fabric/monitoring.md'));
    await runtime.shutdown();
  });

  it('compiles obsidian capability slice', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.compile', {
      target: 'obsidian',
      capability: 'capability.fabric.monitoring',
    });

    assert.equal(response.ok, true);
    const data = response.data as { artifacts_compiled: number; capability: string };
    assert.equal(data.capability, 'capability.fabric.monitoring');
    assert.ok(data.artifacts_compiled >= 5);
    await runtime.shutdown();
  });

  it('runs capture pipeline status', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.capture', { action: 'status' });

    assert.equal(response.ok, true);
    const data = response.data as { research_notes: number; pipeline: string[] };
    assert.ok(data.research_notes >= 1);
    assert.deepEqual(data.pipeline, ['learn', 'review', 'extract', 'publish']);
    await runtime.shutdown();
  });

  it('rejects unknown tools', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.unknown' as never, {});

    assert.equal(response.ok, false);
    assert.equal(response.error?.code, 'INVALID_INPUT');
    await runtime.shutdown();
  });
});
