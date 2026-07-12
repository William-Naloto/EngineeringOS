/**
 * EOR Canonical AST — interface definitions only.
 * @see docs/mcp/domain-model.md
 * @see spec/contracts.md
 */

// ---------------------------------------------------------------------------
// Primitive types
// ---------------------------------------------------------------------------

export type ArtifactId = string;
export type SemVer = string;
export type ISO8601 = string;

export type ArtifactType =
  | 'capability'
  | 'competency'
  | 'agent'
  | 'topic'
  | 'skill'
  | 'workflow'
  | 'standard'
  | 'template'
  | 'pack'
  | 'adr';

export type ArtifactStatus = 'draft' | 'experimental' | 'stable' | 'deprecated';

export type ArtifactLifecycle =
  | 'created'
  | 'validated'
  | 'published'
  | 'maintained'
  | 'deprecated';

export type Classification =
  | 'Fact'
  | 'BestPractice'
  | 'Recommendation'
  | 'Experimental';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

export type EvidenceType =
  | 'Official documentation'
  | 'RFC'
  | 'Internal experience'
  | 'Industry practice'
  | 'Benchmark'
  | 'Internal decision';

export type EdgeType =
  | 'depends_on'
  | 'orchestrates_competency'
  | 'orchestrates_skill'
  | 'orchestrates_workflow'
  | 'orchestrates_agent'
  | 'topic_of'
  | 'replaces'
  | 'enables_capability';

export type ValidationTier =
  | 'schema'
  | 'dependency'
  | 'lifecycle'
  | 'evidence'
  | 'ownership'
  | 'version';

// ---------------------------------------------------------------------------
// Contract metadata
// ---------------------------------------------------------------------------

export interface OrchestrationRef {
  competencies?: ArtifactId[];
  agents?: ArtifactId[];
  skills?: ArtifactId[];
  workflows?: ArtifactId[];
}

export interface ContractMetadata {
  id: ArtifactId;
  version: SemVer;
  status: ArtifactStatus;
  lifecycle: ArtifactLifecycle;
  owner: string;
  classification: Classification;
  confidence: ConfidenceLevel;
  dependencies: ArtifactId[];
  provides: string[];
  requires: string[];
  references: string[];
  updated: ISO8601;
  reviewed: ISO8601 | null;
  orchestrates?: OrchestrationRef;
  replaces?: ArtifactId;
  tags?: string[];
  triggers?: string[];
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export interface EvidenceEntry {
  source: string;
  type: EvidenceType;
  confidenceContribution: ConfidenceLevel;
}

export interface EvidenceTable {
  entries: EvidenceEntry[];
}

// ---------------------------------------------------------------------------
// Knowledge node (canonical AST unit)
// ---------------------------------------------------------------------------

export interface MarkdownPayload {
  raw: string;
  headings: string[];
}

export interface ValidationIssue {
  artifactId: ArtifactId;
  tier: ValidationTier;
  code: string;
  message: string;
  path?: string;
}

export interface ValidationState {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  validatedAt: ISO8601;
}

export interface KnowledgeNode {
  contract: ContractMetadata;
  body: MarkdownPayload;
  evidence: EvidenceTable;
  type: ArtifactType;
  path: string;
  validationState?: ValidationState;
}

// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------

export interface Edge {
  from: ArtifactId;
  to: ArtifactId;
  type: EdgeType;
}

export interface GraphNode {
  id: ArtifactId;
  type: ArtifactType;
  version: SemVer;
  status: ArtifactStatus;
}

export interface ASTGraph {
  nodes: Map<ArtifactId, KnowledgeNode>;
  edges: Edge[];
  metadata: ASTGraphMetadata;
}

export interface ASTGraphMetadata {
  rootCapability?: ArtifactId;
  resolvedAt: ISO8601;
  nodeCount: number;
  edgeCount: number;
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

export interface IndexEntry {
  id: ArtifactId;
  path: string;
  type: ArtifactType;
  mtime: ISO8601;
  parsed: boolean;
}

export interface RepositoryIndex {
  entries: Map<ArtifactId, IndexEntry>;
  builtAt: ISO8601;
  root: string;
}

// ---------------------------------------------------------------------------
// Competency manifest
// ---------------------------------------------------------------------------

export interface CompetencyManifest {
  id: ArtifactId;
  version: SemVer;
  status: ArtifactStatus;
  lifecycle: ArtifactLifecycle;
  owner: string;
  topics: ArtifactId[];
  enablesCapabilities: ArtifactId[];
}

// ---------------------------------------------------------------------------
// Pack manifest
// ---------------------------------------------------------------------------

export interface PackManifest {
  id: ArtifactId;
  version: SemVer;
  skills: ArtifactId[];
  workflows: ArtifactId[];
  templates: ArtifactId[];
}
