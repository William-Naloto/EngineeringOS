import type { KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { issue } from './issues.ts';

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

export function validateVersionRules(node: KnowledgeNode): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const { contract } = node;
  const id = contract.id;

  if (!VERSION_PATTERN.test(contract.version)) {
    errors.push(
      issue(
        id,
        'version',
        'INVALID_SEMVER',
        `version "${contract.version}" is not valid SemVer 2.0.0`,
        'version',
      ),
    );
  }

  if (contract.replaces && contract.replaces === id) {
    errors.push(
      issue(id, 'version', 'SELF_REPLACEMENT', 'replaces must not point to the same artifact id', 'replaces'),
    );
  }

  if (contract.status !== 'deprecated' && contract.replaces) {
    warnings.push(
      issue(
        id,
        'version',
        'REPLACES_WITHOUT_DEPRECATED',
        'replaces is set but status is not deprecated',
        'replaces',
      ),
    );
  }

  return { errors, warnings };
}
