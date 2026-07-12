const HEADING_PATTERN = /^(#{1,6})\s+(.+)$/gm;

export function extractHeadings(markdown: string): string[] {
  const headings: string[] = [];

  for (const match of markdown.matchAll(HEADING_PATTERN)) {
    headings.push(match[2].trim());
  }

  return headings;
}
