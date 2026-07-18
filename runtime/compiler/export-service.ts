/**
 * Export dispatcher for compiler targets.
 */

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactId, ArtifactStatus } from '../ast/interfaces.ts';
import type { EorContext } from '../api/eor-context.ts';
import type { CompilerTargetId } from './interfaces.ts';
import { exportObsidianVault } from './obsidian/obsidian-compiler.ts';

export interface ExportRequest {
  target: CompilerTargetId;
  scope?: 'all' | 'pack' | 'capability';
  pack?: string;
  capability?: ArtifactId;
  outputDir?: string;
  minStatus?: ArtifactStatus;
}

export interface ExportResponse {
  target: string;
  output_dir: string;
  files_written: number;
  output_files: string[];
  warnings: string[];
}

const DOCUMENTATION_TARGETS = new Set<CompilerTargetId>([
  'obsidian',
  'notebooklm',
  'mkdocs',
  'docusaurus',
  'confluence',
]);

export async function runExport(ctx: EorContext, request: ExportRequest): Promise<ExportResponse> {
  const outputDir = request.outputDir ?? join(ctx.repositoryRoot, 'dist', 'obsidian-vault');
  await mkdir(outputDir, { recursive: true });

  if (request.target === 'obsidian') {
    const result = await exportObsidianVault({
      repositoryRoot: ctx.repositoryRoot,
      outputDir,
      index: ctx.requireIndex(),
      resolver: ctx.requireResolver(),
      scope: request.scope ?? 'all',
      pack: request.pack,
      capability: request.capability,
      minStatus: request.minStatus,
      injectWikilinks: true,
    });

    return {
      target: result.target,
      output_dir: result.outputDir,
      files_written: result.filesWritten,
      output_files: result.outputFiles,
      warnings: result.warnings,
    };
  }

  if (DOCUMENTATION_TARGETS.has(request.target)) {
    throw new ExportNotImplementedError(request.target);
  }

  throw new ExportUnsupportedTargetError(request.target);
}

export class ExportNotImplementedError extends Error {
  constructor(target: string) {
    super(`Export target "${target}" is not implemented in EOR v0.1.0`);
    this.name = 'ExportNotImplementedError';
  }
}

export class ExportUnsupportedTargetError extends Error {
  constructor(target: string) {
    super(`Unsupported export target: ${target}`);
    this.name = 'ExportUnsupportedTargetError';
  }
}
