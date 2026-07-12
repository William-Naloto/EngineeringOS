# EOR Runtime Behavior

> **Version:** 0.1.0-draft  
> **Status:** Architecture — no implementation  
> **Companion:** [specification.md](specification.md) · [domain-model.md](domain-model.md)

This document defines **how the EngineeringOS Runtime (EOR) behaves** at each pipeline stage. It describes contracts and algorithms — not implementation details. Implementations MUST conform to these behaviors.

---

## 1. Runtime overview

The EOR is a **lazy, capability-first knowledge runtime**. It interprets EKL artifacts from the EngineeringOS repository and exposes them through MCP tools. It never embeds engineering knowledge.

```
Filesystem
    ↓
Parser
    ↓
EKL AST
    ↓
Validator
    ↓
Normalizer (optional)
    ↓
Dependency Resolver
    ↓
Router
    ↓
Compiler
    ↓
MCP Tools
    ↓
AI IDE
```

Each stage has defined inputs, outputs, invariants, and failure modes. Stages MUST execute in this order. Stages MAY be skipped only when their operation is not required (e.g., Compiler skipped for read-only tools).

---

## 2. Filesystem layer

### 2.1 Responsibility

Discover and index artifacts without parsing content.

### 2.2 Behavior

| Operation | Behavior |
|-----------|----------|
| **Index build** | Walk repository according to EKL directory conventions. Record `id`, `path`, `type`, `mtime`. |
| **Lookup by ID** | O(1) or O(log n) lookup from index. |
| **Lookup by path** | Reverse lookup from index. |
| **Watch** | MAY watch filesystem for changes and invalidate index entries (future). |

### 2.3 Index entry

```typescript
interface IndexEntry {
  id: string;
  path: string;
  type: ArtifactType;
  mtime: string;
  parsed: boolean;
}
```

### 2.4 Invariants

- Index MUST be built at INIT, not on every request
- Index MUST NOT parse artifact content
- Index MUST exclude `research/` from default scope
- Index MUST respect `.gitignore` and `.engineeringos/` overlay paths

### 2.5 Directory conventions

| Type | Path pattern |
|------|-------------|
| Capability | `capabilities/<domain>/*.md` |
| Competency | `competencies/<name>/` |
| Skill | `packs/<pack>/skills/*.md` |
| Workflow | `packs/<pack>/workflows/*.md` |
| Standard | `standards/<domain>/*.md` |
| Agent | `agents/*.md` |
| ADR | `adr/*.md` |
| Pack | `packs/<pack>/manifest.yaml` |

---

## 3. Parsing

### 3.1 Responsibility

Transform Markdown source files into canonical AST nodes.

### 3.2 Input / output

```
Input:  file path + raw Markdown
Output: KnowledgeNode { contract, body, evidence }
```

### 3.3 Algorithm

1. Split YAML frontmatter from Markdown body (delimiter `---`)
2. Parse frontmatter into `ContractMetadata`
3. Extract `## Evidence` section from body into `EvidenceTable`
4. Remaining body becomes `MarkdownPayload`
5. Derive `ArtifactType` from `contract.id` prefix
6. Return `KnowledgeNode`

### 3.4 Lazy parsing

- Artifacts MUST be parsed on first access, not at index time
- Parsed nodes MAY be retained in an in-memory node cache (see §9)
- Cache invalidation MUST occur when `mtime` changes

### 3.5 Failure modes

| Condition | Result |
|-----------|--------|
| Missing frontmatter | `VALIDATION_FAILED` — reject node |
| Invalid YAML | `VALIDATION_FAILED` — reject node |
| Missing `## Evidence` | `VALIDATION_FAILED` — reject node (validator catches) |
| Unrecognized ID prefix | `VALIDATION_FAILED` — reject node |

### 3.5 Interface

See `runtime/parser/interfaces.ts`.

---

## 4. Validation

### 4.1 Responsibility

Enforce EKL contract rules on parsed nodes and graphs.

### 4.2 Validation tiers

