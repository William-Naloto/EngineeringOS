import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArtifactId, KnowledgeNode } from '../ast/interfaces.ts';
import { parseContractYaml } from '../parser/parse-contract-yaml.ts';
import { parseContract } from '../parser/parse-contract.ts';

export async function loadCompetencyTopics(
  repositoryRoot: string,
  competencyId: ArtifactId,
): Promise<ArtifactId[]> {
  const manifestPath = manifestPathFor(repositoryRoot, competencyId);

  try {
    const raw = await readFile(manifestPath, 'utf8');
    const manifest = parseContractYaml(raw);
    const topics = manifest.topics;
    if (!Array.isArray(topics)) {
      return [];
    }
    return topics.map(String);
  } catch {
    return [];
  }
}

export async function loadCompetencyManifestNode(
  repositoryRoot: string,
  relativePath: string,
): Promise<KnowledgeNode | undefined> {
  const absolutePath = join(repositoryRoot, relativePath);

  try {
    const raw = await readFile(absolutePath, 'utf8');
    const manifest = parseContractYaml(raw);
    const contract = parseContract(stringifyManifest(manifest));

    return {
      contract,
      body: {
        raw: '',
        headings: [],
      },
      evidence: {
        entries: [],
      },
      type: 'competency',
      path: relativePath,
    };
  } catch {
    return undefined;
  }
}

function manifestPathFor(repositoryRoot: string, competencyId: ArtifactId): string {
  const slug = competencyId.replace(/^competency\./, '');
  return join(repositoryRoot, 'competencies', slug, 'manifest.yaml');
}

function stringifyManifest(manifest: Record<string, unknown>): string {
  return Object.entries(manifest)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return `${key}: []`;
        }
        if (typeof value[0] === 'string') {
          return `${key}:\n${value.map((item) => `  - ${item}`).join('\n')}`;
        }
      }
      if (value === null) {
        return `${key}: null`;
      }
      if (typeof value === 'string') {
        return `${key}: "${value}"`;
      }
      return `${key}: ${String(value)}`;
    })
    .join('\n');
}
