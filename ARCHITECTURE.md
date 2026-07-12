# EngineeringOS Architecture

> **Version:** 0.1.1-RC1  
> **Status:** Release candidate — see [releases/v0.1.1-RC1.md](releases/v0.1.1-RC1.md)  
> **Last updated:** 2026-07-12

This document defines the platform architecture of EngineeringOS: folder organization, the Knowledge Contract, dependency graph, compilation model, routing strategy, and project overlay.

**Classification:** Recommendation

---

## Design Goals

| Goal | How architecture supports it |
|------|------------------------------|
| **Modular** | Self-contained packs; atomic skills; composable agents |
| **Vendor-agnostic** | Canonical source in `standards/`, `packs/`, `agents/`; compilers generate IDE output |
| **Versioned** | Knowledge Contract SemVer per artifact; OS release locks |
| **Traceable** | Contract metadata, ADRs, capture pipeline, validation |
| **Extensible** | Add packs without restructuring; research → capture → publish |
| **AI-first** | Routing, Capability Matrix, selective loading |
| **Human-readable** | Markdown + YAML; universal Knowledge Contract |

---

## Repository Layout

```
EngineeringOS/
├── README.md
├── VISION.md
├── ENGINEERING_PHILOSOPHY.md      # Constitutional principles
├── KNOWLEDGE_CONTRACT.md          # Universal artifact contract
├── ARCHITECTURE.md                # This document
├── CAPABILITY_MATRIX.md           # Coverage dashboard
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── PROGRESS.md
├── QUICKSTART.md                  # 15-minute onboarding
├── CAPABILITIES_INDEX.md
├── OWNERS.md
├── SKILLS_INDEX.md
├── WORKFLOWS_INDEX.md
├── PACKS_INDEX.md
│
├── capabilities/                  # Orchestration recipes (router loads first)
├── agents/                        # Personas (who) — NOT skills
├── standards/                     # Stable conventions (rarely change)
├── packs/                         # Self-contained domain bundles
│   └── <pack-name>/
│       ├── manifest.yaml
│       ├── skills/
│       ├── workflows/
│       ├── templates/
│       ├── references/
│       ├── examples/
│       └── changelog/
├── research/                      # Raw, unvalidated notes
├── adr/                           # Architecture Decision Records
├── validation/                    # Checklists and test prompts
├── compilers/                     # Source → IDE transformation
├── adapters/                      # Runtime integration hooks
├── routing/                       # Selective loading rules
├── capture/                       # Dynamic learning pipeline
├── templates/                     # Shared templates
├── schemas/                       # Contract validation
├── versions/                      # Release lock files
├── project-template/              # Project overlay template
└── docs/                          # Extended documentation
```

**Classification:** Verified fact (v0.1.1 structure)

---

## Platform Layer Model

```
┌──────────────────────────────────────────────┐
│  Layer 6: Project Overlay (.engineeringos/)  │  Project-specific
├──────────────────────────────────────────────┤
│  Layer 5: Compilers + Adapters               │  IDE translation
├──────────────────────────────────────────────┤
│  Layer 4: Routing                            │  Selective loading
├──────────────────────────────────────────────┤
│  Layer 3: Agents (personas)                │  Who
├──────────────────────────────────────────────┤
│  Layer 2: Packs + Standards (knowledge)      │  What / How
├──────────────────────────────────────────────┤
│  Layer 1: Research + Capture (upstream)      │  Raw → Validated
└──────────────────────────────────────────────┘
```

| Layer | Contains | Must not contain |
|-------|----------|------------------|
| **Research** | Raw notes | Knowledge Contract, stable content |
| **Standards** | Cross-domain conventions | Domain-specific skills |
| **Packs** | Domain skills, workflows, templates | Global standards (reference by ID) |
| **Agents** | Persona definitions | Skill content (reference by ID) |
| **Routing** | Manifests, rules | Knowledge content |
| **Compilers** | Build-time transforms | Canonical knowledge copies |
| **Adapters** | Runtime hooks | Canonical knowledge copies |
| **Project overlay** | Local config, overrides | Global knowledge copies |

---

## Knowledge Contract

