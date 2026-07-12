/**
 * EOR Router — interface definitions only.
 * @see docs/mcp/runtime.md §7
 */

import type {
  ArtifactId,
  ArtifactStatus,
  ArtifactType,
  ConfidenceLevel,
} from '../ast/interfaces.ts';

export interface RouteContext {
  query?: string;
  filePattern?: string;
  tag?: string;
  capability?: ArtifactId;
  minStatus?: ArtifactStatus;
  minConfidence?: ConfidenceLevel;
}

export interface RouteResult {
  matchedCapabilities: ArtifactId[];
  matchedArtifacts: ArtifactId[];
  signals: MatchedSignal[];
}

export interface MatchedSignal {
  signal: 'query' | 'file_pattern' | 'tag' | 'capability';
  value: string;
  matchedIds: ArtifactId[];
}

export interface RouterConfig {
  capabilityFirst: boolean;
  includeOrphanSkills: boolean;
  excludeResearch: boolean;
  excludeLifecycleCreated: boolean;
  migrationMode: boolean;
}

/**
 * Matches request context to capabilities and determines scope.
 * MUST apply capability-first routing.
 */
export interface Router {
  route(context: RouteContext, config?: RouterConfig): Promise<RouteResult>;
  matchCapabilities(context: RouteContext): Promise<ArtifactId[]>;
  matchByType(type: ArtifactType, filter?: RouteContext): Promise<ArtifactId[]>;
}
