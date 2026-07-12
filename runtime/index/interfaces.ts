import type { ArtifactId, ArtifactType, IndexEntry } from '../ast/interfaces.ts';

export interface ArtifactIndex {
  readonly root: string;
  readonly builtAt: string;
  lookup(id: ArtifactId): IndexEntry | undefined;
  lookupByPath(path: string): IndexEntry | undefined;
  listByType(type: ArtifactType): IndexEntry[];
  listAll(): IndexEntry[];
  entries(): Iterable<IndexEntry>;
}

export interface BuildIndexOptions {
  root: string;
  overlayPath?: string;
  excludeResearch?: boolean;
}
