---
id: topic.architecture.system-decomposition
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies:
  - topic.architecture.design-principles
provides: [system-decomposition]
requires: []
references:
  - https://c4model.com/
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# System Decomposition

How to break systems into components with clear boundaries.

## Decomposition strategies

| Strategy | Use when |
|----------|----------|
| **By capability** | Distinct business functions |
| **By change rate** | Parts that evolve at different speeds |
| **By team** | Conway's Law — align with ownership |
| **By failure domain** | Isolate blast radius |

## Rules

- Each component has one reason to change
- Dependencies point inward (domain at center)
- Shared kernels are explicit and minimal
- Data ownership is single-writer per aggregate

## Checklist

- [ ] Can each component be described in one sentence?
- [ ] Are interfaces documented?
- [ ] Is data ownership clear?
- [ ] Can components be deployed independently (if required)?

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [C4 Model](https://c4model.com/) | Industry practice | High |
| Domain-Driven Design bounded contexts | Industry practice | Medium |
