# Knowledge Contract

> **Version:** 0.1.1-RC1  
> **Status:** Release candidate — subject to stress test  
> **Last updated:** 2026-07-12

Every artifact in EngineeringOS **must** implement this contract. The contract enables any AI agent to parse any document without ambiguity.

**Classification:** Recommendation (architectural constraint)

---

## Terminology

| Term | Meaning | Example |
|------|---------|---------|
| **Capability artifact** | Orchestration recipe in `capabilities/` | `capability.fabric.monitoring` |
| **Provides token** | Atomic flag declared in contract `provides` | `semantic-model-design` |
| **Capability Matrix** | Generated dashboard of coverage | [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) |

Do not confuse capability artifacts with provides tokens. See [ADR 0009](adr/0009-capabilities-as-orchestration.md).

---

## Contract Fields

```yaml
---
# Identity (required)
id: capability.fabric.monitoring     # Globally unique, dot-notation
version: "1.0.0"
status: draft                          # draft | experimental | stable | deprecated
lifecycle: created                     # created | validated | published | maintained | deprecated
owner: Tito EngineeringOS
classification: BestPractice           # Fact | BestPractice | Recommendation | Experimental
confidence: Medium                     # High | Medium | Low | Unknown

# Relationships (required — empty arrays if none)
dependencies: []                       # Artifact IDs (standards, skills, agents)
orchestrates:                          # Capability artifacts only
  skills: []
  workflows: []
  agents: []
provides: []                            # Provides tokens (for Capability Matrix)
requires: []                            # External tools, platforms, prerequisites
references: []                          # External source URLs

# Provenance (required)
updated: 2026-07-12
reviewed: null
---
```

Non-capability artifacts omit `orchestrates`. Capability artifacts omit redundant skill lists outside `orchestrates`.

---

## Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | `type.domain.name` dot-notation |
| `version` | Yes | SemVer for this artifact |
| `status` | Yes | Loadability gate — see [GOVERNANCE.md](GOVERNANCE.md) |
| `lifecycle` | Yes | Longitudinal stage — see [ADR 0011](adr/0011-artifact-lifecycle.md) |
| `owner` | Yes | Accountable team or individual — see [OWNERS.md](OWNERS.md) |
| `classification` | Yes | `Fact` · `BestPractice` · `Recommendation` · `Experimental` |
| `confidence` | Yes | `High` · `Medium` · `Low` · `Unknown` — see [ADR 0010](adr/0010-evidence-and-confidence.md) |
| `dependencies` | Yes | Other artifact IDs required for context |
| `orchestrates` | Capability only | Skills, workflows, agents this recipe composes |
| `provides` | Yes | Provides tokens for Capability Matrix |
| `requires` | Yes | External prerequisites |
| `references` | Yes | External authoritative URLs |
| `updated` | Yes | ISO 8601 last content change |
| `reviewed` | Yes | ISO 8601 last human review, or `null` |
| `replaces` | No | Superseded artifact ID |
| `tags` | No | Controlled vocabulary |
| `triggers` | No | Routing context signals |

---

## Status vs Lifecycle

| Dimension | Field | Purpose |
|-----------|-------|---------|
| **Loadability** | `status` | Can agents load this? (`draft` → `stable`) |
| **Provenance** | `lifecycle` | Where in the knowledge pipeline? (`created` → `maintained`) |

They evolve independently. A `stable` artifact can be `lifecycle: maintained`. See ADR 0011.

---

## ID Convention

| Type | Example ID | Location |
|------|-----------|----------|
| `capability` | `capability.fabric.monitoring` | `capabilities/<domain>/` |
| `skill` | `skill.fabric.semantic-model` | `packs/<pack>/skills/` |
| `workflow` | `workflow.engineering.release` | `packs/<pack>/workflows/` |
| `standard` | `standard.git.commit-messages` | `standards/<domain>/` |
| `agent` | `agent.architect` | `agents/` |
| `pack` | `pack.fabric` | `packs/fabric/` |
| `template` | `template.pr-description` | `templates/` |

---

## Dependency Injection Model

Routing resolves **top-down**:

```
Capability (recipe — what to accomplish)
    ↓ orchestrates
Agent (persona — who acts)
    ↓ applies
Skill (brick — how to do one thing)
    ↓ sequenced by
Workflow (multi-step process)
```

The router loads **capabilities first**, then resolves orchestrated agents, skills, and workflows. This reduces routing complexity at scale.

**Classification:** Recommendation — see ADR 0009

---

## Evidence Section (required in body)

Every artifact body must include an **Evidence** section after the main content:

```markdown
## Evidence

| Source | Type | Confidence contribution |
|--------|------|----------------------|
| [Microsoft Learn](https://learn.microsoft.com/...) | Official documentation | High |
| [ADR 0006](adr/0006-standards-vs-skills-separation.md) | Internal decision | High |
| Internal project experience (Project X, 2025-Q4) | Internal experience | Medium |
| Industry practice (widely adopted pattern) | Industry practice | Medium |
```

### Evidence types

| Type | Description |
|------|-------------|
| `Official documentation` | Vendor or standards body docs |
| `RFC` | Request for Comments / formal spec |
| `Internal experience` | Validated project outcomes |
| `Industry practice` | Widely adopted, not formally specified |
| `Benchmark` | Measured performance or quality data |
| `Internal decision` | ADR or governance document |

Agents must cite evidence when making recommendations:

> *This recommendation is based on Microsoft Learn and internal experience (Medium confidence).*

Not: *I think…*

**Classification:** Recommendation — see ADR 0010

---

## Confidence Rules

| Level | When to use |
|-------|-------------|
| `High` | Multiple official sources or ADRs; validated in production |
| `Medium` | Industry practice + partial validation |
| `Low` | Single source or limited validation |
| `Unknown` | New artifact; evidence not yet collected |

`confidence: Unknown` blocks promotion to `status: stable`.

---

## Lifecycle Stages

```
created → validated → published → maintained → deprecated
```

| Stage | Meaning |
|-------|---------|
| `created` | Authored; contract complete |
| `validated` | Passed validation checklists and test prompts |
| `published` | `status: experimental` or `stable`; available to consumers |
| `maintained` | Actively reviewed and updated |
| `deprecated` | Superseded; retained for traceability |

---

## Artifact Body Structure

### Capability

```markdown
# Capability: <Title>

## Purpose
What this capability accomplishes end-to-end.

## When to use
Trigger conditions.

## Orchestration
Which agents, skills, and workflows are composed.

## Steps
High-level recipe (details delegated to skills/workflows).

## Exit criteria
How to know the capability is complete.

## Evidence
(table)
```

### Skill / Standard / Agent

Standard structures from [CONTRIBUTING.md](CONTRIBUTING.md) plus mandatory **Evidence** section.

---

## Dependency Graph

```
research/ (unvalidated)
    ↓ capture pipeline
standards/ (stable foundation)
    ↓
packs/<pack>/skills/ (domain bricks)
    ↓ orchestrated by
capabilities/ (complete LEGO sets)
    ↓ applied through
agents/ (persona lens)
    ↓ sequenced by
workflows/
```

---

## Schema

[schemas/knowledge-contract.schema.yaml](schemas/knowledge-contract.schema.yaml)

---

## Migration (v0.1.1 → RC1)

| Added | Purpose |
|-------|---------|
| `lifecycle` | Longitudinal provenance |
| `confidence` | Anti-hallucination propagation |
| `orchestrates` | Capability composition |
| `capability` type | Routing unit |
| Evidence section | Traceable recommendations |
