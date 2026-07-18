#!/usr/bin/env node
/**
 * EngineeringOS capture pipeline CLI.
 * Usage:
 *   npm run capture -- status
 *   npm run capture -- list
 *   npm run capture -- learn --title "..." --vendor microsoft --domain fabric
 *   npm run capture -- review --path research/... --outcome approved
 *   npm run capture -- extract --path research/... --artifact-id skill.fabric.foo --type skill --pack fabric
 */

import { runCapture, type CaptureAction } from '../runtime/capture/capture-service.ts';

const repositoryRoot = process.env.ENGINEERINGOS_ROOT ?? process.cwd();
const args = process.argv.slice(2);

function parseArgs(argv: string[]): { action: CaptureAction; options: Record<string, unknown> } {
  if (argv.length === 0) {
    return { action: 'status', options: {} };
  }

  const action = argv[0] as CaptureAction;
  const options: Record<string, unknown> = {};

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }
    if (key === 'sources') {
      options[key] = next.split(',').map((item) => item.trim());
      index += 1;
      continue;
    }
    options[key] = next;
    index += 1;
  }

  return { action, options };
}

const { action, options } = parseArgs(args);

try {
  const result = await runCapture(repositoryRoot, action, options);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
