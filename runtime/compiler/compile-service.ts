/**
 * Compile dispatcher for IDE compiler targets.
 */

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactId, ArtifactStatus } from '../ast/interfaces.ts';
import type { EorContext } from '../api/eor-context.ts';
import type { CompilerTargetId } from './interfaces.ts';
import { compileCursorCapability } from './cursor/cursor-compiler.ts';
import { exportObsidianVault } from './obsidian/obsidian-compiler.ts';

export interface CompileRequest {
  target: CompilerTargetId;
  capability: ArtifactId;
  outputDir?: string;
  minStatus?: ArtifactStatus;
}

export interface CompileResponse {
  target: string;
  capability: string;
  output_dir: string;
  artifacts_compiled: number;
  output_files: Array<{ path: string; type: string; size_bytes: number }>;
  warnings: string[];
}

const IMPLEMENTED_TARGETS = new Set<CompilerTargetId>(['cursor', 'obsidian']);

export async function runCompile(ctx: EorContext, request: CompileRequest): Promise<CompileResponse> {
  if (!IMPLEMENTED_TARGETS.has(request.target)) {
    throw new CompileNotImplementedError(request.target);
  }

  if (request.target === 'cursor') {
    const outputDir =
      request.outputDir ??
      join(ctx.repositoryRoot, 'dist', 'cursor-compile', request.capability.replace(/\./g, '-'));

    await mkdir(outputDir, { recursive: true });

    const result = await compileCursorCapability({
      repositoryRoot: ctx.repositoryRoot,
      outputDir,
      index: ctx.requireIndex(),
      resolver: ctx.requireResolver(),
      capability: request.capability,
    });

    return {
      target: result.target,
      capability: result.capability,
      output_dir: result.outputDir,
      artifacts_compiled: result.filesWritten,
      output_files: result.outputFiles.map((path) => ({
        path,
        type: path.endsWith('.mdc') ? 'mdc' : path.endsWith('SKILL.md') ? 'skill' : 'markdown',
        size_bytes: 0,
      })),
      warnings: result.warnings,
    };
  }

  const outputDir =
    request.outputDir ??
    join(ctx.repositoryRoot, 'dist', 'obsidian-vault', request.capability.replace(/\./g, '-'));

  await mkdir(outputDir, { recursive: true });

  const result = await exportObsidianVault({
    repositoryRoot: ctx.repositoryRoot,
    outputDir,
    index: ctx.requireIndex(),
    resolver: ctx.requireResolver(),
    scope: 'capability',
    capability: request.capability,
    minStatus: request.minStatus ?? 'draft',
    injectWikilinks: true,
  });

  return {
    target: 'obsidian',
    capability: request.capability,
    output_dir: result.outputDir,
    artifacts_compiled: result.filesWritten,
    output_files: result.outputFiles.map((path) => ({
      path,
      type: path.endsWith('.yaml') ? 'yaml' : 'markdown',
      size_bytes: 0,
    })),
    warnings: result.warnings,
  };
}

export class CompileNotImplementedError extends Error {
  constructor(target: string) {
    super(`Compiler target "${target}" is not implemented in EOR v0.1.0`);
    this.name = 'CompileNotImplementedError';
  }
}
