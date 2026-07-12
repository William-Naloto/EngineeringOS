import type { ConfidenceLevel, EvidenceEntry, EvidenceTable, EvidenceType } from '../ast/interfaces.ts';

const EVIDENCE_HEADING = /^## Evidence\s*$/m;

const EVIDENCE_TYPES: readonly EvidenceType[] = [
  'Official documentation',
  'RFC',
  'Internal experience',
  'Industry practice',
  'Benchmark',
  'Internal decision',
];

const CONFIDENCE_LEVELS: readonly ConfidenceLevel[] = ['High', 'Medium', 'Low', 'Unknown'];

export interface EvidenceSplit {
  body: string;
  evidence: EvidenceTable;
}

export function splitEvidenceSection(markdownBody: string): EvidenceSplit {
  const match = EVIDENCE_HEADING.exec(markdownBody);
  if (!match) {
    throw new Error('MISSING_EVIDENCE');
  }

  const body = markdownBody.slice(0, match.index).trimEnd();
  const evidenceSection = markdownBody.slice(match.index + match[0].length).trim();

  return {
    body,
    evidence: parseEvidenceTable(evidenceSection),
  };
}

function parseEvidenceTable(section: string): EvidenceTable {
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const entries: EvidenceEntry[] = [];

  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('---')) {
      continue;
    }

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 3) {
      continue;
    }

    const [source, type, confidence] = cells;

    if (isHeaderRow(source, type, confidence)) {
      continue;
    }

    if (isPlaceholderRow(source, type, confidence)) {
      continue;
    }

    entries.push({
      source,
      type: normalizeEvidenceType(type),
      confidenceContribution: normalizeConfidence(confidence),
    });
  }

  return { entries };
}

function isHeaderRow(source: string, type: string, confidence: string): boolean {
  return (
    source.toLowerCase() === 'source' &&
    type.toLowerCase() === 'type' &&
    confidence.toLowerCase().includes('confidence')
  );
}

function isPlaceholderRow(source: string, type: string, confidence: string): boolean {
  const dash = /^[-—–]+$/;
  return dash.test(source) && dash.test(type);
}

function normalizeEvidenceType(value: string): EvidenceType {
  const match = EVIDENCE_TYPES.find((type) => type.toLowerCase() === value.toLowerCase());
  if (match) {
    return match;
  }

  const partial = EVIDENCE_TYPES.find((type) => value.toLowerCase().includes(type.toLowerCase()));
  if (partial) {
    return partial;
  }

  return 'Industry practice';
}

function normalizeConfidence(value: string): ConfidenceLevel {
  const match = CONFIDENCE_LEVELS.find((level) => level.toLowerCase() === value.toLowerCase());
  return match ?? 'Unknown';
}
