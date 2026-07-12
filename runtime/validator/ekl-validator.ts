import { readFile } from 'node:fs/promises';

import type { ASTGraph, KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { resolveConfig } from './default-config.ts';
import { validateEvidenceRules } from './evidence-rules.ts';
import {
  detectCycles,
  validateDuplicateIds,
  validateUnresolvedReferences,
} from './graph-rules.ts';
import type {
  GraphValidationResult,
  NodeValidationResult,
  ValidationConfig,
  Validator,
} from './interfaces.ts';
import { mergeResults } from './issues.ts';
import { validateLifecycleRules } from './lifecycle-rules.ts';
import { parseOwnershipRegistry, validateOwnershipRules } from './ownership-rules.ts';
import { validateSchemaRules } from './schema-rules.ts';
import { validateVersionRules } from './version-rules.ts';

export interface EklValidatorOptions {
  ownershipRegistryPath?: string;
  ownershipRegistry?: Set<string>;
}

export class EklValidator implements Validator {
  private ownershipRegistry: Set<string> | null = null;
  private readonly ownershipRegistryPath: string | undefined;

  constructor(options: EklValidatorOptions = {}) {
    this.ownershipRegistryPath = options.ownershipRegistryPath;
    if (options.ownershipRegistry) {
      this.ownershipRegistry = options.ownershipRegistry;
    }
  }

  async validateNode(
    node: KnowledgeNode,
    config?: ValidationConfig,
  ): Promise<NodeValidationResult> {
    const resolved = resolveConfig(config);
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    if (resolved.tiers.includes('schema')) {
      const result = validateSchemaRules(node);
      mergeResults(errors, warnings, result.errors, result.warnings);
    }

    if (resolved.tiers.includes('lifecycle')) {
      const result = validateLifecycleRules(node, resolved);
      mergeResults(errors, warnings, result.errors, result.warnings);
    }

    if (resolved.tiers.includes('evidence')) {
      const result = validateEvidenceRules(node);
      mergeResults(errors, warnings, result.errors, result.warnings);
    }

    if (resolved.tiers.includes('version')) {
      const result = validateVersionRules(node);
      mergeResults(errors, warnings, result.errors, result.warnings);
    }

    if (resolved.tiers.includes('ownership') && resolved.checkOwnership) {
      const registry = await this.loadOwnershipRegistry();
      const result = validateOwnershipRules(node, registry);
      const ownershipErrors = resolved.failOnWarnings ? [] : result.errors;
      const ownershipWarnings = resolved.failOnWarnings
        ? [...result.warnings, ...result.errors]
        : result.warnings;
      mergeResults(errors, warnings, ownershipErrors, ownershipWarnings);
    }

    const valid = errors.length === 0 && (!resolved.failOnWarnings || warnings.length === 0);

    return {
      artifactId: node.contract.id,
      valid,
      errors,
      warnings,
    };
  }

  async validateGraph(
    graph: ASTGraph,
    config?: ValidationConfig,
  ): Promise<GraphValidationResult> {
    const resolved = resolveConfig(config);
    const nodeResults: NodeValidationResult[] = [];
    const graphErrors: ValidationIssue[] = [];

    for (const node of graph.nodes.values()) {
      nodeResults.push(await this.validateNode(node, resolved));
    }

    if (resolved.tiers.includes('dependency')) {
      graphErrors.push(...detectCycles(graph));
      graphErrors.push(...validateDuplicateIds(graph));
      graphErrors.push(...validateUnresolvedReferences(graph));
    }

    const nodeValid = nodeResults.every((result) => result.valid);
    const valid = nodeValid && graphErrors.length === 0;

    return {
      valid,
      nodeResults,
      graphErrors,
    };
  }

  async validateSchema(node: KnowledgeNode): Promise<NodeValidationResult> {
    return this.validateNode(node, {
      ...resolveConfig(),
      tiers: ['schema'],
    });
  }

  detectCycles(graph: ASTGraph): ValidationIssue[] {
    return detectCycles(graph);
  }

  private async loadOwnershipRegistry(): Promise<Set<string>> {
    if (this.ownershipRegistry) {
      return this.ownershipRegistry;
    }

    if (!this.ownershipRegistryPath) {
      return parseOwnershipRegistry('');
    }

    const markdown = await readFile(this.ownershipRegistryPath, 'utf8');
    this.ownershipRegistry = parseOwnershipRegistry(markdown);
    return this.ownershipRegistry;
  }
}

export function createValidator(options?: EklValidatorOptions): Validator {
  return new EklValidator(options);
}
