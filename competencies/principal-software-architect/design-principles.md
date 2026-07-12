---
id: topic.architecture.design-principles
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies: []
provides: [architecture-design, design-principles]
requires: []
references:
  - ENGINEERING_PHILOSOPHY.md
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Design Principles

Apply these principles when designing or reviewing any system.

## Core principles

1. **Maintainability over cleverness** — future engineers (human and AI) must understand and modify the design
2. **Explicit boundaries** — every component has a single, documented responsibility
3. **Design for replacement** — no component is permanent; interfaces enable swap
4. **Fail fast, recover gracefully** — detect errors early; define recovery paths
5. **Evidence over assumptions** — document trade-offs with classification labels
6. **Minimal coupling, explicit dependencies** — depend on interfaces, not implementations

## When reviewing a design

Ask:

- Can I explain this to a new engineer in 10 minutes?
- What breaks first under load?
- What is the migration path when this component is replaced?
- Where are the trust boundaries?

## Alignment

These principles inherit from [ENGINEERING_PHILOSOPHY.md](../../ENGINEERING_PHILOSOPHY.md). When in conflict, the philosophy document wins.

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [ENGINEERING_PHILOSOPHY.md](../../ENGINEERING_PHILOSOPHY.md) | Internal decision | High |
| Industry practice (SOLID, 12-factor) | Industry practice | High |
| "Design for replacement" — EngineeringOS ADRs | Internal experience | Medium |