| Tier | Scope | When | Failure |
|------|-------|------|---------|
| **Schema** | Contract fields vs JSON Schema | Per node | Reject node |
| **Dependency** | Reference resolution, acyclicity | Per graph | Reject graph |
| **Lifecycle** | Status/lifecycle consistency | Per node | Reject or warn |
| **Evidence** | Evidence section structure | Per node | Reject node |
| **Ownership** | Owner in registry | Per node (stable) | Warn or reject |
| **Version** | SemVer, `replaces` on deprecated | Per node | Reject node |

### 4.3 Schema validation

- MUST validate against `schemas/knowledge-contract.schema.yaml`
- MUST verify `id` matches `type.domain.name` pattern
- MUST verify all required fields present

### 4.4 Dependency validation

- MUST verify all `dependencies` references resolve to existing artifacts
- MUST verify all `orchestrates` references resolve
- MUST detect cycles and reject with `CYCLE_DETECTED`
- SHOULD warn on orphan skills not referenced by any capability

### 4.5 Lifecycle validation

| Rule | Action |
|------|--------|
| `status: stable` + `reviewed: null` | Reject |
| `status: stable` + `confidence: Unknown` | Reject (default) |
| `status: deprecated` + no `replaces` | Reject |
| `lifecycle: created` in production route | Exclude (default) |

### 4.6 Evidence validation

- MUST verify `## Evidence` section exists
- MUST verify table has required columns: Source, Type, Confidence contribution
- SHOULD verify evidence types are from allowed enumeration

### 4.7 Ownership validation

- For `status: stable` artifacts: owner SHOULD exist in [OWNERS.md](../../OWNERS.md)
- Configurable: warn vs reject

### 4.8 Version validation

- `version` MUST be valid SemVer 2.0.0
- `replaces` MUST point to existing artifact when `status: deprecated`
- Duplicate `id` across repository MUST be rejected

### 4.9 Interface

See `runtime/validator/interfaces.ts`.

---

## 5. Normalization

### 5.1 Responsibility

Normalize structure and metadata without changing semantic meaning. Optional reference extension per [spec/specification.md §5.2](../../spec/specification.md).

### 5.2 Operations

| Operation | Description |
|-----------|-------------|
| **Field ordering** | Canonical key order in contract metadata |
| **Array sorting** | Sort `dependencies`, `provides`, `tags` for deterministic output |
| **Whitespace** | Normalize Markdown body whitespace |
| **ID canonicalization** | Ensure lowercase kebab-case segments |
| **Date normalization** | ISO 8601 format for `updated`, `reviewed` |

### 5.3 Invariants

- Normalization MUST be idempotent: `normalize(normalize(x)) === normalize(x)`
- Normalization MUST NOT add, remove, or alter semantic field values
- Normalization MAY run after validation, before resolution

### 5.4 Interface

See `runtime/normalizer/interfaces.ts`.

---

## 6. Dependency resolution

### 6.1 Responsibility

Expand a scoped request into a minimal, ordered artifact subgraph.

### 6.2 Algorithm

Given activated capabilities `C` and configuration `cfg`:

```
1. nodes ← ∅
2. For each c ∈ C:
     nodes ← nodes ∪ { load_and_parse(c) }
     nodes ← nodes ∪ expand_orchestrates(c)
3. For each competency ∈ orchestrated competencies:
     nodes ← nodes ∪ expand_manifest_topics(competency)
4. Repeat until fixed point:
     For each n ∈ nodes:
       nodes ← nodes ∪ resolve_dependencies(n)
5. nodes ← filter(nodes, cfg.status, cfg.confidence, cfg.lifecycle)
6. If |nodes| > cfg.max_artifacts_per_session:
     reject SCOPE_TOO_LARGE
7. If cycle detected in dependency edges:
     reject CYCLE_DETECTED
8. Return topologically_sorted(nodes)
```

### 6.3 Expansion rules

