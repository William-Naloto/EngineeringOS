# EOR Domain Model

> **Version:** 0.1.0-draft  
> **Status:** Architecture — no implementation  
> **Companion:** [specification.md](specification.md) · [EKL contracts](../../spec/contracts.md)

This document describes how the **EngineeringOS Runtime (EOR)** models EngineeringOS knowledge. It is the runtime's view of EKL — not a duplicate of the normative specification, but the operational entity model that drives parsing, validation, routing, and compilation.

---

## 1. Overview

Every EKL artifact becomes a **node** in the canonical AST graph. Relationships declared in Knowledge Contracts become **edges**. Capabilities form **orchestration subgraphs**. Dependencies form **requirement subgraphs**. Together they compose the runtime representation.

```
                    ┌─────────────┐
                    │  Capability │
                    └──────┬──────┘
           orchestrates    │    dependencies
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │Competency│ │  Skill   │ │ Standard │
        └────┬─────┘ └──────────┘ └──────────┘
             │ topics
             ▼
        ┌──────────┐
        │  Topic   │
        └──────────┘
```

---

## 2. Core entities

### 2.1 Artifact

The base entity. Every compilable unit in EngineeringOS is an artifact.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Globally unique identifier (`type.domain.name`) |
| `type` | `ArtifactType` | Derived from ID prefix |
| `version` | `semver` | Artifact version |
| `path` | `string` | Repository-relative file path |
| `contract` | `ContractMetadata` | Parsed YAML frontmatter |
| `body` | `MarkdownPayload` | Markdown content (excluding frontmatter) |
| `evidence` | `EvidenceTable` | Parsed `## Evidence` section |
| `validation_state` | `ValidationState` | Runtime-computed validation result |

**Artifact types** (EKL v1):

| Prefix | Entity | Compilable |
|--------|--------|------------|
| `competency.` | Competency | Yes |
| `capability.` | Capability | Yes |
| `agent.` | Agent | Yes |
| `topic.` | Topic | Yes |
| `skill.` | Skill | Yes |
| `workflow.` | Workflow | Yes |
| `standard.` | Standard | Yes |
| `template.` | Template | Yes |
| `pack.` | Pack | Manifest only |
| `adr.` | ADR | Reference only (searchable, not compiled) |

Research artifacts in `research/` are excluded from the domain model at runtime unless explicitly requested in validation-only mode.

---

### 2.2 Capability

An orchestration recipe that declares **what to accomplish** and which artifacts to load.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | `capability.<domain>.<name>` |
| `orchestrates` | `OrchestrationRef` | Competencies, agents, skills, workflows |
| `provides` | `string[]` | Provides tokens for Capability Matrix |
| `triggers` | `string[]` | Routing context signals |
| `dependencies` | `string[]` | Required artifact IDs |

**Role in routing:** Capabilities are the **entry point** for scoped loading. The router MUST match capabilities before loading individual skills.

**Graph role:** Capability nodes are **roots** of orchestration subgraphs. Edges flow from capability → orchestrated artifacts.

Example: `capability.engineering.review-pr` orchestrates `competency.principal-software-architect` and `agent.reviewer`.

---

### 2.3 Competency

A professional role knowledge base. Competencies group related topics under a manifest.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | `competency.<role-name>` |
| `topics` | `string[]` | Topic artifact IDs (from manifest) |
| `enables_capabilities` | `string[]` | Reverse index: which capabilities reference this competency |
| `provides` | `string[]` | Provides tokens |

**Manifest:** Competencies MAY declare a `manifest.yaml` that lists topics. The resolver MUST expand manifests to include all referenced `topic.*` nodes.

**Graph role:** Competency → Topic edges. Capability → Competency edges via `orchestrates`.

---

### 2.4 Skill

An atomic unit of engineering knowledge — the smallest compilable "how to" brick.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | `skill.<domain>.<name>` |
| `pack` | `string` | Parent pack ID (if within a pack) |
| `dependencies` | `string[]` | Standards and other artifacts required |
| `provides` | `string[]` | Provides tokens |

**Graph role:** Skills are leaf or near-leaf nodes. They MUST NOT be loaded unless reached via capability orchestration or explicit request.

