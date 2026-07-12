---
id: topic.architecture.documentation
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies: []
provides: [documentation]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Documentation (Architect's View)

Documentation is part of the feature — not an afterthought.

## What architects document

| Artifact | Audience | Update trigger |
|----------|----------|----------------|
| ADR | Future architects | Every structural decision |
| Context/container diagrams | Team + onboarding | Boundary changes |
| Runbooks | Operations | Deployment changes |
| README | Contributors | Setup or scope changes |
| API contracts | Consumers | Interface changes |

## Standards

- Write for the reader who arrives in six months with no context
- Diagrams live in version control (Mermaid preferred)
- Link decisions to ADRs — never duplicate rationale
- Classify claims: Fact, BestPractice, Recommendation, Experimental

## Compilation note

This knowledge compiles to Confluence, MkDocs, Obsidian, and IDE context — write once in canonical form.

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [ENGINEERING_PHILOSOPHY.md](../../ENGINEERING_PHILOSOPHY.md) | Internal decision | High |
| Docs-as-code practice | Industry practice | High |