| Field | Expansion |
|-------|-----------|
| `orchestrates.competencies` | Load competency + manifest topics |
| `orchestrates.agents` | Load agent artifact |
| `orchestrates.skills` | Load skill artifacts |
| `orchestrates.workflows` | Load workflow artifacts |
| `dependencies` | Transitive — resolve all referenced artifacts |

### 6.4 Project overlay

When `.engineeringos/` overlay exists:

- Overlay artifacts MUST win on ID conflict
- Overlay dependencies MUST be resolved after base resolution
- Overlay path: `.engineeringos/` relative to project root

### 6.5 Output

```typescript
interface ResolvedGraph {
  nodes: KnowledgeNode[];
  edges: Edge[];
  order: ArtifactId[];  // topological sort
  stats: {
    total_nodes: number;
    capabilities: number;
    competencies: number;
    skills: number;
    standards: number;
  };
}
```

### 6.6 Interface

See `runtime/resolver/interfaces.ts`.

---

## 7. Routing

### 7.1 Responsibility

Match request context to capabilities and determine scope.

### 7.2 Capability-first rule

Routers MUST match capabilities before individual skills. Skills MUST NOT be loaded unless:

1. Reached via capability orchestration, OR
2. Explicitly requested (`include_orphan_skills: true`), OR
3. Directly named in the request (e.g., `engineeringos.skills` with explicit ID)

### 7.3 Context signals

| Signal | Matching strategy |
|--------|-------------------|
| `query` | Keyword match against capability `triggers` and `provides` |
| `file_pattern` | Glob match against artifact paths and tags |
| `tag` | Exact match on contract `tags` |
| `capability` | Explicit capability ID activation |
| `status` | Minimum status filter |
| `confidence` | Minimum confidence filter |

### 7.4 Resolution priority

```
capability → agent → competency topic → skill → workflow → standard
```

### 7.5 Exclusions

| Condition | Default behavior |
|-----------|------------------|
| Research artifacts | Exclude |
| `lifecycle: created` | Exclude |
| `status: deprecated` | Exclude (unless migration mode) |
| `status: draft` | Exclude |
| `confidence: Unknown` | Exclude from stable compiles |

### 7.6 Interface

See `runtime/router/interfaces.ts`.

---

## 8. Compilation

### 8.1 Responsibility

Transform resolved AST subgraph into compiler-target-specific output.

### 8.2 Input / output

```
Input:  ResolvedGraph + CompilerTargetId + CompileConfig
Output: CompilationResult { artifacts[], metadata }
```

### 8.3 Compiler contract

Each compiler target MUST implement:

```typescript
interface CompilerTarget {
  readonly id: CompilerTargetId;
  readonly eklAbstractTarget: string;
  readonly supportedFeatures: string[];

  compile(graph: ResolvedGraph, config: CompileConfig): Promise<CompilationResult>;
  validateConfig(config: CompileConfig): ValidationResult;
}
```

### 8.4 Compilation rules

- Compilers MUST consume canonical AST — not raw Markdown
- Compilers MUST NOT modify canonical source in the repository
- Compilers MUST preserve `classification` and `confidence` in output metadata
- Compilers MUST preserve evidence citations in output
- Compilers SHOULD emit deterministic output for identical input

### 8.5 Registered targets

See [domain-model.md §3.4](domain-model.md) for the target registry. Interface definitions in `runtime/compiler/interfaces.ts`.

### 8.6 Interface

See `runtime/compiler/interfaces.ts`.

---

## 9. Caching

### 9.1 Responsibility

Reduce redundant parsing, validation, and resolution. **Not implemented in Sprint 2** — interfaces only.

### 9.2 Cache layers

| Layer | Key | Invalidation |
|-------|-----|--------------|
| **Parse cache** | `path + mtime` | File change |
| **Validation cache** | `id + version + schema_hash` | Schema or artifact change |
| **Resolution cache** | `capability_set + config_hash` | Any member artifact change |
| **Compilation cache** | `graph_hash + target + config_hash` | Graph or config change |

### 9.3 Invariants

