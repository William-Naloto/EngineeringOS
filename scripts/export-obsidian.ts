#!/usr/bin/env node
/**
 * Export EngineeringOS knowledge to an Obsidian vault.
 * Usage: ENGINEERINGOS_ROOT=. npm run export:obsidian
 */

import { join } from 'node:path';
import { createEngineeringOsRuntime } from '../runtime/api/runtime.ts';

const repositoryRoot = process.env.ENGINEERINGOS_ROOT ?? process.cwd();
const outputDir =
  process.env.OBSIDIAN_OUTPUT_DIR ?? join(repositoryRoot, 'dist', 'obsidian-vault');
const scope = (process.env.OBSIDIAN_SCOPE ?? 'all') as 'all' | 'pack' | 'capability';
const capability = process.env.OBSIDIAN_CAPABILITY;
const pack = process.env.OBSIDIAN_PACK;

const minStatus = process.env.OBSIDIAN_MIN_STATUS as
  | 'draft'
  | 'experimental'
  | 'stable'
  | 'deprecated'
  | undefined;

const runtime = await createEngineeringOsRuntime(repositoryRoot);
const response = await runtime.api.invoke('engineeringos.export', {
  target: 'obsidian',
  scope,
  capability,
  pack,
  output_dir: outputDir,
  ...(minStatus ? { min_status: minStatus } : {}),
});

if (!response.ok) {
  console.error(JSON.stringify(response, null, 2));
  process.exit(1);
}

const data = response.data as {
  output_dir: string;
  files_written: number;
  output_files: string[];
};

console.log(`Obsidian vault exported: ${data.output_dir}`);
console.log(`Files written: ${data.files_written}`);
console.log('');
console.log('Open in Obsidian:');
console.log(`  File → Open folder as vault → ${data.output_dir}`);
console.log('');
console.log('Recommended plugins: Dataview, Templater, Obsidian Git, Mermaid');

await runtime.shutdown();
