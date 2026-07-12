import type { KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import type { ValidationConfig } from './interfaces.ts';
import { issue } from './issues.ts';

export function validateLifecycleRules(
  node: KnowledgeNode,
  config: ValidationConfig,
): { errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const { contract } = node;
  const id = contract.id;

  if (contract.status === 'stable' && contract.reviewed === null) {
    errors.push(
      issue(
        id,
        'lifecycle',
        'STABLE_WITHOUT_REVIEWED',
        'status: stable requires reviewed to be set',
        'reviewed',
      ),
    );
  }

  if (
    contract.status === 'stable' &&
    contract.confidence === 'Unknown' &&
    config.rejectUnknownConfidence
  ) {
    errors.push(
      issue(
        id,
        'lifecycle',
        'STABLE_UNKNOWN_CONFIDENCE',
        'status: stable must not have confidence: Unknown',
        'confidence',
      ),
    );
  }

  if (contract.status === 'deprecated' && !contract.replaces) {
    errors.push(
      issue(
        id,
        'lifecycle',
        'DEPRECATED_WITHOUT_REPLACES',
        'status: deprecated requires replaces pointing to a successor',
        'replaces',
      ),
    );
  }

  if (contract.lifecycle === 'maintained' && contract.reviewed) {
    const reviewedAt = new Date(contract.reviewed);
    const monthsStale = monthsBetween(reviewedAt, new Date());
    if (monthsStale > 12) {
      warnings.push(
        issue(
          id,
          'lifecycle',
          'STALE_REVIEW',
          `reviewed date is ${monthsStale} months old (> 12 months for maintained)`,
          'reviewed',
        ),
      );
    }
  }

  return { errors, warnings };
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}
