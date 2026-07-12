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
    assert.equal(tools.length, 19);
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

  it('returns NOT_IMPLEMENTED for compile', async () => {
    const runtime = await createEngineeringOsRuntime(repoRoot);
    const response = await runtime.api.invoke('engineeringos.compile', {
      target: 'cursor',
      capability: 'capability.engineering.review-pr',
    });

    assert.equal(response.ok, false);
    assert.equal(response.error?.code, 'NOT_IMPLEMENTED');
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
