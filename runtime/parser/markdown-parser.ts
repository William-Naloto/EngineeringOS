import { readFile } from 'node:fs/promises';

import { deriveArtifactType } from '../ast/artifact-type.ts';
import type { KnowledgeNode } from '../ast/interfaces.ts';

import { parseError } from './errors.ts';
import { extractFrontmatter } from './extract-frontmatter.ts';
import type { ParseRequest, ParseResult, Parser } from './interfaces.ts';
import { parseContract } from './parse-contract.ts';
import { splitEvidenceSection } from './parse-evidence.ts';
import { extractHeadings } from './parse-headings.ts';

export class MarkdownParser implements Parser {
  async parse(request: ParseRequest): Promise<ParseResult> {
    const start = performance.now();

    try {
      const node = this.parseSync(request.path, request.raw);
      return {
        node,
        durationMs: performance.now() - start,
      };
    } catch (error) {
      throw this.toParserException(request.path, error);
    }
  }

  async parseFile(path: string): Promise<ParseResult> {
    const raw = await readFile(path, 'utf8');
    return this.parse({ path, raw });
  }

  private parseSync(path: string, raw: string): KnowledgeNode {
    let frontmatter: string;
    let markdownBody: string;

    try {
      ({ frontmatter, body: markdownBody } = extractFrontmatter(raw));
    } catch {
      throw parseError(path, 'MISSING_FRONTMATTER', 'Artifact is missing YAML frontmatter');
    }

    let contract;
    try {
      contract = parseContract(frontmatter);
    } catch {
      throw parseError(path, 'INVALID_YAML', 'Failed to parse YAML frontmatter');
    }

    let bodyWithoutEvidence: string;
    let evidence;
    try {
      ({ body: bodyWithoutEvidence, evidence } = splitEvidenceSection(markdownBody));
    } catch {
      throw parseError(path, 'MISSING_EVIDENCE', 'Artifact is missing ## Evidence section');
    }

    let type;
    try {
      type = deriveArtifactType(contract.id);
    } catch {
      throw parseError(path, 'UNKNOWN_TYPE', `Unrecognized artifact id prefix: ${contract.id}`);
    }

    return {
      contract,
      body: {
        raw: bodyWithoutEvidence,
        headings: extractHeadings(bodyWithoutEvidence),
      },
      evidence,
      type,
      path,
    };
  }

  private toParserException(path: string, error: unknown): never {
    if (error instanceof Error && error.name === 'ParserException') {
      throw error;
    }

    throw parseError(path, 'INVALID_YAML', error instanceof Error ? error.message : 'Parse failed');
  }
}

export function createParser(): Parser {
  return new MarkdownParser();
}
