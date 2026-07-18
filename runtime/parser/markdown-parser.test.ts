import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deriveArtifactType } from '../ast/artifact-type.ts';

import { ParserException } from './errors.ts';
import { extractFrontmatter } from './extract-frontmatter.ts';
import { MarkdownParser } from './markdown-parser.ts';
import { splitEvidenceSection } from './parse-evidence.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

describe('deriveArtifactType', () => {
  it('derives type from id prefix', () => {
    assert.equal(deriveArtifactType('capability.engineering.review-pr'), 'capability');
    assert.equal(deriveArtifactType('topic.architecture.design-principles'), 'topic');
  });
});

describe('extractFrontmatter', () => {
  it('splits yaml frontmatter from body', () => {
    const raw = `---
id: skill.test.example
version: "1.0.0"
---
# Title

Body content.
`;

    const result = extractFrontmatter(raw);
    assert.match(result.frontmatter, /id: skill.test.example/);
    assert.match(result.body, /# Title/);
  });

  it('throws when frontmatter is missing', () => {
    assert.throws(() => extractFrontmatter('# No frontmatter'), /MISSING_FRONTMATTER/);
  });
});

describe('splitEvidenceSection', () => {
  it('extracts evidence table and body', () => {
    const body = `# Title

## Core

Content here.

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| RFC 2119 | RFC | High |
`;

    const result = splitEvidenceSection(body);
    assert.match(result.body, /## Core/);
    assert.doesNotMatch(result.body, /## Evidence/);
    assert.equal(result.evidence.entries.length, 1);
    assert.deepEqual(result.evidence.entries[0], {
      source: 'RFC 2119',
      type: 'RFC',
      confidenceContribution: 'High',
    });
  });

  it('throws when evidence section is missing', () => {
    assert.throws(
      () => splitEvidenceSection('# Title\n\nNo evidence here.'),
      /MISSING_EVIDENCE/,
    );
  });
});

describe('MarkdownParser', () => {
  const parser = new MarkdownParser();

  it('parses a real capability artifact from the repository', async () => {
    const path = join(repoRoot, 'capabilities/engineering/review-pr.md');
    const result = await parser.parseFile(path);

    assert.equal(result.node.contract.id, 'capability.engineering.review-pr');
    assert.equal(result.node.type, 'capability');
    assert.equal(result.node.contract.status, 'experimental');
    assert.ok(result.node.contract.orchestrates?.competencies?.includes(
      'competency.principal-software-architect',
    ));
    assert.ok(result.node.body.headings.includes('Purpose'));
    assert.ok(result.node.evidence.entries.length >= 3);
    assert.ok(result.durationMs >= 0);
  });

  it('parses a real topic artifact with evidence entries', async () => {
    const path = join(
      repoRoot,
      'competencies/principal-software-architect/design-principles.md',
    );
    const result = await parser.parseFile(path);

    assert.equal(result.node.contract.id, 'topic.architecture.design-principles');
    assert.equal(result.node.type, 'topic');
    assert.ok(result.node.evidence.entries.length > 0);
    assert.equal(result.node.evidence.entries[0].type, 'Internal decision');
    assert.match(result.node.body.raw, /Design Principles/);
  });

  it('parses inline markdown source', async () => {
    const raw = await readFile(
      join(repoRoot, 'capabilities/engineering/review-pr.md'),
      'utf8',
    );

    const result = await parser.parse({
      path: 'capabilities/engineering/review-pr.md',
      raw,
    });

    assert.equal(result.node.path, 'capabilities/engineering/review-pr.md');
    assert.ok(result.node.contract.triggers?.includes('code review'));
  });

  it('throws ParserException for missing frontmatter', async () => {
    await assert.rejects(
      parser.parse({ path: 'broken.md', raw: '# No contract' }),
      ParserException,
    );
  });
});
