/**
 * EngineeringOS capture pipeline — learn, list, review, extract.
 * @see capture/README.md, ADR 0008, ADR 0013
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type ResearchStatus = 'unvalidated' | 'approved' | 'needs-research' | 'rejected' | 'extracted';
export type CaptureAction = 'learn' | 'list' | 'review' | 'extract' | 'status';

export interface ResearchNoteSummary {
  path: string;
  title: string;
  date: string | null;
  author: string | null;
  project: string | null;
  status: ResearchStatus;
  vendor: string | null;
  domain: string | null;
}

export interface CaptureLearnInput {
  title: string;
  vendor: string;
  domain: string;
  author?: string;
  project?: string;
  context?: string;
  observations?: string;
  sources?: string[];
  analyze_git?: boolean;
  project_path?: string;
  git_since?: string;
}

export interface CaptureReviewInput {
  path: string;
  outcome: 'approved' | 'needs-research' | 'rejected' | 'duplicate';
  reviewer?: string;
  notes?: string;
}

export interface CaptureExtractInput {
  path: string;
  artifact_type: 'skill' | 'standard' | 'workflow';
  artifact_id: string;
  pack?: string;
  title?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseResearchMeta(raw: string): ResearchNoteSummary {
  const titleMatch = raw.match(/^#\s+Research:\s*(.+)$/m);
  const dateMatch = raw.match(/^>\s*Date:\s*(.+)$/m);
  const authorMatch = raw.match(/^>\s*Author:\s*(.+)$/m);
  const projectMatch = raw.match(/^>\s*Project:\s*(.+)$/m);
  const statusMatch = raw.match(/^>\s*Status:\s*(.+)$/m);
  const vendorMatch = raw.match(/^>\s*Vendor:\s*(.+)$/m);
  const domainMatch = raw.match(/^>\s*Domain:\s*(.+)$/m);

  const statusRaw = statusMatch?.[1]?.trim() ?? 'unvalidated';
  const status = (
    ['unvalidated', 'approved', 'needs-research', 'rejected', 'extracted'].includes(statusRaw)
      ? statusRaw
      : 'unvalidated'
  ) as ResearchStatus;

  return {
    path: '',
    title: titleMatch?.[1]?.trim() ?? 'Untitled research',
    date: dateMatch?.[1]?.trim() ?? null,
    author: authorMatch?.[1]?.trim() ?? null,
    project: projectMatch?.[1]?.trim() ?? null,
    status,
    vendor: vendorMatch?.[1]?.trim() ?? null,
    domain: domainMatch?.[1]?.trim() ?? null,
  };
}

async function walkResearchFiles(dir: string, root: string, files: string[] = []): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'drafts') {
        continue;
      }
      await walkResearchFiles(absolute, root, files);
      continue;
    }
    if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      files.push(relative(root, absolute));
    }
  }

  return files;
}

async function loadTemplate(repositoryRoot: string): Promise<string> {
  return readFile(join(repositoryRoot, 'templates/research-note.md'), 'utf8');
}

async function analyzeGitLog(projectPath: string, since = '2 weeks ago'): Promise<string> {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['-C', projectPath, 'log', `--since=${since}`, '--pretty=format:%h %s (%an, %ar)'],
      { maxBuffer: 1024 * 64 },
    );
    if (!stdout.trim()) {
      return '(No commits found in the requested window)';
    }
    return stdout
      .split('\n')
      .slice(0, 30)
      .map((line) => `- ${line}`)
      .join('\n');
  } catch {
    return '(Git analysis unavailable — not a git repo or git not installed)';
  }
}

export async function captureLearn(repositoryRoot: string, input: CaptureLearnInput): Promise<{ path: string; content: string }> {
  const date = todayIso();
  const slug = slugify(input.title);
  const relativePath = join('research', input.vendor, input.domain, `${date}-${slug}.md`);
  const absolutePath = join(repositoryRoot, relativePath);
  await mkdir(join(repositoryRoot, 'research', input.vendor, input.domain), { recursive: true });

  let observations = input.observations ?? '- (add observations here)';
  if (input.analyze_git && input.project_path) {
    const gitNotes = await analyzeGitLog(input.project_path, input.git_since ?? '2 weeks ago');
    observations = `${observations}\n\n### Recent git activity\n\n${gitNotes}`;
  }

  const sources =
    input.sources && input.sources.length > 0
      ? input.sources.map((source) => `- ${source}`).join('\n')
      : '- (add sources)';

  const template = await loadTemplate(repositoryRoot);
  const content = template
    .replace('{{TITLE}}', input.title)
    .replace('{{DATE}}', date)
    .replace('{{AUTHOR}}', input.author ?? 'EngineeringOS Capture')
    .replace('{{PROJECT}}', input.project ?? 'unspecified')
    .replace('{{VENDOR}}', input.vendor)
    .replace('{{DOMAIN}}', input.domain)
    .replace('{{CONTEXT}}', input.context ?? 'Captured via EngineeringOS capture pipeline.')
    .replace('{{OBSERVATIONS}}', observations)
    .replace('{{SOURCES}}', sources);

  await writeFile(absolutePath, content, 'utf8');
  return { path: relativePath.replace(/\\/g, '/'), content };
}

export async function captureList(repositoryRoot: string): Promise<ResearchNoteSummary[]> {
  const researchRoot = join(repositoryRoot, 'research');
  const files = await walkResearchFiles(researchRoot, repositoryRoot);
  const notes: ResearchNoteSummary[] = [];

  for (const filePath of files.sort()) {
    const raw = await readFile(join(repositoryRoot, filePath), 'utf8');
    const meta = parseResearchMeta(raw);
    meta.path = filePath;
    notes.push(meta);
  }

  return notes;
}

export async function captureReview(repositoryRoot: string, input: CaptureReviewInput): Promise<{ path: string; status: string }> {
  const absolutePath = join(repositoryRoot, input.path);
  let raw = await readFile(absolutePath, 'utf8');

  const statusMap: Record<CaptureReviewInput['outcome'], ResearchStatus> = {
    approved: 'approved',
    'needs-research': 'needs-research',
    rejected: 'rejected',
    duplicate: 'rejected',
  };

  const newStatus = statusMap[input.outcome];
  raw = raw.replace(/^>\s*Status:\s*.+$/m, `> Status: ${newStatus}`);
  raw = raw.replace(/^>\s*Reviewed:\s*.+$/m, `> Reviewed: ${todayIso()}`);

  if (input.reviewer) {
    if (/^>\s*Reviewer:/m.test(raw)) {
      raw = raw.replace(/^>\s*Reviewer:\s*.+$/m, `> Reviewer: ${input.reviewer}`);
    } else {
      raw = raw.replace(/^>\s*Reviewed:\s*.+$/m, (match) => `${match}\n> Reviewer: ${input.reviewer}`);
    }
  }

  if (input.notes) {
    const reviewSection = `\n## Review notes (${todayIso()})\n\n${input.notes}\n`;
    if (raw.includes('## Capture pipeline')) {
      raw = raw.replace('## Capture pipeline', `${reviewSection}\n## Capture pipeline`);
    } else {
      raw = `${raw.trimEnd()}\n${reviewSection}`;
    }
  }

  raw = raw.replace(
    '| Review | pending |',
    `| Review | ${newStatus === 'approved' ? '✅' : newStatus} |`,
  );

  await writeFile(absolutePath, raw, 'utf8');
  return { path: input.path, status: newStatus };
}

export async function captureExtract(
  repositoryRoot: string,
  input: CaptureExtractInput,
): Promise<{ draft_path: string; content: string }> {
  const sourcePath = join(repositoryRoot, input.path);
  const source = await readFile(sourcePath, 'utf8');
  const meta = parseResearchMeta(source);

  if (meta.status !== 'approved') {
    throw new CaptureError('RESEARCH_NOT_APPROVED', `Research must be approved before extract (current: ${meta.status})`);
  }

  const pack = input.pack ?? 'fabric';
  const location =
    input.artifact_type === 'skill'
      ? `packs/${pack}/skills/${input.artifact_id.split('.').pop()}.md`
      : input.artifact_type === 'workflow'
        ? `packs/${pack}/workflows/${input.artifact_id.split('.').pop()}.md`
        : `standards/${input.pack ?? 'engineering'}/${input.artifact_id.split('.').pop()}.md`;

  const title = input.title ?? meta.title;
  const draftRelative = join('research/drafts', `${slugify(input.artifact_id)}.md`);
  const draftAbsolute = join(repositoryRoot, draftRelative);
  await mkdir(join(repositoryRoot, 'research/drafts'), { recursive: true });

  const content = [
    '---',
    `id: ${input.artifact_id}`,
    'version: "0.1.0"',
    'status: draft',
    'lifecycle: created',
    `owner: ${meta.author ?? 'EngineeringOS Maintainers'}`,
    'classification: Recommendation',
    'confidence: Low',
    'dependencies: []',
    'provides: []',
    'requires: []',
    `references:`,
    `  - ${input.path}`,
    `updated: ${todayIso()}`,
    'reviewed: null',
    '---',
    '',
    `# ${title}`,
    '',
    `> **Draft extracted from research** — [${input.path}](../../${input.path})`,
    '',
    '## Summary',
    '',
    'Distill the approved research observations into actionable guidance.',
    '',
    '## Content',
    '',
    '(Author: expand from research observations)',
    '',
    '## Evidence',
    '',
    '| Source | Type | Confidence contribution |',
    '|--------|------|------------------------|',
    `| ${input.path} | Internal experience | Low |`,
    '',
    '## Target location',
    '',
    `\`${location}\``,
    '',
  ].join('\n');

  await writeFile(draftAbsolute, content, 'utf8');

  const updatedSource = source.replace('| Extract | pending |', '| Extract | ✅ draft |').replace(
    /^>\s*Status:\s*approved$/m,
    '> Status: extracted',
  );
  await writeFile(sourcePath, updatedSource, 'utf8');

  return { draft_path: draftRelative.replace(/\\/g, '/'), content };
}

export async function captureStatus(repositoryRoot: string): Promise<{
  research_notes: number;
  drafts: number;
  by_status: Record<string, number>;
  pipeline: string[];
}> {
  const notes = await captureList(repositoryRoot);
  const byStatus: Record<string, number> = {};

  for (const note of notes) {
    byStatus[note.status] = (byStatus[note.status] ?? 0) + 1;
  }

  let drafts = 0;
  try {
    const draftFiles = await readdir(join(repositoryRoot, 'research/drafts'));
    drafts = draftFiles.filter((file) => file.endsWith('.md')).length;
  } catch {
    drafts = 0;
  }

  return {
    research_notes: notes.length,
    drafts,
    by_status: byStatus,
    pipeline: ['learn', 'review', 'extract', 'publish'],
  };
}

export class CaptureError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'CaptureError';
    this.code = code;
  }
}

export async function runCapture(
  repositoryRoot: string,
  action: CaptureAction,
  input: Record<string, unknown>,
): Promise<unknown> {
  switch (action) {
    case 'learn':
      return captureLearn(repositoryRoot, {
        title: String(input.title ?? ''),
        vendor: String(input.vendor ?? 'engineering'),
        domain: String(input.domain ?? 'general'),
        author: input.author ? String(input.author) : undefined,
        project: input.project ? String(input.project) : undefined,
        context: input.context ? String(input.context) : undefined,
        observations: input.observations ? String(input.observations) : undefined,
        sources: Array.isArray(input.sources) ? input.sources.map(String) : undefined,
        analyze_git: Boolean(input.analyze_git ?? input.analyzeGit),
        project_path: input.project_path ? String(input.project_path) : input.projectPath ? String(input.projectPath) : undefined,
        git_since: input.git_since ? String(input.git_since) : input.gitSince ? String(input.gitSince) : undefined,
      });
    case 'list':
      return { notes: await captureList(repositoryRoot) };
    case 'review':
      return captureReview(repositoryRoot, {
        path: String(input.path ?? ''),
        outcome: (input.outcome ?? 'approved') as CaptureReviewInput['outcome'],
        reviewer: input.reviewer ? String(input.reviewer) : undefined,
        notes: input.notes ? String(input.notes) : undefined,
      });
    case 'extract':
      return captureExtract(repositoryRoot, {
        path: String(input.path ?? ''),
        artifact_type: (input.artifact_type ?? input.type ?? input.artifactType) as CaptureExtractInput['artifact_type'],
        artifact_id: String(input.artifact_id ?? input.artifactId ?? ''),
        pack: input.pack ? String(input.pack) : undefined,
        title: input.title ? String(input.title) : undefined,
      });
    case 'status':
      return captureStatus(repositoryRoot);
    default:
      throw new CaptureError('INVALID_ACTION', `Unknown capture action: ${action}`);
  }
}
