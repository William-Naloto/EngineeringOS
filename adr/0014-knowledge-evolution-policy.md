# ADR 0014: Knowledge Evolution Policy

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** BestPractice

## Context

Without an explicit evolution policy, EngineeringOS becomes noisy — updated mid-project, polluted with unvalidated lessons, and indistinguishable from draft notes. Teams that lack this policy often spend months perfecting framework structure while producing zero useful competencies.

Architecture is now frozen (RC1 approved). From this point forward, **knowledge evolves incrementally** — never through restructuring.

## Decision

### When EngineeringOS IS updated

```
Project completed (or major milestone reached)
    ↓
Lessons extracted (capture/learn)
    ↓
Peer review (capture/review)
    ↓
Evidence collected (capture/review + Evidence section)
    ↓
EngineeringOS PR (capture/extract → capture/publish)
    ↓
Maintainer review
    ↓
Merge
```

### When EngineeringOS is NOT updated

| Situation | Action |
|-----------|--------|
| **While actively developing a feature** | Do **not** update EngineeringOS |
| **Mid-sprint discoveries** | Capture in project notes or `research/` — process after delivery |
| **Unvalidated opinions** | Do **not** merge |
| **"I think this might be better"** | Research first; PR after evidence |
| **Framework restructuring** | **Forbidden** without Principal Architect escalation (architecture is frozen) |

### Evolution triggers (valid reasons to open a PR)

| Trigger | Example |
|---------|---------|
| Project completed with validated lessons | Fabric monitoring pattern proven in production |
| Official documentation changed | Microsoft Learn updated semantic model guidance |
| Repeated incident with root cause | Postmortem produced actionable standard |
| Capability gap identified | "Review PR" missing security checklist item |
| Evidence upgraded | `confidence: Low` → `High` after benchmark |

### Evolution anti-patterns (reject these PRs)

| Anti-pattern | Why |
|--------------|-----|
| Update during active development | Noise; unvalidated |
| Copy-paste from ChatGPT without evidence | Hallucination propagation |
| Restructure folders | Architecture frozen |
| Add infrastructure without competency value | Framework trap |
| Bulk import without review | Quality collapse |

## Governance

| Change type | Approver | ADR required? |
|-------------|----------|---------------|
| New competency topic | Domain owner + maintainer | No |
| New capability | Maintainer | No |
| Standard change | Maintainer | No |
| Contract field change | Principal Architect | Yes |
| Folder structure change | Principal Architect | Yes — **discouraged** |
| Architecture unfreeze | Principal Architect + ADR | Yes |

## Cadence

| Rhythm | Activity |
|--------|----------|
| **Per project** | Extract lessons after completion (not during) |
| **Per sprint** | Ship one production-ready capability or competency increment |
| **Quarterly** | Review stale artifacts (`reviewed` > 12 months) |
| **Annual** | Capability Matrix and competency coverage audit |

## Consequences

- **Positive:** EngineeringOS stays signal, not noise; validated knowledge only; architecture stability
- **Negative:** Slower ingestion than "update while coding"
- **Accepted trade-off:** Quality and trust over velocity of raw content

## References

- [capture/publish.md](../capture/publish.md)
- [ENGINEERING_PHILOSOPHY.md](../ENGINEERING_PHILOSOPHY.md) — "Capture knowledge only after it has been validated"
- [releases/v0.1.1-RC1.md](../releases/v0.1.1-RC1.md) — architecture freeze
