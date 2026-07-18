/**
 * Build Cursor .mdc rule and SKILL.md content from EKL markdown sources.
 */

import type { ContractMetadata } from '../../ast/interfaces.ts';

export function stripMarkdownFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length).trimStart() : raw;
}

export function extractTitle(markdownBody: string, fallback: string): string {
  const match = markdownBody.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

export function buildRuleDescription(contract: ContractMetadata, markdownBody: string): string {
  const title = extractTitle(markdownBody, contract.id);
  const provides = contract.provides?.filter(Boolean) ?? [];

  if (provides.length > 0) {
    return `${title} — ${provides.join(', ')}`;
  }

  return `${title} (${contract.id})`;
}

export function buildMdcFile(
  contract: ContractMetadata,
  markdownBody: string,
  options?: { alwaysApply?: boolean },
): string {
  const description = buildRuleDescription(contract, markdownBody);
  const alwaysApply = options?.alwaysApply ?? false;
  const body = stripMarkdownFrontmatter(markdownBody);

  const lines = [
    '---',
    `description: ${yamlScalar(description)}`,
    `alwaysApply: ${alwaysApply}`,
    '---',
    '',
    body.trimEnd(),
    '',
    '<!-- Compiled from EngineeringOS EKL -->',
    `<!-- Source: ${contract.id} v${contract.version} -->`,
    '',
  ];

  return lines.join('\n');
}

export function buildSkillFile(
  contract: ContractMetadata,
  markdownBody: string,
  skillName: string,
): string {
  const description = buildRuleDescription(contract, markdownBody);
  const body = stripMarkdownFrontmatter(markdownBody);

  return [
    '---',
    `name: ${yamlScalar(skillName)}`,
    `description: ${yamlScalar(description)}`,
    '---',
    '',
    body.trimEnd(),
    '',
    '<!-- Compiled from EngineeringOS EKL -->',
    `<!-- Source: ${contract.id} v${contract.version} -->`,
    '',
  ].join('\n');
}

function yamlScalar(value: string): string {
  if (/[:#\n\r]/.test(value) || value.includes('"')) {
    return JSON.stringify(value);
  }
  return value;
}
