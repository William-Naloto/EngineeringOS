---
id: capability.engineering.design-architecture
version: "0.1.0"
status: experimental
lifecycle: validated
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Medium
dependencies:
  - standard.architecture.design-principles
orchestrates:
  skills: []
  workflows: []
  agents:
    - agent.architect
  competencies:
    - competency.principal-software-architect
provides:
  - architecture-design
  - system-design
requires: []
references:
  - https://c4model.com/
updated: 2026-07-13
reviewed: 2026-07-13
tags: [architecture, design]
triggers: [architecture, system design, ADR, technical design]
---

# Capability: Design Architecture

> **Status:** Experimental — orchestration wired to competency + agent

## Purpose

Produce architecture decisions with documented trade-offs, boundaries, and ADRs.

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Competency | `competency.principal-software-architect` | 15 topics (draft) |
| Agent | `agent.architect` | Draft persona |
| Topics resolved | architecture-design, adr-authoring, trade-off-analysis, system-decomposition, technology-selection, design-principles | Via competency expansion |

## Exit criteria

- Trade-offs documented with classification
- ADR created if structural decision
- Alignment with ENGINEERING_PHILOSOPHY.md verified
- Context and container views when system spans multiple deployables

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [C4 Model](https://c4model.com/) | Industry practice | High |
| topic.architecture.architecture-design | Internal artifact | Medium |
| topic.architecture.adr-authoring | Internal artifact | High |
| topic.architecture.trade-off-analysis | Internal artifact | Medium |
