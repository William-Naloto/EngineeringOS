/**
 * Minimal YAML parser for EKL Knowledge Contract frontmatter.
 * Handles the subset used in EngineeringOS artifacts — not a general YAML parser.
 */

export function parseContractYaml(source: string): Record<string, unknown> {
  const lines = source.split(/\r?\n/);
  const result: Record<string, unknown> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      i += 1;
      continue;
    }

    const keyMatch = /^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/.exec(trimmed);
    if (!keyMatch) {
      i += 1;
      continue;
    }

    const key = keyMatch[1];
    const rest = keyMatch[2].trim();

    if (rest === '' || rest === '|' || rest === '>') {
      const { value, nextIndex } = parseBlock(lines, i + 1, line.match(/^(\s*)/)?.[1]?.length ?? 0);
      result[key] = value;
      i = nextIndex;
      continue;
    }

    if (rest.startsWith('[')) {
      result[key] = parseInlineArray(rest);
      i += 1;
      continue;
    }

    if (rest === '{}' ) {
      result[key] = {};
      i += 1;
      continue;
    }

    result[key] = parseScalar(rest);
    i += 1;
  }

  return result;
}

function parseBlock(
  lines: string[],
  start: number,
  parentIndent: number,
): { value: unknown; nextIndex: number } {
  const first = lines[start];
  if (!first) {
    return { value: {}, nextIndex: start };
  }

  const firstTrimmed = first.trim();

  if (firstTrimmed.startsWith('- ')) {
    const items: unknown[] = [];
    let i = start;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) {
        i += 1;
        continue;
      }
      if (!trimmed.startsWith('- ')) {
        break;
      }
      items.push(parseScalar(trimmed.slice(2).trim()));
      i += 1;
    }

    return { value: items, nextIndex: i };
  }

  const object: Record<string, unknown> = {};
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const indent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
    if (indent <= parentIndent) {
      break;
    }

    const keyMatch = /^(\s*)([a-zA-Z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!keyMatch) {
      i += 1;
      continue;
    }

    const childKey = keyMatch[2];
    const rest = keyMatch[3].trim();

    if (rest === '') {
      const nested = parseBlock(lines, i + 1, indent);
      object[childKey] = nested.value;
      i = nested.nextIndex;
      continue;
    }

    if (rest.startsWith('[')) {
      object[childKey] = parseInlineArray(rest);
      i += 1;
      continue;
    }

    object[childKey] = parseScalar(rest);
    i += 1;
  }

  return { value: object, nextIndex: i };
}

function parseInlineArray(value: string): unknown[] {
  const inner = value.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  return inner.split(',').map((part) => parseScalar(part.trim()));
}

function parseScalar(value: string): unknown {
  if (value === 'null' || value === '~') {
    return null;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}
