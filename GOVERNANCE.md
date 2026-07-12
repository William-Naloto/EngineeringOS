# EngineeringOS Governance

> **Version:** 0.1.1  
> **Status:** Active  
> **Last updated:** 2026-07-12

---

## Purpose

Defines how EngineeringOS is governed: roles, artifact lifecycle, versioning, releases, and architectural decisions.

---

## Governance Model

| Role | Responsibility |
|------|----------------|
| **Maintainers** | Architecture, ADR approval, release approval, standard changes |
| **Pack owners** | Domain pack content and pack-level versioning |
| **Contributors** | Author artifacts via pull request and capture pipeline |
| **Consumers** | Adopt releases, configure project overlays |

**Classification:** Recommendation

---

## Artifact Lifecycle

Every artifact progresses through:

```
draft → experimental → stable → deprecated
```

| Status | Loadable by default? | Compiler output? |
|--------|---------------------|------------------|
| `draft` | No | No |
| `experimental` | No (opt-in) | Yes (with flag) |
| `stable` | Yes | Yes |
| `deprecated` | No | Yes (with migration notice) |

Field name is `status` (renamed from `maturity` in v0.1.1).

### Promotion criteria

| Transition | Requirement |
|------------|-------------|
| draft → experimental | Knowledge Contract complete; contract schema valid |
| experimental → stable | Validation passed; maintainer review; `reviewed` date set |
| stable → deprecated | Replacement identified; one minor version notice |

### Validation gate

All promotions beyond `draft` require passing [validation/](validation/) checklists.

---

## Versioning Policy

Three-level versioning. See [ADR 0003](adr/0003-versioning-strategy.md).

| Level | Scheme | Example |
|-------|--------|---------|
| OS release | SemVer | `v0.1.1` |
| Artifact | SemVer in contract | `skill.fabric.semantic-model v1.0.0` |
| Pack | SemVer in manifest | `pack.fabric v2.1.0` |

---

## Release Strategy

| Release | Cadence (target) | Contents |
|---------|------------------|----------|
| Patch (v0.x.y) | As needed | Fixes, clarifications |
| Minor (v0.x) | Monthly | New modules, compiler updates |
| Major (v1.0+) | Quarterly | Breaking contract changes with migration |

### Release checklist

1. All `stable` artifacts pass validation
2. Indexes and Capability Matrix updated
3. `versions/engineeringos-vX.Y.Z.lock` generated
4. `PROGRESS.md` updated
5. Compilers tested against release (when active)

---

## Architectural Decisions

All structural decisions are recorded as ADRs in [adr/](adr/):

| ADR | Decision | Status |
|-----|----------|--------|
| [0001](adr/0001-repository-architecture.md) | Platform folder architecture | Accepted |
| [0002](adr/0002-knowledge-pack-format.md) | Self-contained packs | Accepted |
| [0003](adr/0003-versioning-strategy.md) | Three-level SemVer | Accepted |
| [0004](adr/0004-knowledge-contract.md) | Universal artifact contract | Accepted |
| [0005](adr/0005-agents-as-personas.md) | Agents as personas | Accepted |
| [0006](adr/0006-standards-vs-skills-separation.md) | Standards vs skills | Accepted |
| [0007](adr/0007-compilation-model.md) | Compilers as source of truth | Accepted |
| [0008](adr/0008-research-and-capture-pipeline.md) | Research + capture | Accepted |

New structural changes require a new ADR before implementation.

---

## Amendment to ENGINEERING_PHILOSOPHY.md

Changes to [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) require maintainer approval and an ADR.

---

## Classification Legend

| Label | Meaning |
|-------|---------|
| **Verified fact** | Observable or documented truth |
| **Best practice** | Widely accepted with strong evidence |
| **Recommendation** | EngineeringOS design choice |
| **Experimental idea** | Proposed, not validated |

Contract field values use PascalCase: `Fact`, `BestPractice`, `Recommendation`, `Experimental`.
