---
id: topic.architecture.trade-off-analysis
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies:
  - topic.architecture.design-principles
provides: [trade-off-analysis]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Trade-Off Analysis

Every architectural decision involves trade-offs. Document them explicitly — never present one option as obviously correct.

## Format

```markdown
## Decision: <what we chose>

### Options considered
| Option | Pros | Cons |
|--------|------|------|
| A | ... | ... |
| B | ... | ... |

### Decision
We chose **B** because...

### Trade-offs accepted
- <what we give up>

### Classification
Recommendation | BestPractice | Fact | Experimental
```

## Rules

- Present at least two viable options
- Label claims with classification
- State what would cause revisiting this decision
- Link to ADR if the decision is structural

## Anti-pattern

> "We'll use X because it's the best."

Without options, pros/cons, or evidence — this is not architecture, it is assertion.

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Architecture Decision Records practice | Industry practice | High |
| [ADR 0014](../../adr/0014-knowledge-evolution-policy.md) | Internal decision | High |