Every artifact implements the same [Knowledge Contract](KNOWLEDGE_CONTRACT.md):

```yaml
id: skill.fabric.semantic-model
version: "1.0.0"
status: stable
owner: Tito EngineeringOS
classification: BestPractice
dependencies: [standard.architecture.design-principles]
provides: [semantic-model-design]
requires: [powerbi]
references: [https://learn.microsoft.com/...]
updated: 2026-07-12
reviewed: 2026-07-12
```

Schema: `schemas/knowledge-contract.schema.yaml`

**Classification:** Recommendation (architectural constraint)

---

## Dependency Injection Model

```
Capability (recipe — what to accomplish)
    ↓ orchestrates
Agent (persona — who acts)
    ↓ applies
Skill (brick — how)
    ↓ sequenced by
Workflow (multi-step)
```

Router loads **capabilities first** (ADR 0009), then resolves orchestrated artifacts.

---

## Dependency Graph

```
research/ (unvalidated)
    ↓ capture pipeline
standards/ (stable foundation)
    ↓ dependencies
packs/<pack>/skills/ (domain bricks)
    ↓ orchestrated by
capabilities/ (complete recipes)
    ↓ through
agents/ (persona lens)
    ↓ sequenced by
workflows/

compilers/ → read all layers → IDE output
```

See [docs/skill-graph.md](docs/skill-graph.md).

### Rules

| Rule | Classification |
|------|---------------|
| Skills depend on standards, not vice versa | Recommendation |
| Packs declare all contained artifact IDs + versions | Recommendation |
| Agents reference artifacts, never embed content | Recommendation |
| Research has no downstream dependencies | Recommendation |
| Circular dependencies are forbidden | Recommendation |
| Compiled output never modifies canonical source | Recommendation |

---

## Self-Contained Packs

Each pack under `packs/<name>/` is independently versioned and publishable:

```
packs/fabric/
├── README.md
├── manifest.yaml       # Knowledge Contract + module inventory
├── skills/
├── workflows/
├── templates/
├── references/
├── examples/
└── changelog/
```

One day you publish **only** `pack.fabric`. Or only `pack.python`. The pack is the unit of distribution.

See [ADR 0002](adr/0002-knowledge-pack-format.md).

---

## Agents vs Skills

| | Agent (`agents/`) | Skill (`packs/<pack>/skills/`) |
|---|-------------------|-------------------------------|
| **Defines** | Who the AI acts as | How to do a task |
| **Content** | Tone, priorities, scope | Step-by-step instructions |
| **Velocity** | Rarely changes | Evolves rapidly |
| **ID** | `agent.architect` | `skill.fabric.semantic-model` |

Loading: routing matches task → load agent (who) + skills (how) → agent applies skills through persona lens.

See [ADR 0005](adr/0005-agents-as-personas.md).

---

## Standards vs Skills

| | Standards (`standards/`) | Skills (`packs/<pack>/skills/`) |
|---|---------------------------|--------------------------------|
| **Velocity** | Rarely change | Evolve rapidly |
| **Scope** | Cross-domain | Domain-specific |
| **Examples** | Git commits, naming, review | Fabric, Python, Spark |
| **Ownership** | OS maintainers | Pack owners |

See [ADR 0006](adr/0006-standards-vs-skills-separation.md).

---

## Compilation Model

EngineeringOS is the **single source of truth**. Compilers generate IDE-native output:

```
standards/ + packs/ + agents/
    ↓ compilers/cursor/
    .cursor/rules/*.mdc

standards/ + packs/ + agents/
    ↓ compilers/claude-code/
    CLAUDE.md

standards/ + packs/ + agents/
    ↓ compilers/copilot/
    .github/copilot-instructions.md
```

Compilers resolve dependencies, apply routing, transform format, and write output. They never modify source.

`adapters/` handles **runtime** integration (MCP, live routing) that compilers do not cover.

See [ADR 0007](adr/0007-compilation-model.md) and [compilers/README.md](compilers/README.md).

---

## Routing Strategy

Agents load **only relevant** modules:

