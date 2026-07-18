/**
 * Cursor output path helpers.
 * @see reference/cursor/README.md
 */

import type { IndexEntry } from '../../ast/interfaces.ts';

export function cursorRuleRelativePath(entry: IndexEntry): string {
  const slug = slugFromId(entry.id, entry.type);
  return `cursor/rules/${slug}.mdc`;
}

export function cursorSkillRelativePath(entry: IndexEntry): string {
  const dir = skillDirectoryName(entry.id);
  return `cursor/skills/${dir}/SKILL.md`;
}

export function slugFromId(id: string, type: string): string {
  if (type === 'agent') {
    return `agent-${id.replace('agent.', '')}`;
  }
  if (type === 'capability') {
    const parts = id.split('.');
    return `capability-${parts.slice(1).join('-')}`;
  }
  if (type === 'workflow') {
    const parts = id.split('.');
    return `workflow-${parts.slice(1).join('-')}`;
  }
  return id.replace(/\./g, '-');
}

export function skillDirectoryName(id: string): string {
  const parts = id.split('.');
  return parts.length > 1 ? parts.slice(1).join('-') : id;
}
