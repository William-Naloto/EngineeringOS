/**
 * EOR Compiler — interface definitions only.
 * @see docs/mcp/runtime.md §8
 * @see docs/mcp/domain-model.md §3.4
 */

import type {
  ArtifactStatus,
  ConfidenceLevel,
  ValidationIssue,
} from '../ast/interfaces.ts';
import type { ResolvedGraph } from '../resolver/interfaces.ts';

// ---------------------------------------------------------------------------
// Compiler targets
// ---------------------------------------------------------------------------

export type CompilerTargetId =
  | 'cursor'
  | 'claude'
  | 'copilot'
  | 'openhands'
  | 'gemini'
  | 'agents-md'
  | 'obsidian'
  | 'notebooklm'
  | 'confluence'
  | 'mkdocs'
  | 'docusaurus';

export type EklAbstractTarget =
  | 'ai-context-rules'
  | 'ai-context-instructions'
  | 'ai-context-agents'
  | 'knowledge-vault'
  | 'wiki'
  | 'documentation-site';

export interface CompilerTargetRegistry {
  readonly targets: Map<CompilerTargetId, CompilerTarget>;
  get(id: CompilerTargetId): CompilerTarget | undefined;
  list(): CompilerTargetId[];
}

// ---------------------------------------------------------------------------
// Compile config and result
// ---------------------------------------------------------------------------

export interface CompileConfig {
  target: CompilerTargetId;
  outputDir: string;
  minStatus: ArtifactStatus;
  minConfidence: ConfidenceLevel;
  projectOverlayPath?: string;
}

export interface OutputFile {
  path: string;
  type: string;
  sizeBytes: number;
}

export interface CompilationResult {
  target: CompilerTargetId;
  capability: string;
  artifactsCompiled: number;
  outputFiles: OutputFile[];
  warnings: string[];
  metadata: CompilationMetadata;
}

export interface CompilationMetadata {
  eklVersion: string;
  compiledAt: string;
  deterministic: boolean;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
}

// ---------------------------------------------------------------------------
// Compiler target interface
// ---------------------------------------------------------------------------

/**
 * Transforms resolved AST subgraph into target-specific output.
 * MUST NOT modify canonical source.
 */
export interface CompilerTarget {
  readonly id: CompilerTargetId;
  readonly eklAbstractTarget: EklAbstractTarget;
  readonly supportedFeatures: string[];

  compile(graph: ResolvedGraph, config: CompileConfig): Promise<CompilationResult>;
  validateConfig(config: CompileConfig): ConfigValidationResult;
}

/**
 * Registry and dispatcher for compiler targets.
 */
export interface Compiler {
  register(target: CompilerTarget): void;
  compile(graph: ResolvedGraph, config: CompileConfig): Promise<CompilationResult>;
  getTarget(id: CompilerTargetId): CompilerTarget | undefined;
  listTargets(): CompilerTargetId[];
}
