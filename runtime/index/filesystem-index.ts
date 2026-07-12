import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type { ArtifactId, ArtifactType, IndexEntry } from '../ast/interfaces.ts';

import type { ArtifactIndex, BuildIndexOptions } from './interfaces.ts';
import { extractArtifactId, toIndexEntry } from './scan-id.ts';

const SCAN_DIRS = ['capabilities', 'competencies', 'packs', 'standards', 'agents', 'adr', 'templates'];

export class FilesystemArtifactIndex implements ArtifactIndex {
  readonly root: string;
  readonly builtAt: string;
  private readonly byId = new Map<ArtifactId, IndexEntry>();
  private readonly byPath = new Map<string, IndexEntry>();
  private readonly byType = new Map<ArtifactType, IndexEntry[]>();

  private constructor(root: string, entries: IndexEntry[]) {
    this.root = root;
    this.builtAt = new Date().toISOString();

    for (const entry of entries) {
      this.byId.set(entry.id, entry);
      this.byPath.set(entry.path, entry);
      const typeList = this.byType.get(entry.type) ?? [];
      typeList.push(entry);
      this.byType.set(entry.type, typeList);
    }
  }

  static async build(options: BuildIndexOptions): Promise<FilesystemArtifactIndex> {
    const entries: IndexEntry[] = [];
    const seenIds = new Set<ArtifactId>();

    for (const dir of SCAN_DIRS) {
      const absoluteDir = join(options.root, dir);
      await collectEntries(absoluteDir, options.root, entries, seenIds, options.excludeResearch ?? true);
    }

    if (options.overlayPath) {
      const overlayEntries: IndexEntry[] = [];
      const overlaySeen = new Set<ArtifactId>();
      await collectEntries(options.overlayPath, options.root, overlayEntries, overlaySeen, false);

      for (const entry of overlayEntries) {
        const existing = seenIds.has(entry.id);
        if (existing) {
          const index = entries.findIndex((item) => item.id === entry.id);
          if (index >= 0) {
            entries[index] = entry;
          }
        } else {
          entries.push(entry);
          seenIds.add(entry.id);
        }
      }
    }

    return new FilesystemArtifactIndex(options.root, entries);
  }

  lookup(id: ArtifactId): IndexEntry | undefined {
    return this.byId.get(id);
  }

  lookupByPath(path: string): IndexEntry | undefined {
    return this.byPath.get(path);
  }

  listByType(type: ArtifactType): IndexEntry[] {
    return [...(this.byType.get(type) ?? [])];
  }

  listAll(): IndexEntry[] {
    return [...this.byId.values()];
  }

  entries(): Iterable<IndexEntry> {
    return this.byId.values();
  }
}

async function collectEntries(
  dir: string,
  root: string,
  entries: IndexEntry[],
  seenIds: Set<ArtifactId>,
  excludeResearch: boolean,
): Promise<void> {
  let dirEntries;
  try {
    dirEntries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of dirEntries) {
    const absolutePath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (excludeResearch && entry.name === 'research') {
        continue;
      }
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      await collectEntries(absolutePath, root, entries, seenIds, excludeResearch);
      continue;
    }

    if (!entry.name.endsWith('.md') && entry.name !== 'manifest.yaml') {
      continue;
    }

    const id = await extractArtifactId(absolutePath);
    if (!id || seenIds.has(id)) {
      continue;
    }

    const fileStat = await stat(absolutePath);
    const relativePath = relative(root, absolutePath);
    entries.push(toIndexEntry(relativePath, id, fileStat.mtime.toISOString()));
    seenIds.add(id);
  }
}

export async function buildFilesystemIndex(options: BuildIndexOptions): Promise<FilesystemArtifactIndex> {
  return FilesystemArtifactIndex.build(options);
}
