# ADR 0006: Standards vs Skills Separation

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

Without separation, stable conventions (git commit format, naming rules) get mixed with rapidly evolving domain skills (Fabric, Spark, Python), causing unnecessary churn and broken dependencies.

## Decision

Split into two trees:

```
standards/          # Stable conventions — rarely change
  documentation/
  naming/
  architecture/
  git/
  review/

packs/<name>/skills/  # Domain skills — evolve rapidly
  python/
  fabric/
  spark/
  powerbi/
  sql/
```

### Rules

- Standards are global and shared across all packs
- Skills live inside packs (or future global skill packs)
- Skills declare `dependencies` on standards, never the reverse
- Standards require maintainer approval for any change
- Skills can be updated by pack owners

## Consequences

- **Positive:** Stable foundation; reduced churn; clear ownership
- **Negative:** Two trees to navigate; must decide "standard or skill?" for new content
- **Neutral:** A convention used by one pack only may still be a skill, not a standard

## References

- [standards/README.md](../standards/README.md)
- [ENGINEERING_PHILOSOPHY.md](../ENGINEERING_PHILOSOPHY.md)
