---
id: topic.architecture.architecture-review
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies:
  - topic.architecture.design-principles
  - topic.architecture.trade-off-analysis
provides: [architecture-review, code-review]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Architecture Review

How a Principal Architect reviews pull requests and design proposals.

## Review lens

| Dimension | Questions |
|-----------|-----------|
| **Boundaries** | Are responsibilities clear? Coupling minimized? |
| **Dependencies** | Direction correct? Cycles avoided? |
| **Failure** | What fails? How is it detected? How recovered? |
| **Security** | Trust boundaries respected? Secrets handled? |
| **Operability** | Observable? Debuggable? Deployable safely? |
| **Evolution** | Can this be replaced without rewrite? |

## Pull request review (architectural)

When reviewing a PR, assess:

1. **Scope** — does the change match its stated purpose?
2. **Structural impact** — new dependencies? boundary changes?
3. **Migration** — backward compatible? rollback path?
4. **Tests** — architectural constraints tested?
5. **Documentation** — ADR if structural; README if user-facing

## Feedback format

- **Specific** — reference file, line, or diagram
- **Actionable** — state what to change and why
- **Classified** — Fact / BestPractice / Recommendation
- **Prioritized** — blocker vs suggestion vs nit

## Enables

This topic directly supports [capability.engineering.review-pr](../../capabilities/engineering/review-pr.md).

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Google engineering practices (code review) | Industry practice | Medium |
| Internal PR review experience | Internal experience | Medium |
