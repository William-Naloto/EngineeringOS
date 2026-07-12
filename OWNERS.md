# Ownership Registry

> **Version:** 0.1.1-RC1  
> **Last updated:** 2026-07-12

Every `status: stable` artifact must have an `owner` listed here. Orphaned artifacts are flagged for reassignment during quarterly review.

**Classification:** Recommendation

---

## Maintainers

| Owner ID | Scope | Contact |
|----------|-------|---------|
| `EngineeringOS Maintainers` | Platform architecture, standards, governance, ADRs | _TBD_ |

---

## Domain Owners (planned)

| Owner ID | Scope | Status |
|----------|-------|--------|
| `Tito EngineeringOS` | Fabric, Power BI packs | Planned |
| _TBD_ | Python pack | Planned |
| _TBD_ | Platform / SRE capabilities | Planned |

---

## Ownership Rules

| Rule | Rationale |
|------|-----------|
| Every `stable` artifact has `owner` in contract **and** entry here | Accountability |
| Pack owner owns all artifacts in their pack | Clear escalation |
| Standards owned by `EngineeringOS Maintainers` | Cross-domain stability |
| Agent personas owned by `EngineeringOS Maintainers` until delegated | Consistency |
| Owner change requires PR updating contract + this file | Traceability |

---

## Orphan Policy

Artifacts with `owner` not in this registry for > 90 days are:

1. Flagged in PROGRESS.md
2. Reassigned by maintainer vote
3. Deprecated if no owner found within 30 days

---

## Adding an Owner

1. Add row to this file
2. Set `owner` field in all owned artifacts
3. Update [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) if applicable
