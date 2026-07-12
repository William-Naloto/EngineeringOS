import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { KnowledgeNode } from '../ast/interfaces.ts';
import { MarkdownParser } from '../parser/markdown-parser.ts';

import { createValidator } from './ekl-validator.ts';
import { detectCycles, graphFromNodes } from './graph-rules.ts';
import { validateLifecycleRules } from './lifecycle-rules.ts';
import { validateSchemaRules } from './schema-rules.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const parser = new MarkdownParser();

async function parseArtifact(relativePath: string): Promise<KnowledgeNode> {
  const result = await parser.parseFile(join(repoRoot, relativePath));
  return result.node;
}

describe('validateSchemaRules', () => {
  it('accepts a valid draft capability', async () => {
    const node = await parseArtifact('capabilities/engineering/review-pr.md');
    const result = validateSchemaRules(node);
    assert.equal(result.errors.length, 0);
  });

  it('rejects invalid id pattern', () => {
    const node = makeNode({
      id: 'Invalid-ID',
      version: '1.0.0',
    });
    const result = validateSchemaRules(node);
    assert.ok(result.errors.some((entry) => entry.code === 'INVALID_ID_PATTERN'));
  });

  it('rejects research paths in compile scope', () => {
    const node = makeNode({ id: 'skill.test.example', version: '1.0.0' }, 'research/notes/example.md');
    const result = validateSchemaRules(node);
    assert.ok(result.errors.some((entry) => entry.code === 'RESEARCH_IN_SCOPE'));
  });
});

describe('validateLifecycleRules', () => {
  it('rejects stable without reviewed date', () => {
    const node = makeNode({
      id: 'skill.test.example',
      version: '1.0.0',
      status: 'stable',
      reviewed: null,
    });

    const result = validateLifecycleRules(node, {
      tiers: ['lifecycle'],
      failOnWarnings: false,
      checkOwnership: false,
      rejectUnknownConfidence: true,
    });

    assert.ok(result.errors.some((entry) => entry.code === 'STABLE_WITHOUT_REVIEWED'));
  });

  it('rejects stable with unknown confidence by default', () => {
    const node = makeNode({
      id: 'capability.test.example',
      version: '1.0.0',
      status: 'stable',
      confidence: 'Unknown',
      reviewed: '2026-01-01',
    });

    const result = validateLifecycleRules(node, {
      tiers: ['lifecycle'],
      failOnWarnings: false,
      checkOwnership: false,
      rejectUnknownConfidence: true,
    });

    assert.ok(result.errors.some((entry) => entry.code === 'STABLE_UNKNOWN_CONFIDENCE'));
  });
});

describe('detectCycles', () => {
  it('detects circular dependencies', () => {
    const a = makeNode({ id: 'skill.a.test', version: '1.0.0', dependencies: ['skill.b.test'] });
    const b = makeNode({ id: 'skill.b.test', version: '1.0.0', dependencies: ['skill.a.test'] });
    const graph = graphFromNodes([a, b]);

    const cycles = detectCycles(graph);
    assert.ok(cycles.some((entry) => entry.code === 'CYCLE_DETECTED'));
  });
});

describe('EklValidator', () => {
  const validator = createValidator({
    ownershipRegistryPath: join(repoRoot, 'OWNERS.md'),
  });

  it('validates a real draft capability with warnings only', async () => {
    const node = await parseArtifact('capabilities/engineering/review-pr.md');
    const result = await validator.validateNode(node);

    assert.equal(result.artifactId, 'capability.engineering.review-pr');
    assert.equal(result.errors.length, 0);
    assert.ok(result.warnings.some((entry) => entry.code === 'EMPTY_EVIDENCE'));
  });

  it('validates schema tier in isolation', async () => {
    const node = await parseArtifact('competencies/principal-software-architect/design-principles.md');
    const result = await validator.validateSchema(node);
    assert.equal(result.errors.length, 0);
  });

  it('validates graph with unresolved references as dependency errors', async () => {
    const node = await parseArtifact('capabilities/engineering/review-pr.md');
    const graph = graphFromNodes([node]);
    const result = await validator.validateGraph(graph, {
      tiers: ['schema', 'dependency', 'evidence'],
      failOnWarnings: false,
      checkOwnership: false,
      rejectUnknownConfidence: true,
    });

    assert.equal(result.nodeResults.length, 1);
    assert.ok(result.graphErrors.some((entry) => entry.code === 'UNRESOLVED_REFERENCE'));
  });

  it('loads ownership registry for stable artifacts', async () => {
    const node = makeNode({
      id: 'skill.test.example',
      version: '1.0.0',
      status: 'stable',
      owner: 'Unknown Team',
      reviewed: '2026-01-01',
      confidence: 'High',
    });

    const result = await validator.validateNode(node, {
      tiers: ['ownership'],
      failOnWarnings: false,
      checkOwnership: true,
      rejectUnknownConfidence: true,
    });

    assert.ok(result.warnings.some((entry) => entry.code === 'OWNER_NOT_IN_REGISTRY'));
  });
});

function makeNode(
  contractOverrides: Record<string, unknown>,
  path = 'packs/test/skills/example.md',
): KnowledgeNode {
  const id = String(contractOverrides.id ?? 'skill.test.example');

  return {
    contract: {
      id,
      version: '1.0.0',
      status: 'draft',
      lifecycle: 'created',
      owner: 'EngineeringOS Maintainers',
      classification: 'BestPractice',
      confidence: 'Medium',
      dependencies: [],
      provides: [],
      requires: [],
      references: [],
      updated: '2026-07-12',
      reviewed: null,
      ...contractOverrides,
    },
    body: {
      raw: '# Example\n\nContent.',
      headings: ['Example'],
    },
    evidence: {
      entries: [
        {
          source: 'Example source',
          type: 'Industry practice',
          confidenceContribution: 'Medium',
        },
      ],
    },
    type: id.split('.')[0] as KnowledgeNode['type'],
    path,
  };
}
