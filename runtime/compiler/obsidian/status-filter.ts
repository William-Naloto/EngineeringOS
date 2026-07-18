import type { ArtifactStatus } from '../../ast/interfaces.ts';
import { STATUS_RANK } from '../../resolver/filters.ts';
import { extractFrontmatter } from '../../parser/extract-frontmatter.ts';

const STATUS_PATTERN = /^status:\s*["']?(\w+)["']?\s*$/m;

export function parseStatusFromRaw(raw: string): ArtifactStatus | undefined {
  try {
    const { frontmatter } = extractFrontmatter(raw);
    const match = STATUS_PATTERN.exec(frontmatter);
    const status = match?.[1];
    if (status && status in STATUS_RANK) {
      return status as ArtifactStatus;
    }
  } catch {
    // YAML manifests and non-markdown files may lack frontmatter.
  }
  return undefined;
}

export function meetsMinStatus(
  actual: ArtifactStatus | undefined,
  minStatus: ArtifactStatus,
): boolean {
  if (!actual) {
    return true;
  }
  return STATUS_RANK[actual] >= STATUS_RANK[minStatus];
}
