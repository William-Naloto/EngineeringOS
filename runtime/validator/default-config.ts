import type { ValidationConfig } from './interfaces.ts';

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  tiers: ['schema', 'dependency', 'lifecycle', 'evidence', 'ownership', 'version'],
  failOnWarnings: false,
  checkOwnership: true,
  rejectUnknownConfidence: true,
};

export function resolveConfig(config?: ValidationConfig): ValidationConfig {
  return config ?? DEFAULT_VALIDATION_CONFIG;
}