---

### 2.5 Workflow

A multi-step sequenced process.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | `workflow.<domain>.<name>` |
| `steps` | `WorkflowStep[]` | Ordered steps referencing skills or sub-workflows |
| `dependencies` | `string[]` | Required artifacts |

**Graph role:** Workflow nodes connect to skill nodes via step references.

---

### 2.6 Pack

A self-contained domain bundle. Packs are organizational containers, not full knowledge nodes.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | `pack.<name>` |
| `manifest` | `PackManifest` | Skills, workflows, templates inventory |
| `version` | `semver` | Pack version |
| `skills` | `string[]` | Skill IDs contained |
| `workflows` | `string[]` | Workflow IDs contained |

Packs do not have Evidence sections in the manifest itself but their contained artifacts do.

---

### 2.7 Evidence

Provenance and confidence backing for an artifact. Evidence is a required section in every artifact body.

| Property | Type | Description |
|----------|------|-------------|
| `source` | `string` | Citation, URL, or reference |
| `type` | `EvidenceType` | Classification of the source |
| `confidence_contribution` | `ConfidenceLevel` | How this source affects artifact confidence |

**Evidence types** (EKL v1):

| Type | Description |
|------|-------------|
| `Official documentation` | Vendor or standards body |
| `RFC` | Formal specification |
| `Internal experience` | Validated project outcome |
| `Industry practice` | Widely adopted pattern |
| `Benchmark` | Measured data |
| `Internal decision` | ADR or governance document |

**Evidence chain:** The `engineeringos.evidence` tool returns the full evidence chain for an artifact, including evidence from its dependencies (transitive provenance view).

---

## 3. Cross-cutting concepts

### 3.1 Lifecycle

Two independent dimensions govern artifact state:

#### Status (loadability)

```
draft → experimental → stable → deprecated
```

| Status | Default loadable? | Compiler behavior |
|--------|-------------------|-------------------|
| `draft` | No | Reject unless opt-in |
| `experimental` | Opt-in | Warn |
| `stable` | Yes | Compile |
| `deprecated` | Migration only | Warn + suggest `replaces` |

#### Lifecycle (provenance)

```
created → validated → published → maintained → deprecated
```

| Lifecycle | Meaning |
|-----------|---------|
| `created` | Initial authoring |
| `validated` | Passed validation pipeline |
| `published` | Available in a release |
| `maintained` | Actively reviewed |
| `deprecated` | Superseded |

See [ADR 0011](../../adr/0011-artifact-lifecycle.md).

---

### 3.2 Owner

Accountable team or individual for an artifact.

| Property | Type | Description |
|----------|------|-------------|
| `owner` | `string` | From contract `owner` field |
| `registry_entry` | `OwnerRegistryEntry` | Entry in [OWNERS.md](../../OWNERS.md) |

The `engineeringos.owner` tool resolves ownership for an artifact and its dependency subtree.

---

### 3.3 Dependencies

Directed edges between artifacts.

| Edge type | Source field | Semantics |
|-----------|--------------|-----------|
| `depends_on` | `dependencies` | Required context — transitive resolution |
| `orchestrates` | `orchestrates.*` | Composition — capability expands these |
| `replaces` | `replaces` | Succession — deprecated → successor |
| `topic_of` | competency manifest `topics` | Competency contains topic |

**Rules:**

- The dependency graph MUST be acyclic
- Resolvers MUST produce topological ordering
- Cycles MUST be rejected with `CYCLE_DETECTED`

---

### 3.4 Compiler Target

An abstract or concrete consumer of compiled EKL output.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `CompilerTargetId` | Target identifier |
| `ekl_abstract_target` | `string` | EKL vendor-neutral target class |
| `output_format` | `string` | Expected output format |
| `supported_features` | `string[]` | Feature flags |

**Registered targets:**

