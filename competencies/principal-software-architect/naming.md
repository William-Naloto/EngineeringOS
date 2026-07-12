---
id: topic.architecture.naming
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies: []
provides: [naming]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Naming

Names are architecture — they communicate intent.

## Rules

- **Reveal intent** — `fetchUserById` not `getData`
- **Consistent vocabulary** — same concept, same term across codebase
- **Avoid abbreviations** unless industry-standard (HTTP, API, ID)
- **Match domain language** — ubiquitous language from domain experts

## Review checklist (PR)

- [ ] New public names follow project conventions?
- [ ] Names consistent with existing domain terms?
- [ ] No misleading names (e.g., `cache` that writes to DB)?

## Enables Sprint 1

Naming dimension of [Review PR](../../capabilities/engineering/review-pr.md).

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Clean Code (Martin) — naming chapter | Industry practice | High |
