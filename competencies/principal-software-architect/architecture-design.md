---
id: topic.architecture.architecture-design
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies:
  - topic.architecture.design-principles
provides: [architecture-design, system-design]
requires: []
references:
  - https://c4model.com/
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Architecture Design

How to produce architecture designs that are clear, reviewable, and actionable.

## Process

1. **Define the problem** — what outcome is required? What constraints exist?
2. **Identify stakeholders** — who consumes, operates, and maintains this?
3. **Sketch context** — C4 Level 1: system in its environment
4. **Decompose** — containers, components, data flows
5. **Document trade-offs** — use [trade-off-analysis.md](trade-off-analysis.md)
6. **Record decisions** — ADR for every significant choice
7. **Define exit criteria** — how do we know the design is complete?

## Deliverables

| Artifact | When |
|----------|------|
| Context diagram | Always |
| Container diagram | Systems with >1 deployable unit |
| ADR | Every significant decision |
| Sequence diagram | Complex interactions |
| Data flow | Systems moving data across boundaries |

## Diagram standards

- Use Mermaid for version-controlled diagrams
- Label trust boundaries
- Show data direction
- Avoid implementation detail in context/container views

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [C4 Model](https://c4model.com/) | Industry practice | High |
| Internal architecture review practice | Internal experience | Medium |
