# ADR 0008: Research and Capture Pipeline

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

Most AI knowledge repos mix raw research with polished knowledge, making it impossible to distinguish validated content from unverified notes.

## Decision

Introduce two upstream systems:

### 1. Research (`research/`)

Raw, unvalidated notes organized by vendor/domain:

```
research/
  microsoft/
    fabric/
    powerbi/
  azure/
  databricks/
```

Research is **never loaded by agents in production**. It is input to the capture pipeline.

### 2. Capture pipeline (`capture/`)

```
learn.md    → Observe and record raw knowledge from projects
review.md   → Human validation and classification
extract.md  → Distill into contract-compliant artifacts
publish.md  → Promote to standards/ or packs/ with validation
```

Flow:

```
Project experience → capture/learn → research/
research/ → capture/review → capture/extract → packs/ or standards/
packs/ → validation/ → status promotion
```

## Consequences

- **Positive:** Clear provenance; no unvalidated knowledge in production; projects improve the OS
- **Negative:** Pipeline overhead; research directory may grow large
- **Neutral:** Research is git-tracked but excluded from routing and compilation

## References

- [capture/learn.md](../capture/learn.md)
- [research/README.md](../research/README.md)
- [ENGINEERING_PHILOSOPHY.md](../ENGINEERING_PHILOSOPHY.md) — "Capture knowledge only after it has been validated"
