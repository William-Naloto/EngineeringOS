import { deriveArtifactType } from '../ast/artifact-type.ts';
import type { KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { issue } from './issues.ts';

const ID_PATTERN = /^[a-z]+\.[a-z0-9-]+(\.[a-z0-9-]+)*$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

const STATUSES = new Set(['draft', 'experimental', 'stable', 'deprecated']);
const LIFECYCLES = new Set(['created', 'validated', 'published', 'maintained', 'deprecated']);
const CLASSIFICATIONS = new Set(['Fact', 'BestPractice', 'Recommendation', 'Experimental']);
const CONFIDENCE_LEVELS = new Set(['High', 'Medium', 'Low', 'Unknown']);

const REQUIRED_FIELDS = [
  'id',
  'version',
  'status',
  'lifecycle',
  'owner',
  'classification',
  'confidence',
  'dependencies',
  'provides',
  'requires',
  'references',
  'updated',
  'reviewed',
] as const;

export function validateSchemaRules(node: KnowledgeNode): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const { contract } = node;
  const id = contract.id;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in contract)) {
      errors.push(issue(id, 'schema', 'MISSING_FIELD', `Required field "${field}" is missing`, field));
    }
  }

  if (!ID_PATTERN.test(id)) {
    errors.push(
      issue(id, 'schema', 'INVALID_ID_PATTERN', `id "${id}" does not match type.domain.name pattern`, 'id'),
    );
  }

  try {
    const derivedType = deriveArtifactType(id);
    if (derivedType !== node.type) {
      errors.push(
        issue(
          id,
          'schema',
          'ID_TYPE_MISMATCH',
          `id prefix implies "${derivedType}" but node type is "${node.type}"`,
          'id',
        ),
      );
    }
  } catch {
    errors.push(issue(id, 'schema', 'UNKNOWN_TYPE_PREFIX', `Unrecognized id prefix in "${id}"`, 'id'));
  }

  if (!VERSION_PATTERN.test(contract.version)) {
    errors.push(
      issue(
        id,
        'schema',
        'INVALID_VERSION',
        `version "${contract.version}" must be SemVer (major.minor.patch)`,
        'version',
      ),
    );
  }

  if (!STATUSES.has(contract.status)) {
    errors.push(issue(id, 'schema', 'INVALID_STATUS', `Invalid status "${contract.status}"`, 'status'));
  }

  if (!LIFECYCLES.has(contract.lifecycle)) {
    errors.push(
      issue(id, 'schema', 'INVALID_LIFECYCLE', `Invalid lifecycle "${contract.lifecycle}"`, 'lifecycle'),
    );
  }

  if (!CLASSIFICATIONS.has(contract.classification)) {
    errors.push(
      issue(
        id,
        'schema',
        'INVALID_CLASSIFICATION',
        `Invalid classification "${contract.classification}"`,
        'classification',
      ),
    );
  }

  if (!CONFIDENCE_LEVELS.has(contract.confidence)) {
    errors.push(
      issue(id, 'schema', 'INVALID_CONFIDENCE', `Invalid confidence "${contract.confidence}"`, 'confidence'),
    );
  }

  if (!contract.owner.trim()) {
    errors.push(issue(id, 'schema', 'EMPTY_OWNER', 'owner must be non-empty', 'owner'));
  }

  if (!Array.isArray(contract.dependencies)) {
    errors.push(issue(id, 'schema', 'INVALID_DEPENDENCIES', 'dependencies must be an array', 'dependencies'));
  }

  if (!Array.isArray(contract.provides)) {
    errors.push(issue(id, 'schema', 'INVALID_PROVIDES', 'provides must be an array', 'provides'));
  }

  if (node.path.includes('/research/') || node.path.startsWith('research/')) {
    errors.push(
      issue(id, 'schema', 'RESEARCH_IN_SCOPE', 'Research artifacts must not be in compile scope', 'path'),
    );
  }

  if (node.type === 'capability' && !contract.orchestrates) {
    warnings.push(
      issue(
        id,
        'schema',
        'MISSING_ORCHESTRATES',
        'Capability artifacts should declare orchestrates',
        'orchestrates',
      ),
    );
  }

  return { errors, warnings };
}
