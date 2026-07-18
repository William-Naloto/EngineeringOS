/**
 * Inject Obsidian wikilinks for known artifact IDs in note bodies.
 */

import type { ArtifactId } from '../../ast/interfaces.ts';

const ARTIFACT_ID_PATTERN =
  /\b((?:capability|competency|agent|topic|skill|workflow|standard|pack)\.[a-z0-9][a-z0-9.-]*)\b/g;

export function injectWikilinks(content: string, knownIds: ReadonlySet<ArtifactId>): string {
  return content.replace(ARTIFACT_ID_PATTERN, (match, id: string) => {
    if (!knownIds.has(id)) {
      return match;
    }
    if (content.includes(`[[${id}]]`)) {
      return match;
    }
    return `[[${id}]]`;
  });
}

export function collectKnownIds(ids: Iterable<ArtifactId>): Set<ArtifactId> {
  return new Set(ids);
}
