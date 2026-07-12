# Research

> **Status:** Placeholder (v0.1.1)  
> **Classification:** Recommendation

Raw, **unvalidated** research notes. This is input to the capture pipeline — never loaded by agents in production.

## Purpose

```
research/ (raw notes)
    ↓ capture/review.md
    ↓ capture/extract.md
packs/ or standards/ (validated knowledge)
```

Research is git-tracked but **excluded from routing, compilation, and agent loading**.

## Organization

```
research/
├── microsoft/
│   ├── fabric/
│   └── powerbi/
├── azure/
├── databricks/
└── newrelic/
```

## Rules

| Rule | Rationale |
|------|-----------|
| No Knowledge Contract required | Research is pre-contract |
| No `status: stable` | Research is never production-ready |
| Classify uncertainty explicitly | Use inline labels: fact, best practice, assumption |
| Link to sources | Every claim should reference a URL or document |
| Date your notes | Include date in filename or header |

## Promotion path

Research becomes knowledge only through the [capture pipeline](../capture/):

1. `capture/learn.md` — record observations
2. `capture/review.md` — human validation
3. `capture/extract.md` — distill into contract-compliant artifacts
4. `capture/publish.md` — promote to `packs/` or `standards/`

See [ADR 0008](../adr/0008-research-and-capture-pipeline.md).
