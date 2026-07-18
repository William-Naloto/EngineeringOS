/**
 * Resolve index entries for compiler export/compile scopes.
 */

import type { ArtifactId, IndexEntry } from '../ast/interfaces.ts';
import type { ArtifactIndex } from '../index/interfaces.ts';
import type { DependencyResolver } from '../resolver/interfaces.ts';

const SKIP_PACK_IDS = new Set(['pack._template']);

export function shouldExportEntry(entry: IndexEntry): boolean {
  if (entry.type === 'pack' && SKIP_PACK_IDS.has(entry.id)) {
    return false;
  }
  return true;
}

export interface ScopeOptions {
  index: ArtifactIndex;
  resolver?: DependencyResolver;
  scope: 'all' | 'pack' | 'capability';
  pack?: string;
  capability?: ArtifactId;
}

export async function resolveScopedEntries(options: ScopeOptions): Promise<IndexEntry[]> {
  if (options.scope === 'capability' && options.capability && options.resolver) {
    const orchestrated = await options.resolver.expandOrchestration(options.capability);
    const ids = new Set<ArtifactId>([options.capability, ...orchestrated]);
    return options.index.listAll().filter((entry) => ids.has(entry.id));
  }

  if (options.scope === 'pack' && options.pack) {
    const packPrefix = `packs/${options.pack.replace(/^pack\./, '')}/`;
    return options.index
      .listAll()
      .filter((entry) => entry.path.startsWith(packPrefix) || entry.id === options.pack);
  }

  return options.index.listAll().filter((entry) => shouldExportEntry(entry));
}

export const CURSOR_RULE_TYPES = new Set([
  'capability',
  'agent',
  'topic',
  'competency',
  'workflow',
]);

export function isCursorRuleEntry(entry: IndexEntry): boolean {
  return CURSOR_RULE_TYPES.has(entry.type);
}

export function isCursorSkillEntry(entry: IndexEntry): boolean {
  return entry.type === 'skill';
}
