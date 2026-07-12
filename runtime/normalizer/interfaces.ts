/**
 * EOR Normalizer — interface definitions only.
 * @see docs/mcp/runtime.md §5
 */

import type { KnowledgeNode } from '../ast/interfaces.ts';

/**
 * Normalizes structure and metadata without changing semantic meaning.
 * Optional reference extension per EKL spec §5.2.
 */
export interface Normalizer {
  normalize(node: KnowledgeNode): KnowledgeNode;
  normalizeAll(nodes: KnowledgeNode[]): KnowledgeNode[];
}

export interface NormalizationOptions {
  sortArrays: boolean;
  canonicalFieldOrder: boolean;
  normalizeWhitespace: boolean;
  canonicalizeIds: boolean;
}
