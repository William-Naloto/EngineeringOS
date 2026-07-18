import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';

import { vaultPathForEntry } from './vault-paths.ts';
import { injectWikilinks } from './wikilinks.ts';
import { exportObsidianVault } from './obsidian-compiler.ts';
import { buildFilesystemIndex } from '../../index/filesystem-index.ts';
import { createResolver } from '../../resolver/dependency-resolver.ts';
import { MarkdownParser } from '../../parser/markdown-parser.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../../..');

describe('vaultPathForEntry', () => {
  it('maps capability to Capabilities domain path', () => {
    const path = vaultPathForEntry({
      id: 'capability.fabric.monitoring',
      path: 'capabilities/fabric/monitoring.md',
      type: 'capability',
      mtime: '2026-07-13',
      parsed: false,
    });
    assert.equal(path, 'Capabilities/fabric/monitoring.md');
  });

  it('maps skill to Skills pack path', () => {
    const path = vaultPathForEntry({
      id: 'skill.fabric.monitoring-setup',
      path: 'packs/fabric/skills/monitoring-setup.md',
      type: 'skill',
      mtime: '2026-07-13',
      parsed: false,
    });
    assert.equal(path, 'Skills/fabric/monitoring-setup.md');
  });
});

describe('injectWikilinks', () => {
  it('wraps known artifact ids', () => {
    const known = new Set(['agent.sre', 'skill.fabric.monitoring-setup']);
    const input = 'Uses agent.sre and skill.fabric.monitoring-setup for setup.';
    const output = injectWikilinks(input, known);
    assert.match(output, /\[\[agent\.sre\]\]/);
    assert.match(output, /\[\[skill\.fabric\.monitoring-setup\]\]/);
  });
});

describe('exportObsidianVault', () => {
  it('exports full vault with indexes', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'eos-obsidian-'));
    try {
      const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });
      const resolver = createResolver({
        repositoryRoot: repoRoot,
        index,
        parser: new MarkdownParser(),
        excludeLifecycleCreated: false,
      });

      const result = await exportObsidianVault({
        repositoryRoot: repoRoot,
        outputDir,
        index,
        resolver,
        scope: 'all',
        injectWikilinks: true,
      });

      assert.ok(result.filesWritten >= 40);
      assert.ok(result.outputFiles.includes('README.md'));
      assert.ok(result.outputFiles.includes('_index/CAPABILITIES.md'));
      assert.ok(result.outputFiles.includes('_index/graph-overview.md'));
      assert.ok(result.outputFiles.includes('_templates/research-note.md'));

      const capabilityFile = join(outputDir, 'Capabilities/fabric/monitoring.md');
      await stat(capabilityFile);
      const content = await readFile(capabilityFile, 'utf8');
      assert.match(content, /capability\.fabric\.monitoring/);
      assert.match(content, /\[\[agent\.sre\]\]/);
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });

  it('exports capability slice only', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'eos-obsidian-slice-'));
    try {
      const index = await buildFilesystemIndex({ root: repoRoot, excludeResearch: true });
      const resolver = createResolver({
        repositoryRoot: repoRoot,
        index,
        parser: new MarkdownParser(),
        excludeLifecycleCreated: false,
      });

      const result = await exportObsidianVault({
        repositoryRoot: repoRoot,
        outputDir,
        index,
        resolver,
        scope: 'capability',
        capability: 'capability.fabric.monitoring',
        injectWikilinks: true,
      });

      assert.ok(result.filesWritten >= 5);
      assert.ok(result.filesWritten < 40);
      await stat(join(outputDir, 'Capabilities/fabric/monitoring.md'));
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });
});
