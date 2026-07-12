/**
 * EngineeringOS Runtime (EOR) — public API.
 * @see docs/mcp/specification.md
 */

export type * from './ast/interfaces.ts';
export { deriveArtifactType, isArtifactType } from './ast/artifact-type.ts';
export type * from './parser/interfaces.ts';
export { MarkdownParser, createParser, ParserException } from './parser/index.ts';
export type * from './validator/interfaces.ts';
export {
  EklValidator,
  createValidator,
  DEFAULT_VALIDATION_CONFIG,
  graphFromNodes,
  buildDependencyEdges,
  detectCycles,
} from './validator/index.ts';
export type { EklValidatorOptions } from './validator/index.ts';
export type * from './index/interfaces.ts';
export { buildFilesystemIndex, FilesystemArtifactIndex } from './index/index.ts';
export type * from './resolver/interfaces.ts';
export {
  EklDependencyResolver,
  createResolver,
  ResolverException,
  topologicalSort,
  collectEdges,
} from './resolver/index.ts';
export type { EklDependencyResolverOptions } from './resolver/index.ts';
export type * from './router/interfaces.ts';
export { EklRouter, createRouter } from './router/index.ts';
export type { EklRouterOptions } from './router/index.ts';
export type * from './compiler/interfaces.ts';
export type * from './cache/interfaces.ts';
export type * from './api/interfaces.ts';
export {
  createEngineeringOsRuntime,
  createMcpApi,
  EKL_VERSION,
  EOR_VERSION,
} from './api/index.ts';
