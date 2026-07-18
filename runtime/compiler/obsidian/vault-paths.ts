/**
 * Map EKL index entries to Obsidian vault relative paths.
 * @see reference/obsidian/README.md
 */

import type { IndexEntry } from '../../ast/interfaces.ts';

export function vaultPathForEntry(entry: IndexEntry): string {
  const { type, id, path } = entry;

  switch (type) {
    case 'capability': {
      const [, domain, ...rest] = id.split('.');
      const name = rest.join('-');
      return `Capabilities/${domain}/${name}.md`;
    }
    case 'agent': {
      return `Agents/${id.replace('agent.', '')}.md`;
    }
    case 'competency': {
      return `Competencies/${id.replace('competency.', '')}/README.md`;
    }
    case 'topic': {
      const match = path.match(/^competencies\/([^/]+)\/(.+)$/);
      if (match) {
        return `Competencies/${match[1]}/${match[2]}`;
      }
      return `Competencies/${id.replace(/^topic\.[^.]+\./, '')}.md`;
    }
    case 'skill': {
      const match = path.match(/^packs\/([^/]+)\/skills\/(.+)$/);
      if (match) {
        return `Skills/${match[1]}/${match[2]}`;
      }
      return `Skills/${id.replace(/^skill\.[^.]+\./, '').replace('.', '/')}.md`;
    }
    case 'workflow': {
      const match = path.match(/^packs\/([^/]+)\/workflows\/(.+)$/);
      if (match) {
        return `Workflows/${match[1]}/${match[2]}`;
      }
      return `Workflows/${id.replace(/^workflow\.[^.]+\./, '').replace('.', '/')}.md`;
    }
    case 'pack': {
      const packName = id.replace('pack.', '');
      if (path.endsWith('manifest.yaml')) {
        return `Packs/${packName}/manifest.yaml`;
      }
      return `Packs/${packName}/README.md`;
    }
    case 'adr': {
      return `ADRs/${path.replace(/^adr\//, '')}`;
    }
    case 'standard': {
      return path.startsWith('standards/') ? `Standards/${path.slice('standards/'.length)}` : `Standards/${id}.md`;
    }
    case 'template': {
      return path.startsWith('templates/') ? `Templates/${path.slice('templates/'.length)}` : `Templates/${id}.md`;
    }
    default:
      return `Other/${path}`;
  }
}