```
Context signals (query, files, tags, overlay)
    ↓
routing/manifest.yaml
    ↓
Matched agents + skills + packs (capped per session)
    ↓
Compilers or direct load
    ↓
Agent context
```

Signals: `query`, `file_pattern`, `tag`, `pack`, `status` filter.

Default cap: 5 skills per session. See `routing/manifest.yaml`.

---

## Capability Matrix

Instead of "what skills do we have?", read [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md):

| Capability | Status |
|--------------|--------|
| Architecture | ❌ |
| Fabric | ❌ |
| Python | ❌ |

Status derives from `provides` tokens in artifact contracts.

---

## Research and Capture Pipeline

```
Project experience
    ↓ capture/learn.md
research/ (raw)
    ↓ capture/review.md
    ↓ capture/extract.md
packs/ or standards/ (draft)
    ↓ validation/
    ↓ capture/publish.md
status: stable
```

Research is **never** loaded by production agents.

See [ADR 0008](adr/0008-research-and-capture-pipeline.md).

---

## Validation

Every artifact must pass validation before promotion:

1. Contract schema compliance
2. Type-specific checklist
3. Test prompts
4. Regression prompts (if updating)
5. Human review (`reviewed` date set)

See [validation/](validation/).

---

## Project Overlay

Projects copy `project-template/.engineeringos/` to layer local context:

```yaml
# .engineeringos/manifest.yaml
engineeringos_version: "0.1.1"
activated_packs: [pack.fabric]
activated_agents: [agent.architect]
maturity_filter: stable
routing_hints:
  tags: [domain:platform]
overrides:
  - id: skill.fabric.semantic-model
    path: overrides/skill.fabric.semantic-model.override.md
```

Project overlay wins on routing conflicts.

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Artifact ID | `type.domain.name` (dot notation) | `skill.fabric.semantic-model` |
| Pack directory | kebab-case | `packs/fabric/` |
| Standard directory | kebab-case domain | `standards/git/` |
| Agent file | kebab-case | `agents/principal-data-engineer.md` |
| ADR | `NNNN-kebab-title.md` | `adr/0001-repository-architecture.md` |

---

## Scalability

| Challenge | Mitigation |
|-----------|-----------|
| Hundreds of skills | Self-contained packs; routing caps; Capability Matrix |
| IDE proliferation | Compilers per IDE; single source |
| Knowledge drift | Capture pipeline; validation; contract versioning |
| Dependency complexity | Explicit DAG; schema validation |
| Research volume | Separate tree; excluded from routing |

---

## ADR Index

| ADR | Decision |
|-----|----------|
| [0001](adr/0001-repository-architecture.md) | Platform folder architecture |
| [0002](adr/0002-knowledge-pack-format.md) | Self-contained packs |
| [0003](adr/0003-versioning-strategy.md) | Three-level SemVer |
| [0004](adr/0004-knowledge-contract.md) | Universal artifact contract |
| [0005](adr/0005-agents-as-personas.md) | Agents as personas |
| [0006](adr/0006-standards-vs-skills-separation.md) | Standards vs skills |
| [0007](adr/0007-compilation-model.md) | Compilers as source of truth |
| [0008](adr/0008-research-and-capture-pipeline.md) | Research + capture |
| [0009](adr/0009-capabilities-as-orchestration.md) | Capability-first routing |
| [0010](adr/0010-evidence-and-confidence.md) | Evidence + confidence |
| [0011](adr/0011-artifact-lifecycle.md) | Lifecycle stages |
| [0012](adr/0012-scale-ready-indexes.md) | Generated indexes at scale |
| [0013](adr/0013-self-improving-capture-command.md) | `/capture` command (proposed) |

Stress test: [docs/architectural-stress-test.md](docs/architectural-stress-test.md)

---

## Future (not in v0.1.1)

| Feature | Target | Classification |
|---------|--------|---------------|
| Compiler implementations | v0.5 | Recommendation |
| CI validation pipeline | v0.5 | Recommendation |
| CLI (`eos compile`, `eos validate`) | v1.0 | Experimental idea |
| Capability Matrix JSON export | v0.5 | Recommendation |
| Pack registry | v2.0 | Experimental idea |
