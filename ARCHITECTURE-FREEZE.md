# Architecture Freeze

> **Effective:** 2026-07-12  
> **Version:** v0.1.1  
> **Decision:** Approved with comments — Principal Engineer architecture review

---

## Status: FROZEN

The EngineeringOS platform architecture is **frozen** as of v0.1.1.

From this point forward:

- **No folder restructuring**
- **No new platform abstractions** without Principal Architect escalation + ADR
- **Incremental ADRs only** for contract changes
- **All effort goes to competencies, capabilities, and validated knowledge**

---

## Approved with Comments

| Comment | Resolution |
|---------|------------|
| Index generator needed at scale | ADR 0012 — build during Sprint 1 if needed, not before |
| Tiered validation | ADR 0012 — implement when competencies exist |
| `/capture` command | ADR 0013 — after Sprint 1 proves value |

---

## Knowledge Evolution

When and how EngineeringOS changes: [ADR 0014](adr/0014-knowledge-evolution-policy.md)

**Not while developing. After project completion with evidence.**

---

## What Changes Now

| Layer | Status |
|-------|--------|
| Platform (`agents/`, `routing/`, `compilers/`, `schemas/`, …) | Frozen |
| Competencies (`competencies/`) | **Active development** |
| Capabilities (`capabilities/`) | **Active development** |
| Packs (`packs/`) | Active per sprint needs |
| Standards (`standards/`) | Absorbed into competencies |

---

## Sign-Off

| Role | Decision | Date |
|------|----------|------|
| Principal Architect | Approved with comments | 2026-07-12 |
| Principal Engineer (review) | Architecture mature enough — build value | 2026-07-12 |

See [releases/v0.1.1-RC1.md](releases/v0.1.1-RC1.md).
