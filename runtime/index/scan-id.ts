import { readFile } from 'node:fs/promises';

import { deriveArtifactType } from '../ast/artifact-type.ts';
import type { ArtifactId, ArtifactType, IndexEntry } from '../ast/interfaces.ts';
import { parseContractYaml } from '../parser/parse-contract-yaml.ts';

const ID_PATTERN = /^id:\s*["']?([^"'\n]+)["']?\s*$/m;

export async function extractArtifactId(path: string): Promise<ArtifactId | null> {
  const raw = await readFile(path, 'utf8');

  if (path.endsWith('manifest.yaml')) {
    try {
      const manifest = parseContractYaml(raw);
      return typeof manifest.id === 'string' ? manifest.id : null;
    } catch {
      return null;
    }
  }

  const match = ID_PATTERN.exec(raw);
  return match?.[1]?.trim() ?? null;
}

export function inferTypeFromId(id: ArtifactId): ArtifactType {
  return deriveArtifactType(id);
}

export function toIndexEntry(path: string, id: ArtifactId, mtime: string): IndexEntry {
  return {
    id,
    path,
    type: inferTypeFromId(id),
    mtime,
    parsed: false,
  };
}
