# Architectural Stress Test

> **Version:** 0.1.1-RC1  
> **Date:** 2026-07-12  
> **Scenario:** EngineeringOS after 5 years — 1,000+ artifacts, 100 contributors, enterprise adoption, 20 compilers  
> **Classification:** Recommendation

This document is the RC1 architectural stress test. It identifies structural weaknesses, scaling bottlenecks, governance gaps, and migration risks. **No new features** — only resilience and maintainability.

---

## Executive Summary

| Verdict | Detail |
|---------|--------|
| **Overall** | Architecture is **sound for 5+ years** with 6 documented mitigations |
| **Blockers for v0.1.1 tag** | 0 critical — 2 medium items addressed in RC1 |
| **Required before v0.2** | Index generator (ADR 0012) |
| **Required before v0.5** | Tiered validation, compiler registry, review automation |

**Recommendation:** Proceed to v0.1.1 tag after RC1 checklist passes. Address medium items via ADRs 0009–0013 (done in RC1).

---

## Stress Scenario Parameters

| Dimension | Scale |
|-----------|-------|
| Skills | 500 |
| Workflows | 100 |
| Knowledge packs | 80 |
| Agents | 40 |
| Capabilities | 100+ |
| Compilers | 20 |
| Contributors | 100 |
| Total artifacts | 1,000+ |

---

## Findings (Prioritized)

### P0 — Critical (would break at scale)

_None after RC1 changes._

Capability routing layer (ADR 0009) resolves the primary P0 risk identified in initial analysis: skill-level routing at 500+ skills.

---

### P1 — High (significant pain without mitigation)

#### P1-1: Manual indexes will not scale

**Problem:** `SKILLS_INDEX.md`, `CAPABILITIES_INDEX.md` hand-edited at 1,000 artifacts → guaranteed drift.

**Mitigation:** ADR 0012 — generated `indexes/artifacts.json` + CI-built Markdown views. **Required in v0.2.**

**RC1 status:** Documented; manual indexes acceptable until v0.2.

---

#### P1-2: Capability Matrix manual maintenance

**Problem:** 100+ provides tokens across 80 packs — manual matrix updates fail.

**Mitigation:** Generate from contract frontmatter. ADR 0012.

**RC1 status:** Documented; manual matrix acceptable until v0.2.

---

#### P1-3: Cross-pack dependency complexity

**Problem:** 80 packs with inter-pack `dependencies` → DAG complexity, circular dep risk.

**Mitigation:**
- Schema validation forbids cycles (v0.2)
- Packs depend on `standards/` and `capabilities/`, not other packs' skills directly
- Pack-to-pack deps only via `pack.*` manifest references

**RC1 status:** Documented in KNOWLEDGE_CONTRACT dependency rules. Enforced in v0.2 schema.

---

### P2 — Medium (manageable with process)

#### P2-1: Terminology collision — "capability"

**Problem:** "Capability artifact" vs "provides token" vs "Capability Matrix" — confusing.

**Mitigation:** Terminology table in KNOWLEDGE_CONTRACT.md (RC1). Use "capability artifact" vs "provides token" consistently.

**RC1 status:** ✅ Fixed.

---

#### P2-2: Evidence burden at 500 skills

**Problem:** Evidence tables for every skill is heavy.

**Mitigation:**
- `confidence: Unknown` allowed at draft
- Research pipeline pre-populates evidence
- `/capture` command proposes evidence (ADR 0013, v0.5)

**RC1 status:** ✅ Model defined.

---

#### P2-3: Validation regression time

**Problem:** 500 skills × regression prompts = CI timeout.

**Mitigation:** Tiered validation (ADR 0012) — full regression on release only.

**RC1 status:** Documented; deferred to v0.5.

---

#### P2-4: 20 compilers without registry

**Problem:** Ad-hoc compiler directories become unmaintainable.

**Mitigation:** `compilers/manifest.yaml` registry (planned v0.5).

**RC1 status:** Documented in compilers/README.md.

---

#### P2-5: Research directory growth

**Problem:** `research/` unbounded growth.

