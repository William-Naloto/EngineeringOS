import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  captureLearn,
  captureList,
  captureReview,
  captureExtract,
  captureStatus,
  CaptureError,
} from './capture-service.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

describe('CaptureService', () => {
  it('learns a research note from template', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'eos-capture-'));
    try {
      await mkdir(join(tempRoot, 'templates'), { recursive: true });
      await mkdir(join(tempRoot, 'research'), { recursive: true });
      const template = await readFile(join(repoRoot, 'templates/research-note.md'), 'utf8');
      await mkdir(join(tempRoot, 'templates'), { recursive: true });
      const { writeFile } = await import('node:fs/promises');
      await writeFile(join(tempRoot, 'templates/research-note.md'), template, 'utf8');

      const result = await captureLearn(tempRoot, {
        title: 'Fabric alert tuning',
        vendor: 'microsoft',
        domain: 'fabric',
        author: 'Test Author',
        project: 'GHQ B2B Delta',
        context: 'Tuning New Relic alerts for Fabric pipelines.',
        observations: '- (Fact) P95 duration alerts reduce noise',
        sources: ['https://learn.microsoft.com/en-us/fabric/'],
      });

      assert.match(result.path, /^research\/microsoft\/fabric\/\d{4}-\d{2}-\d{2}-fabric-alert-tuning\.md$/);
      assert.match(result.content, /# Research: Fabric alert tuning/);
      assert.match(result.content, /> Status: unvalidated/);

      const notes = await captureList(tempRoot);
      assert.equal(notes.length, 1);
      assert.equal(notes[0].title, 'Fabric alert tuning');
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it('reviews and extracts approved research', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'eos-capture-review-'));
    try {
      await mkdir(join(tempRoot, 'templates'), { recursive: true });
      const template = await readFile(join(repoRoot, 'templates/research-note.md'), 'utf8');
      const { writeFile } = await import('node:fs/promises');
      await writeFile(join(tempRoot, 'templates/research-note.md'), template, 'utf8');

      const learned = await captureLearn(tempRoot, {
        title: 'PR review checklist',
        vendor: 'engineering',
        domain: 'review',
        observations: '- (BestPractice) Always check test coverage',
      });

      await captureReview(tempRoot, {
        path: learned.path,
        outcome: 'approved',
        reviewer: 'Maintainer',
        notes: 'Ready for skill extraction.',
      });

      const reviewed = await captureList(tempRoot);
      assert.equal(reviewed[0].status, 'approved');

      const extracted = await captureExtract(tempRoot, {
        path: learned.path,
        artifact_type: 'skill',
        artifact_id: 'skill.engineering.pr-checklist',
        pack: 'engineering',
        title: 'PR Review Checklist',
      });

      assert.match(extracted.draft_path, /^research\/drafts\/skill-engineering-pr-checklist\.md$/);
      assert.match(extracted.content, /id: skill.engineering.pr-checklist/);
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it('rejects extract on unapproved research', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'eos-capture-reject-'));
    try {
      await mkdir(join(tempRoot, 'templates'), { recursive: true });
      const template = await readFile(join(repoRoot, 'templates/research-note.md'), 'utf8');
      const { writeFile } = await import('node:fs/promises');
      await writeFile(join(tempRoot, 'templates/research-note.md'), template, 'utf8');

      const learned = await captureLearn(tempRoot, {
        title: 'Draft only',
        vendor: 'engineering',
        domain: 'misc',
      });

      await assert.rejects(
        () =>
          captureExtract(tempRoot, {
            path: learned.path,
            artifact_type: 'skill',
            artifact_id: 'skill.engineering.draft-only',
          }),
        (error: unknown) => error instanceof CaptureError && error.code === 'RESEARCH_NOT_APPROVED',
      );
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it('reports capture pipeline status', async () => {
    const status = await captureStatus(repoRoot);
    assert.ok(Array.isArray(status.pipeline));
    assert.equal(status.pipeline.length, 4);
  });
});
