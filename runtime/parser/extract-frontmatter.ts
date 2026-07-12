export interface FrontmatterSplit {
  frontmatter: string;
  body: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function extractFrontmatter(raw: string): FrontmatterSplit {
  const match = FRONTMATTER_PATTERN.exec(raw);
  if (!match) {
    throw new Error('MISSING_FRONTMATTER');
  }

  return {
    frontmatter: match[1],
    body: match[2],
  };
}
