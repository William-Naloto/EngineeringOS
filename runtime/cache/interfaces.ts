/**
 * EOR Cache — interface definitions only.
 * @see docs/mcp/runtime.md §9
 *
 * Not implemented in Sprint 2. Interfaces define the contract for future use.
 */

import type { ASTGraph, ArtifactId, KnowledgeNode } from '../ast/interfaces.ts';
import type { ResolvedGraph } from '../resolver/interfaces.ts';
import type { CompilationResult, CompileConfig } from '../compiler/interfaces.ts';

export type CacheLayer = 'parse' | 'validation' | 'resolution' | 'compilation';

export interface CacheKey {
  layer: CacheLayer;
  key: string;
}

export interface CacheEntry<T> {
  value: T;
  createdAt: string;
  expiresAt?: string;
  hits: number;
}

export interface CacheStats {
  layer: CacheLayer;
  entries: number;
  hits: number;
  misses: number;
  evictions: number;
}

/**
 * Generic cache interface. Implementations MAY operate without cache.
 */
export interface Cache<T> {
  get(key: CacheKey): CacheEntry<T> | undefined;
  set(key: CacheKey, value: T, ttlMs?: number): void;
  invalidate(key: CacheKey): void;
  invalidateByPrefix(prefix: string): void;
  clear(): void;
  stats(): CacheStats;
}

export interface ParseCache extends Cache<KnowledgeNode> {
  invalidateByPath(path: string): void;
}

export interface ResolutionCache extends Cache<ResolvedGraph> {
  invalidateByArtifact(id: ArtifactId): void;
}

export interface CompilationCache extends Cache<CompilationResult> {
  invalidateByConfig(config: CompileConfig): void;
}

export interface CacheManager {
  parse: ParseCache;
  validation: Cache<ASTGraph>;
  resolution: ResolutionCache;
  compilation: CompilationCache;
  invalidateAll(): void;
  stats(): CacheStats[];
}