**Mitigation:**
- Research never loaded in production (routing excludes)
- Archive policy: move validated research to pack `references/` after publish
- Git LFS for large attachments (document in v0.3)

**RC1 status:** Documented in research/README.md.

---

#### P2-6: Ownership ambiguity at 100 contributors

**Problem:** `owner` field without registry → orphaned artifacts.

**Mitigation:** [OWNERS.md](../OWNERS.md) registry + required owner for `status: stable`.

**RC1 status:** ✅ OWNERS.md added.

---

### P3 — Low (monitor)

| ID | Issue | Mitigation |
|----|-------|------------|
| P3-1 | Monorepo vs pack extraction | ADR 0002 self-contained packs enable future git subtree publish |
| P3-2 | 40 agents — selection ambiguity | Routing priority: capability > agent > skill |
| P3-3 | Classification inconsistency in prose | Lint for classification labels in CI (v0.5) |
| P3-4 | Review staleness | `reviewed` date + 12-month re-review flag (ADR 0011) |
| P3-5 | Git clone size at 80 packs | Sparse checkout / pack-only publish (v2.0) |

---

## Scalability Questionnaire

| Question | 500 skills / 80 packs / 40 agents / 20 compilers | Answer |
|----------|--------------------------------------------------|--------|
| Will folder structure work? | Yes — packs isolate domains; capabilities route | ✅ |
| Will routing work? | Yes — capability-first routing (ADR 0009) | ✅ |
| Will indexes work? | Not manually — generated indexes required (ADR 0012) | 🚧 v0.2 |
| Will contracts parse uniformly? | Yes — Knowledge Contract | ✅ |
| Will compilers scale? | Yes with registry (v0.5) | 🚧 |
| Will validation scale? | Yes with tiered model (v0.5) | 🚧 |
| Will governance scale? | Yes — ADRs, OWNERS, lifecycle | ✅ |
| Can packs publish independently? | Yes — self-contained (ADR 0002) | ✅ |

**Overall:** Immediate yes for structure and governance. Index generation required before content scale (v0.2).

---

## Naming Consistency Audit

| Area | Issue | Resolution |
|------|-------|------------|
| ID format | Slash vs dot | Dot notation canonical (`skill.fabric.name`) |
| Status vs lifecycle | Overlap | Separated — ADR 0011 |
| Classification | Case | PascalCase in contract: `BestPractice` |
| Capability naming | Ambiguity | Terminology table in contract |
| Pack IDs | `pack.fabric` vs folder `packs/fabric/` | Documented — ID uses dot, folder uses slash |

No blocking inconsistencies.

---

## Migration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| v0.1 → v0.1.1 ID format change | N/A (no content) | None | No migration needed |
| Manual → generated indexes | High | Medium | v0.2 generator; one-time migration script |
| Capability layer retrofitted | Medium | Low | Placeholders in RC1; content not started |
| Evidence required for stable | High | Positive | Blocks low-quality promotion |

---

## Proposed ADRs from Stress Test

| ADR | Title | Status |
|-----|-------|--------|
| 0009 | Capabilities as orchestration | ✅ Accepted |
| 0010 | Evidence and confidence | ✅ Accepted |
| 0011 | Artifact lifecycle | ✅ Accepted |
| 0012 | Scale-ready indexes | ✅ Accepted |
| 0013 | Self-improving capture | Proposed (experimental) |

---

## Verdict

**Architecture is resilient enough to tag v0.1.1** after RC1 checklist passes.

The 0.3 gap is closed by:
1. Capability routing layer
2. Evidence + confidence model
3. Lifecycle tracking
4. Scale mitigations documented with ADR 0012
5. OWNERS registry
6. Stress test transparency

**Do not tag until RC1 checklist is explicitly signed off.**

---

## Next Actions

| Action | Owner | Target |
|--------|-------|--------|
| Complete RC1 checklist | Maintainers | Before tag |
| Build index generator | v0.2 | Core Runtime release |
| Implement tiered validation | v0.5 | Compiler release |
| Prototype `/capture` | v0.5+ | ADR 0013 |
