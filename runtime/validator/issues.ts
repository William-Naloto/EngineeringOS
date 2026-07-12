import type { ArtifactId, ValidationIssue, ValidationTier } from '../ast/interfaces.ts';

export function issue(
  artifactId: ArtifactId,
  tier: ValidationTier,
  code: string,
  message: string,
  path?: string,
): ValidationIssue {
  return { artifactId, tier, code, message, path };
}

export function mergeResults(
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  newErrors: ValidationIssue[],
  newWarnings: ValidationIssue[],
): void {
  errors.push(...newErrors);
  warnings.push(...newWarnings);
}
