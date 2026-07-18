import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';

import { slugFromId, cursorRuleRelativePath, cursorSkillRelativePath } from './paths.ts';
import { buildMdcFile, buildSkillFile, stripMarkdownFrontmatter } from './markdown.ts';
import { compileCursorCapability } from './cursor-compiler.ts';
import { buildFilesystemIndex } from '../../index/filesystem-index.ts';
import { createResolver } from '../../resolver/dependency-resolver.ts';
import { MarkdownParser } from '../../parser/markdown-parser.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../../..');

describe('cursor paths', () => {
  it('maps agent id to agent rule slug', () => {
    assert.equal(slugFromId('agent.sre', 'agent'), 'agent-sre');
  });

  it('maps capability id to capability rule slug', () => {
    assert.equal(slugFromId('capability.fabric.monitoring', 'capability'), 'capability-fabric-monitoring');
  });
});

describe('cursor markdown', () => {
  it('builds mdc with description from provides', () => {
    const body = '# Fabric Monitoring\n\nContent here.';
    const mdc = buildMdcFile(
      {
        id: 'capability.fabric.monitoring',
        version: '0.1.0',
        status: 'experimental',
        lifecycle: 'validated',
        owner: 'test',
        classification: 'Recommendation',
        confidence: 'Medium',
        dependencies: [],
        provides: ['fabric-monitoring'],
        requires: [],
        references: [],
        updated: '2026-07-13',
        reviewed: '2026-07-13',
      },
      `---\nid: test\n---\n${body}`,
    );

    assert.match(mdc, /^---\n/);
    assert.match(mdc, /description: Fabric Monitoring — fabric-monitoring/);
    assert.match(mdc, /alwaysApply: false/);
    assert.match(mdc, /# Fabric Monitoring/);
    assert.doesNotMatch(mdc, /^---\nid: test/m);
  });
});

describe('compileCursorCapability', () => {
  it('compiles fabric monitoring capability bundle', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'eos-cursor-'));
    try {
      const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });
      const resolver = createResolver({
        repositoryRoot: repoRoot,
        index,
        parser: new MarkdownParser(),
        excludeLifecycleCreated: false,
      });

      const result = await compileCursorCapability({
        repositoryRoot: repoRoot,
        outputDir,
        index,
        resolver,
        capability: 'capability.fabric.monitoring',
      });

      assert.equal(result.capability, 'capability.fabric.monitoring');
      assert.ok(result.filesWritten >= 8);

      const capabilityRule = join(outputDir, 'cursor/rules/capability-fabric-monitoring.mdc');
      await stat(capabilityRule);
      const ruleContent = await readFile(capabilityRule, 'utf8');
      assert.match(ruleContent, /description:.*Fabric Monitoring/);
      assert.match(ruleContent, /alwaysApply: true/);

      const agentRule = join(outputDir, 'cursor/rules/agent-sre.mdc');
      await stat(agentRule);
      const skillPath = join(outputDir, 'cursor/skills/fabric-monitoring-setup/SKILL.md');
      await stat(skillPath);
      const skillContent = await readFile(skillPath, 'utf8');
      assert.match(skillContent, /^---\nname: fabric-monitoring-setup/);
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });
});
