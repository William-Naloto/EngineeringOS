#!/usr/bin/env node
/**
 * Compile EngineeringOS capability to Cursor .cursor/rules and .cursor/skills.
 * Usage: ENGINEERINGOS_ROOT=. npm run export:cursor
 */

import { join } from 'node:path';
import { createEngineeringOsRuntime } from '../runtime/api/runtime.ts';

const repositoryRoot = process.env.ENGINEERINGOS_ROOT ?? process.cwd();
const capability =
  process.env.CURSOR_CAPABILITY ?? 'capability.fabric.monitoring';
const outputDir =
  process.env.CURSOR_OUTPUT_DIR ??
  join(repositoryRoot, 'dist', 'cursor-compile', capability.replace(/\./g, '-'));

const runtime = await createEngineeringOsRuntime(repositoryRoot);
const response = await runtime.api.invoke('engineeringos.compile', {
  target: 'cursor',
  capability,
  output_dir: outputDir,
});

if (!response.ok) {
  console.error(JSON.stringify(response, null, 2));
  process.exit(1);
}

const data = response.data as {
  output_dir: string;
  artifacts_compiled: number;
  output_files: Array<{ path: string }>;
};

console.log(`Cursor compile output: ${data.output_dir}`);
console.log(`Artifacts compiled: ${data.artifacts_compiled}`);
console.log('');
console.log('Install into your project:');
console.log(`  cp -R "${join(data.output_dir, 'cursor')}" /path/to/your/project/.cursor`);
console.log('');
console.log('Rules:');
for (const file of data.output_files.filter((f) => f.path.includes('cursor/rules/'))) {
  console.log(`  - ${file.path}`);
}
console.log('');
console.log('Skills:');
for (const file of data.output_files.filter((f) => f.path.endsWith('SKILL.md'))) {
  console.log(`  - ${file.path}`);
}

await runtime.shutdown();
