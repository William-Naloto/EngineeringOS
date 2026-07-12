/**
 * EOR Validator — interface definitions only.
 * @see docs/mcp/runtime.md §4
 */

import type {
  ASTGraph,
  ArtifactId,
  KnowledgeNode,
  ValidationIssue,
  ValidationTier,
} from '../ast/interfaces.ts';

export interface ValidationConfig {
  tiers: ValidationTier[];
  failOnWarnings: boolean;
  checkOwnership: boolean;
  rejectUnknownConfidence: boolean;
}

export interface NodeValidationResult {
  artifactId: ArtifactId;
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface GraphValidationResult {
  valid: boolean;
  nodeResults: NodeValidationResult[];
  graphErrors: ValidationIssue[];
}

/**
 * Enforces EKL contract rules on parsed nodes and graphs.
 */
export interface Validator {
  validateNode(node: KnowledgeNode, config?: ValidationConfig): Promise<NodeValidationResult>;
  validateGraph(graph: ASTGraph, config?: ValidationConfig): Promise<GraphValidationResult>;
  validateSchema(node: KnowledgeNode): Promise<NodeValidationResult>;
  detectCycles(graph: ASTGraph): ValidationIssue[];
}
