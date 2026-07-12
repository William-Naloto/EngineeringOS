import type { KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { issue } from './issues.ts';

export function validateEvidenceRules(node: KnowledgeNode): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const id = node.contract.id;

  if (node.evidence.entries.length === 0) {
    if (node.contract.status === 'stable') {
      errors.push(
        issue(
          id,
          'evidence',
          'EMPTY_EVIDENCE',
          'status: stable artifacts must have at least one evidence entry',
          'evidence',
        ),
      );
    } else {
      warnings.push(
        issue(
          id,
          'evidence',
          'EMPTY_EVIDENCE',
          'Evidence section has no substantive entries',
          'evidence',
        ),
      );
    }
  }

  for (const [index, entry] of node.evidence.entries.entries()) {
    if (!entry.source.trim()) {
      warnings.push(
        issue(
          id,
          'evidence',
          'EMPTY_EVIDENCE_SOURCE',
          `Evidence entry ${index + 1} has an empty source`,
          `evidence.entries[${index}].source`,
        ),
      );
    }
  }

  return { errors, warnings };
}
