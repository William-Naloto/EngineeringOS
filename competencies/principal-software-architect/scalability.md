---
id: topic.architecture.scalability
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Medium
dependencies:
  - topic.architecture.system-decomposition
provides: [scalability]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Scalability

Design for expected load — not infinite scale.

## Questions

- What is the expected throughput (orders of magnitude)?
- What is the growth rate?
- What is the bottleneck under 2× load?
- Horizontal or vertical scaling path?

## Principles

- Stateless where possible
- Partition data before you need to
- Measure before optimizing
- Cache with explicit invalidation strategy

## Anti-pattern

Premature optimization for scale you'll never reach. Validate assumptions with evidence.

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| "Design for 10×, not 1000×" — industry practice | Industry practice | Medium |
