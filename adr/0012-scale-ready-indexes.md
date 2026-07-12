# ADR 0012: Scale-Ready Indexes and Generated Views

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

Stress test at 500 skills, 100 workflows, 80 packs, 40 agents, 100+ capabilities: manual Markdown index tables at repo root will not scale. CAPABILITY_MATRIX manual updates will drift.

## Decision

### 1. Machine-readable index as source of truth

Introduce `schemas/index.schema.yaml` and generated `indexes/artifacts.json` (planned v0.2) built by CI from all Knowledge Contract frontmatter.

### 2. Markdown indexes become views

`SKILLS_INDEX.md`, `CAPABILITIES_INDEX.md`, etc. are **generated** from `indexes/artifacts.json`, not hand-edited at scale.

Until generator exists (v0.2), manual indexes allowed with warning in RC1.

### 3. Capability Matrix is generated

`CAPABILITY_MATRIX.md` generated from `provides` tokens + `status` fields. Manual edits only during RC1.

### 4. Skill graph auto-generated

`docs/skill-graph.md` (or `indexes/skill-graph.json`) generated from `dependencies` + `orchestrates` fields.

### 5. Domain subdirectories at scale

| Directory | Threshold for subdirs |
|-----------|----------------------|
| `capabilities/` | > 50 files |
| `agents/` | > 30 files |
| `packs/` | Always one dir per pack |

### 6. Compiler registry

`compilers/manifest.yaml` registers all compiler targets (planned when count > 5).

### 7. Validation sampling

At > 200 stable skills, full regression on every change is impractical. Adopt **tiered validation** (planned v0.5):

- Tier 1: Contract compliance (all artifacts)
- Tier 2: Test prompts (changed artifacts + dependents)
- Tier 3: Full regression (release only)

## Consequences

- **Positive:** Structure survives 1000+ artifacts; indexes stay accurate; review queue automatable
- **Negative:** Requires index generator tooling in v0.2
- **Blocking for v0.1.1 tag:** Generator not required; ADR documents intent; RC1 accepts manual indexes temporarily

## References

- [docs/architectural-stress-test.md](../docs/architectural-stress-test.md)
- [releases/v0.1.1-RC1.md](../releases/v0.1.1-RC1.md)
