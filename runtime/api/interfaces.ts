/**
 * EOR MCP API — interface definitions only.
 * @see docs/mcp/api.md
 */

import type { ArtifactId, ArtifactType, ArtifactStatus } from '../ast/interfaces.ts';
import type { CompilerTargetId } from '../compiler/interfaces.ts';
import type { ValidationTier } from '../ast/interfaces.ts';

// ---------------------------------------------------------------------------
// Response envelope
// ---------------------------------------------------------------------------

export interface ResponseMeta {
  eklVersion: string;
  eorVersion: string;
  requestId: string;
  durationMs: number;
  artifactsLoaded?: number;
  capabilityFirst?: boolean;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown[];
}

export interface ToolResponse<T> {
  ok: boolean;
  meta: ResponseMeta;
  data?: T;
  error?: ErrorDetail;
}

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ArtifactSummary {
  id: ArtifactId;
  type: ArtifactType;
  version: string;
  status: ArtifactStatus;
  lifecycle?: string;
  owner?: string;
  confidence?: string;
  path?: string;
  provides?: string[];
}

export interface ArtifactDetail extends ArtifactSummary {
  body?: string;
  evidence?: unknown[];
  dependencies?: ArtifactId[];
  orchestrates?: unknown;
  validationState?: unknown;
}

export interface GraphNodeSummary {
  id: ArtifactId;
  type: ArtifactType;
  version: string;
  status: ArtifactStatus;
}

export interface GraphEdgeSummary {
  from: ArtifactId;
  to: ArtifactId;
  type: string;
}

// ---------------------------------------------------------------------------
// Tool input types
// ---------------------------------------------------------------------------

export interface StatusInput {}

export interface CapabilitiesInput {
  domain?: string;
  status?: ArtifactStatus;
  provides?: string;
  limit?: number;
}

export interface CompetenciesInput {
  status?: ArtifactStatus;
  enablesCapability?: ArtifactId;
  limit?: number;
}

export interface SkillsInput {
  query?: string;
  pack?: string;
  capability?: ArtifactId;
  status?: ArtifactStatus;
  includeOrphan?: boolean;
  limit?: number;
}

export interface FindInput {
  id?: ArtifactId;
  query?: string;
  type?: ArtifactType;
  limit?: number;
}

export interface ReviewInput {
  capability: ArtifactId;
  includeBody?: boolean;
  includeEvidence?: boolean;
  minConfidence?: string;
}

export interface CompileInput {
  target: CompilerTargetId;
  capability: ArtifactId;
  outputDir?: string;
  minStatus?: ArtifactStatus;
  minConfidence?: string;
  projectOverlay?: string;
}

export interface DependenciesInput {
  id: ArtifactId;
  depth?: number;
  direction?: 'downstream' | 'upstream' | 'both';
}

export interface ValidateInput {
  scope?: 'all' | 'capability' | 'pack' | 'changed';
  capability?: ArtifactId;
  pack?: string;
  tiers?: ValidationTier[];
  failOnWarnings?: boolean;
}

export interface GraphInput {
  capability?: ArtifactId;
  format?: 'json' | 'mermaid';
}

export interface SearchInput {
  query: string;
  mode?: 'keyword' | 'semantic' | 'hybrid';
  type?: ArtifactType;
  limit?: number;
}

export interface EvidenceInput {
  id: ArtifactId;
  transitive?: boolean;
}

export interface SnapshotInput {
  capability: ArtifactId;
  format?: 'markdown' | 'json';
  includeEvidence?: boolean;
  includeGraph?: boolean;
}

export interface ExportInput {
  target: CompilerTargetId;
  scope?: 'all' | 'pack' | 'capability';
  pack?: string;
  capability?: ArtifactId;
  outputDir?: string;
}

// ---------------------------------------------------------------------------
// MCP tool handler interface
// ---------------------------------------------------------------------------

export type ToolName =
  | 'engineeringos.status'
  | 'engineeringos.capabilities'
  | 'engineeringos.competencies'
  | 'engineeringos.skills'
  | 'engineeringos.find'
  | 'engineeringos.review'
  | 'engineeringos.compile'
  | 'engineeringos.dependencies'
  | 'engineeringos.roadmap'
  | 'engineeringos.progress'
  | 'engineeringos.validate'
  | 'engineeringos.graph'
  | 'engineeringos.search'
  | 'engineeringos.adr'
  | 'engineeringos.pack'
  | 'engineeringos.owner'
  | 'engineeringos.evidence'
  | 'engineeringos.snapshot'
  | 'engineeringos.export'
  | 'engineeringos.capture';

export interface ToolHandler<TInput, TOutput> {
  readonly name: ToolName;
  readonly description: string;
  handle(input: TInput): Promise<ToolResponse<TOutput>>;
}

/**
 * MCP API surface — maps tool invocations to EOR operations.
 */
export type RuntimeToolHandler = (
  ctx: unknown,
  input: Record<string, unknown>,
) => Promise<ToolResponse<unknown>>;

export interface McpApi {
  readonly tools: Map<ToolName, RuntimeToolHandler>;
  invoke(name: ToolName, input: unknown): Promise<ToolResponse<unknown>>;
  listTools(): ToolName[];
}

/**
 * Top-level EOR runtime that wires all layers together.
 */
export interface EngineeringOsRuntime {
  readonly api: McpApi;
  readonly version: string;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