| Target ID | EKL abstract target | Product |
|-----------|---------------------|---------|
| `cursor` | `ai-context-rules` | Cursor |
| `claude` | `ai-context-instructions` | Claude Code |
| `copilot` | `ai-context-instructions` | GitHub Copilot |
| `openhands` | `ai-context-agents` | OpenHands |
| `gemini` | `ai-context-instructions` | Gemini CLI |
| `agents-md` | `ai-context-agents` | AGENTS.md |
| `obsidian` | `knowledge-vault` | Obsidian |
| `notebooklm` | `knowledge-vault` | NotebookLM |
| `confluence` | `wiki` | Confluence |
| `mkdocs` | `documentation-site` | MkDocs |
| `docusaurus` | `documentation-site` | Docusaurus |

Compiler targets are interfaces only at this stage. See `runtime/compiler/interfaces.ts`.

---

### 3.5 Validation State

Runtime-computed result of applying EKL validation rules to an artifact.

```typescript
interface ValidationState {
  valid: boolean;
  tier: 'contract' | 'dependency' | 'lifecycle' | 'evidence' | 'ownership' | 'version';
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  validated_at: string; // ISO 8601
}
```

| Tier | Checks |
|------|--------|
| **Schema** | JSON Schema compliance of contract |
| **Dependency** | Resolved references, no cycles, no orphans (warn) |
| **Lifecycle** | Status/lifecycle consistency |
| **Evidence** | `## Evidence` section present and well-formed |
| **Ownership** | Owner in registry (stable artifacts) |
| **Version** | SemVer compliance, `replaces` on deprecated |

---

## 4. Graph model

### 4.1 AST graph

The canonical runtime representation is a **directed acyclic graph** of `KnowledgeNode` instances.

```
ASTGraph {
  nodes: Map<ArtifactId, KnowledgeNode>
  edges: Edge[]
  metadata: {
    root_capability?: ArtifactId
    resolved_at: ISO8601
    node_count: number
    edge_count: number
  }
}
```

### 4.2 Edge types

```typescript
type EdgeType =
  | 'depends_on'
  | 'orchestrates_competency'
  | 'orchestrates_skill'
  | 'orchestrates_workflow'
  | 'orchestrates_agent'
  | 'topic_of'
  | 'replaces'
  | 'enables_capability';
```

### 4.3 Capability graph

A **capability graph** is the subgraph rooted at one or more capability nodes, including all orchestrated and dependent artifacts. The `engineeringos.graph` tool returns this view.

### 4.4 Dependency graph

A **dependency graph** is the transitive closure of `depends_on` edges from a given root. The `engineeringos.dependencies` tool returns this view.

---

## 5. Entity relationships summary

```
Pack
 └── contains → Skill, Workflow, Template

Competency
 └── topics → Topic
 └── enables ← Capability (reverse)

Capability
 └── orchestrates → Competency, Agent, Skill, Workflow
 └── depends_on → Standard, Skill, ...

Skill
 └── depends_on → Standard, Skill, ...

Workflow
 └── steps → Skill, Workflow

Artifact (all types)
 └── evidence → Evidence[]
 └── owner → Owner
 └── validation_state → ValidationState
 └── compiles_to → CompilerTarget (via Compiler)
```

---

## 6. Mapping to EKL specification

| Domain model entity | EKL spec reference |
|---------------------|-------------------|
| Artifact | [spec/specification.md §4](../../spec/specification.md) |
| Knowledge Node | [spec/contracts.md §1](../../spec/contracts.md) |
| Capability orchestration | [spec/contracts.md §2.2](../../spec/contracts.md) |
| Dependency resolution | [spec/semantics.md §1](../../spec/semantics.md) |
| Routing | [spec/semantics.md §2](../../spec/semantics.md) |
| Validation | [spec/semantics.md §3](../../spec/semantics.md) |
| Lifecycle | [spec/semantics.md §4](../../spec/semantics.md) |
| Compiler target | [spec/specification.md §5](../../spec/specification.md) |

---

## 7. Related documents

| Document | Purpose |
|----------|---------|
| [specification.md](specification.md) | MCP contract and architecture |
| [runtime.md](runtime.md) | How entities are processed |
| [api.md](api.md) | Tools that expose entities |
| [KNOWLEDGE_CONTRACT.md](../../KNOWLEDGE_CONTRACT.md) | Human-readable contract guide |
