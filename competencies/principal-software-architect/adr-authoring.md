---
id: topic.architecture.adr-authoring
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies:
  - topic.architecture.trade-off-analysis
provides: [adr-authoring]
requires: []
references:
  - adr/README.md
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# ADR Authoring

Architecture Decision Records capture **why** — not just what.

## When to write an ADR

| Situation | ADR required? |
|-----------|--------------|
| New technology adoption | Yes |
| Breaking API or contract change | Yes |
| Security model change | Yes |
| "We've always done it this way" | No — but question it |
| Typo fix | No |

## Template

```markdown
# ADR NNNN: Title

> **Status:** Proposed | Accepted | Deprecated
> **Date:** YYYY-MM-DD
> **Classification:** Recommendation

## Context
What is the issue? What forces apply?

## Decision
What did we decide?

## Consequences
- **Positive:** ...
- **Negative:** ...
- **Neutral:** ...

## References
- Links, prior ADRs
```

## Rules

- Sequential numbering in `adr/`
- Status lifecycle: Proposed → Accepted → Deprecated (never delete)
- Link from implementation docs back to ADR
- One decision per ADR

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [adr/README.md](../../adr/README.md) | Internal decision | High |
| Michael Nygard ADR pattern | Industry practice | High |
