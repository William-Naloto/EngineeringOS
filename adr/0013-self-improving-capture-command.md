# ADR 0013: Self-Improving Capture Command

> **Status:** Proposed  
> **Date:** 2026-07-12  
> **Classification:** Experimental

## Context

EngineeringOS should learn from every project, not only manual contributions. The capture pipeline exists as documentation; a `/capture` command would operationalize it.

## Decision (proposed — not in v0.1.1)

Introduce a `/capture` agent command:

```
/capture
    → What repository?
    → Analyze commits, PRs, documentation
    → Extract lessons (capture/learn)
    → Human review (capture/review)
    → Suggest artifacts (capture/extract)
    → Open PR against EngineeringOS (capture/publish)
```

### Prerequisites

- v0.2: Core Runtime standards exist as validation baseline
- v0.5: CLI with `eos capture` subcommand
- v1.0: Automated PR creation with evidence classification

## Consequences

- **Positive:** EngineeringOS literally improves from project work; reduces manual curation
- **Negative:** Risk of low-quality auto-contributions; requires strong review gate
- **Mitigation:** All `/capture` output lands in `research/` or `draft` only; never auto-promotes to `stable`

## Status

Proposed. Documented in [capture/README.md](../capture/README.md). Implementation deferred to v0.5+.

## References

- [capture/](../capture/)
- [ADR 0008](0008-research-and-capture-pipeline.md)
