import type { ContractMetadata } from '../ast/interfaces.ts';

import { parseContractYaml } from './parse-contract-yaml.ts';

export function parseContract(frontmatter: string): ContractMetadata {
  let raw: Record<string, unknown>;

  try {
    raw = parseContractYaml(frontmatter);
  } catch {
    throw new Error('INVALID_YAML');
  }

  if (typeof raw.id !== 'string' || raw.id.length === 0) {
    throw new Error('INVALID_YAML');
  }

  return {
    id: raw.id,
    version: String(raw.version ?? ''),
    status: raw.status as ContractMetadata['status'],
    lifecycle: raw.lifecycle as ContractMetadata['lifecycle'],
    owner: String(raw.owner ?? ''),
    classification: raw.classification as ContractMetadata['classification'],
    confidence: raw.confidence as ContractMetadata['confidence'],
    dependencies: asStringArray(raw.dependencies),
    provides: asStringArray(raw.provides),
    requires: asStringArray(raw.requires),
    references: asStringArray(raw.references),
    updated: String(raw.updated ?? ''),
    reviewed: raw.reviewed === null || raw.reviewed === undefined
      ? null
      : String(raw.reviewed),
    orchestrates: raw.orchestrates as ContractMetadata['orchestrates'],
    replaces: raw.replaces as ContractMetadata['replaces'],
    tags: asOptionalStringArray(raw.tags),
    triggers: asOptionalStringArray(raw.triggers),
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(String);
}

function asOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return value.map(String);
}
