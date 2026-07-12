/**
 * EOR Parser — interface definitions only.
 * @see docs/mcp/runtime.md §3
 */

import type { KnowledgeNode } from '../ast/interfaces.ts';

export interface ParseRequest {
  path: string;
  raw: string;
}

export interface ParseResult {
  node: KnowledgeNode;
  durationMs: number;
}

export interface ParseError {
  path: string;
  code: 'MISSING_FRONTMATTER' | 'INVALID_YAML' | 'MISSING_EVIDENCE' | 'UNKNOWN_TYPE';
  message: string;
}

/**
 * Transforms Markdown source into canonical AST nodes.
 * MUST extract contract, body, and evidence per EKL spec.
 */
export interface Parser {
  parse(request: ParseRequest): Promise<ParseResult>;
  parseFile(path: string): Promise<ParseResult>;
}

/**
 * Lazy parser that checks cache before parsing.
 */
export interface LazyParser extends Parser {
  isParsed(path: string): boolean;
  invalidate(path: string): void;
}
