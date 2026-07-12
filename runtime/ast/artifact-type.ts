import type { ArtifactId, ArtifactType } from './interfaces.ts';

const ARTIFACT_TYPES: readonly ArtifactType[] = [
  'capability',
  'competency',
  'agent',
  'topic',
  'skill',
  'workflow',
  'standard',
  'template',
  'pack',
  'adr',
] as const;

export function deriveArtifactType(id: ArtifactId): ArtifactType {
  const prefix = id.split('.')[0] as ArtifactType;
  if (!ARTIFACT_TYPES.includes(prefix)) {
    throw new Error(`Unknown artifact type prefix: ${prefix}`);
  }
  return prefix;
}

export function isArtifactType(value: string): value is ArtifactType {
  return (ARTIFACT_TYPES as readonly string[]).includes(value);
}