- Cache MUST be transparent — cache miss MUST produce identical results to no-cache
- Cache MUST NOT serve stale data after artifact modification
- Cache is MAY — implementations MAY operate without cache

### 9.4 Interface

See `runtime/cache/interfaces.ts`.

---

## 10. Indexing

### 10.1 Responsibility

Enable fast lookup without full repository scan.

### 10.2 Index types

| Index | Key → Value | Purpose |
|-------|---------------|---------|
| **ID index** | `artifact_id → path` | Primary lookup |
| **Type index** | `artifact_type → [ids]` | List capabilities, skills, etc. |
| **Provides index** | `provides_token → [ids]` | Capability Matrix queries |
| **Owner index** | `owner → [ids]` | Ownership queries |
| **Tag index** | `tag → [ids]` | Routing by tag |
| **Trigger index** | `keyword → [capability_ids]` | Context routing |

### 10.3 Build strategy

- Index built once at INIT from filesystem metadata
- Index updated incrementally on file change (future)
- Index MUST NOT require parsing artifact bodies

### 10.4 Semantic search index (future)

The `engineeringos.search` tool MAY use a vector index over artifact bodies. This is an optimization layer — keyword search MUST work without it.

---

## 11. Optimization

### 11.1 Responsibility

Reduce compilation output size and improve relevance. Optional per [spec/specification.md §5.1](../../spec/specification.md).

### 11.2 Strategies

| Strategy | Description |
|----------|-------------|
| **Deduplication** | Remove duplicate content across resolved nodes |
| **Pruning** | Remove nodes below confidence threshold |
| **Summarization** | Compress body content for token-limited targets |
| **Ordering** | Optimize topological order for target consumption |

### 11.3 Invariants

- Optimization MUST NOT run before validation
- Optimization MUST NOT alter contract metadata
- Optimization is SHOULD — implementations MAY skip

---

## 12. API layer

### 12.1 Responsibility

Map MCP tool invocations to EOR operations.

### 12.2 Tool routing table

| Tool | Primary stage(s) |
|------|------------------|
| `engineeringos.status` | Filesystem |
| `engineeringos.capabilities` | Index |
| `engineeringos.competencies` | Index |
| `engineeringos.skills` | Index + Router |
| `engineeringos.find` | Index |
| `engineeringos.review` | Router + Resolver + Validator |
| `engineeringos.compile` | Full pipeline + Compiler |
| `engineeringos.dependencies` | Resolver |
| `engineeringos.roadmap` | Filesystem (ROADMAP.md) |
| `engineeringos.progress` | Filesystem (PROGRESS.md) |
| `engineeringos.validate` | Validator (full or scoped) |
| `engineeringos.graph` | Resolver |
| `engineeringos.search` | Index + (future) semantic |
| `engineeringos.adr` | Index (type filter) |
| `engineeringos.pack` | Index + Parser (manifest) |
| `engineeringos.owner` | Index + Validator (ownership) |
| `engineeringos.evidence` | Parser + Resolver |
| `engineeringos.snapshot` | Full pipeline |
| `engineeringos.export` | Full pipeline + Compiler |

### 12.3 Interface

See `runtime/api/interfaces.ts` and [api.md](api.md).

---

## 13. Performance contracts

| Operation | Target (reference implementation) |
|-----------|-------------------------------------|
| Index build | < 2s for 1000 artifacts |
| Single artifact parse | < 50ms |
| Capability resolution (10 nodes) | < 200ms |
| Full validation (scoped) | < 500ms |
| Compile (single capability) | < 1s |

These are SHOULD targets for the reference implementation, not normative requirements.

---

## 14. Related documents

| Document | Purpose |
|----------|---------|
| [specification.md](specification.md) | MCP contract |
| [domain-model.md](domain-model.md) | Entity definitions |
| [api.md](api.md) | Tool schemas |
| [pipeline/README.md](../../pipeline/README.md) | Reference pipeline stages |
| [spec/semantics.md](../../spec/semantics.md) | EKL operational semantics |
