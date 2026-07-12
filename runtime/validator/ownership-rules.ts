import type { KnowledgeNode, ValidationIssue } from '../ast/interfaces.ts';

import { issue } from './issues.ts';

const DEFAULT_OWNERS = new Set(['EngineeringOS Maintainers', 'Tito EngineeringOS']);

export function parseOwnershipRegistry(markdown: string): Set<string> {
  const owners = new Set(DEFAULT_OWNERS);

  for (const match of markdown.matchAll(/\|\s*`([^`]+)`\s*\|/g)) {
    const owner = match[1].trim();
    if (owner && owner !== 'Owner ID' && !owner.startsWith('_')) {
      owners.add(owner);
    }
  }

  return owners;
}

export function validateOwnershipRules(
  node: KnowledgeNode,
  registry: Set<string>,
): { errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const { contract } = node;
  const id = contract.id;

  if (contract.status !== 'stable') {
    return { errors, warnings };
  }

  if (!registry.has(contract.owner)) {
    warnings.push(
      issue(
        id,
        'ownership',
        'OWNER_NOT_IN_REGISTRY',
        `owner "${contract.owner}" is not listed in OWNERS.md`,
        'owner',
      ),
    );
  }

  return { errors, warnings };
}
