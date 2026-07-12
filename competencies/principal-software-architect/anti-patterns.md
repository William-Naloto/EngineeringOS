---
id: topic.architecture.anti-patterns
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies:
  - topic.architecture.design-principles
provides: [anti-patterns]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Anti-Patterns

Recognize and reject these patterns in design and review.

## Structural

| Anti-pattern | Why it fails | Alternative |
|--------------|-------------|-------------|
| **God service** | Unmaintainable; untestable | Decompose by responsibility |
| **Distributed monolith** | Network coupling without boundaries | Define clear APIs; async where needed |
| **Resume-driven architecture** | Complexity without value | YAGNI; validate with evidence |
| **Golden hammer** | Wrong tool for the job | Technology selection matrix |
| **Implicit coupling** | Hidden dependencies | Explicit contracts |

## Process

| Anti-pattern | Why it fails | Alternative |
|--------------|-------------|-------------|
| **Design in PR** | No review of structure | Design doc or ADR before implementation |
| **Permanent temporary** | Tech debt accumulates | Time-box; replace or promote |
| **Architecture by omission** | Nobody decided; accidents happen | Explicit ADRs |

## EngineeringOS-specific

| Anti-pattern | Policy |
|--------------|--------|
| Framework before value | [ARCHITECTURE-FREEZE.md](../../ARCHITECTURE-FREEZE.md) |
| Update OS while developing | [ADR 0014](../../adr/0014-knowledge-evolution-policy.md) |
| Markdown without evidence | [KNOWLEDGE_CONTRACT.md](../../KNOWLEDGE_CONTRACT.md) |

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Industry anti-pattern catalogs | Industry practice | High |
| EngineeringOS framework trap (observed) | Internal experience | High |
