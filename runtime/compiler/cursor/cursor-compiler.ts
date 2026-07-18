/**
 * Cursor IDE compiler — MVP capability-scoped compile to .cursor/rules and .cursor/skills.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { ArtifactId } from '../../ast/interfaces.ts';
import type { ArtifactIndex } from '../../index/interfaces.ts';
import { MarkdownParser } from '../../parser/markdown-parser.ts';
import { extractFrontmatter } from '../../parser/extract-frontmatter.ts';
import { parseContract } from '../../parser/parse-contract.ts';
import type { ContractMetadata } from '../../ast/interfaces.ts';
import type { DependencyResolver } from '../../resolver/interfaces.ts';

import {
  isCursorRuleEntry,
  isCursorSkillEntry,
  resolveScopedEntries,
} from '../resolve-scope.ts';
import { buildMdcFile, buildSkillFile } from './markdown.ts';
import {
  cursorRuleRelativePath,
  cursorSkillRelativePath,
  skillDirectoryName,
} from './paths.ts';

export interface CursorCompileOptions {
  repositoryRoot: string;
  outputDir: string;
  index: ArtifactIndex;
  resolver: DependencyResolver;
  capability: ArtifactId;
}

export interface CursorCompileResult {
  target: 'cursor';
  capability: ArtifactId;
  outputDir: string;
  filesWritten: number;
  outputFiles: string[];
  warnings: string[];
}

export async function compileCursorCapability(
  options: CursorCompileOptions,
): Promise<CursorCompileResult> {
  const parser = new MarkdownParser();
  const entries = await resolveScopedEntries({
    index: options.index,
    resolver: options.resolver,
    scope: 'capability',
    capability: options.capability,
  });

  const outputFiles: string[] = [];
  const warnings: string[] = [];

  for (const entry of entries) {
    if (!entry.path.endsWith('.md')) {
      continue;
    }

    const sourcePath = join(options.repositoryRoot, entry.path);
    const { contract, body } = await loadArtifactContent(parser, sourcePath);

    if (isCursorSkillEntry(entry)) {
      const relativePath = cursorSkillRelativePath(entry);
      const skillName = skillDirectoryName(entry.id);
      const content = buildSkillFile(contract, body, skillName);
      await writeCompiledFile(options.outputDir, relativePath, content);
      outputFiles.push(relativePath);
      continue;
    }

    if (isCursorRuleEntry(entry)) {
      const alwaysApply = entry.type === 'capability';
      const relativePath = cursorRuleRelativePath(entry);
      const content = buildMdcFile(contract, body, { alwaysApply });
      await writeCompiledFile(options.outputDir, relativePath, content);
      outputFiles.push(relativePath);
      continue;
    }

    warnings.push(`Skipped unsupported artifact type for Cursor compile: ${entry.id} (${entry.type})`);
  }

  const manifestPath = 'cursor/rules/engineeringos-manifest.mdc';
  const manifest = buildManifest(options.capability, outputFiles);
  await writeCompiledFile(options.outputDir, manifestPath, manifest);
  outputFiles.push(manifestPath);

  const readmePath = 'README.md';
  const readme = buildReadme(options.capability, outputFiles);
  await writeFile(join(options.outputDir, readmePath), `${readme}\n`, 'utf8');
  outputFiles.push(readmePath);

  return {
    target: 'cursor',
    capability: options.capability,
    outputDir: options.outputDir,
    filesWritten: outputFiles.length,
    outputFiles,
    warnings,
  };
}

async function loadArtifactContent(
  parser: MarkdownParser,
  sourcePath: string,
): Promise<{ contract: ContractMetadata; body: string }> {
  try {
    const parsed = await parser.parseFile(sourcePath);
    return { contract: parsed.node.contract, body: parsed.node.body.raw };
  } catch {
    const raw = await readFile(sourcePath, 'utf8');
    const { frontmatter, body } = extractFrontmatter(raw);
    return { contract: parseContract(frontmatter), body };
  }
}

async function writeCompiledFile(outputDir: string, relativePath: string, content: string): Promise<void> {
  const absolutePath = join(outputDir, relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, 'utf8');
}

function buildManifest(capability: ArtifactId, outputFiles: string[]): string {
  const rules = outputFiles.filter((path) => path.startsWith('cursor/rules/'));
  const skills = outputFiles.filter((path) => path.endsWith('/SKILL.md'));

  const body = [
    '# EngineeringOS Compile Manifest',
    '',
    `Capability: \`${capability}\``,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Rules',
    '',
    ...rules.map((path) => `- ${path}`),
    '',
    '## Skills',
    '',
    ...skills.map((path) => `- ${path}`),
    '',
    '## Install',
    '',
    'Copy the `cursor/` directory to your project as `.cursor/`:',
    '',
    '```bash',
    'cp -R cursor /path/to/your/project/.cursor',
    '```',
    '',
  ].join('\n');

  return [
    '---',
    `description: EngineeringOS compiled bundle for ${capability}`,
    'alwaysApply: false',
    '---',
    '',
    body,
    '',
  ].join('\n');
}

function buildReadme(capability: ArtifactId, outputFiles: string[]): string {
  return [
    '# EngineeringOS → Cursor Compile Output',
    '',
    `Capability: \`${capability}\``,
    '',
    '## Install',
    '',
    '```bash',
    'cp -R cursor /path/to/your/project/.cursor',
    '```',
    '',
    'Or merge rules/skills into an existing `.cursor/` directory.',
    '',
    '## Files',
    '',
    ...outputFiles.map((file) => `- ${file}`),
    '',
    '## MCP',
    '',
    '```',
    `engineeringos.compile target=cursor capability=${capability}`,
    '```',
    '',
  ].join('\n');
}
