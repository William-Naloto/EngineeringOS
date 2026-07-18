#!/usr/bin/env node
/**
 * Export machine-readable capability catalog from EOR runtime.
 * Usage: ENGINEERINGOS_ROOT=. npm run catalog
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createEngineeringOsRuntime } from '../runtime/api/runtime.ts';

const repositoryRoot = process.env.ENGINEERINGOS_ROOT ?? process.cwd();
const runtime = await createEngineeringOsRuntime(repositoryRoot);

const statusResponse = await runtime.api.invoke('engineeringos.status', {});
const capabilitiesResponse = await runtime.api.invoke('engineeringos.capabilities', { limit: 200 });
const competenciesResponse = await runtime.api.invoke('engineeringos.competencies', { limit: 200 });
const skillsResponse = await runtime.api.invoke('engineeringos.skills', { limit: 200 });

const capabilityIds = (
  capabilitiesResponse.data as { capabilities: Array<{ id: string }> }
).capabilities.map((item) => item.id);

const graphs: Record<string, unknown> = {};
for (const capabilityId of capabilityIds) {
  const graphResponse = await runtime.api.invoke('engineeringos.graph', {
    capability: capabilityId,
  });
  graphs[capabilityId] = graphResponse.data;
}

const catalog = {
  generated_at: new Date().toISOString(),
  ekl_version: '1.0.0',
  release: '0.1.1',
  repository: repositoryRoot,
  status: statusResponse.data,
  capabilities: capabilitiesResponse.data,
  competencies: competenciesResponse.data,
  skills: skillsResponse.data,
  graphs,
  summary: {
    capability_count: capabilityIds.length,
    experimental: (
      capabilitiesResponse.data as { capabilities: Array<{ status: string }> }
    ).capabilities.filter((item) => item.status === 'experimental').length,
    draft: (
      capabilitiesResponse.data as { capabilities: Array<{ status: string }> }
    ).capabilities.filter((item) => item.status === 'draft').length,
  },
};

const outputPath = join(repositoryRoot, 'versions', 'capability-catalog.snapshot.json');
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

console.log(`Catalog exported: ${outputPath}`);
console.log(`Capabilities: ${catalog.summary.capability_count} (${catalog.summary.experimental} experimental, ${catalog.summary.draft} draft)`);
console.log(`Competencies: ${(competenciesResponse.data as { total: number }).total}`);
console.log(`Artifacts indexed: ${(statusResponse.data as { index: { entries: number } }).index.entries}`);
