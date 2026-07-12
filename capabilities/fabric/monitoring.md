---
id: capability.fabric.monitoring
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Unknown
dependencies:
  - standard.architecture.design-principles
  - standard.documentation.structure
orchestrates:
  skills: []
  workflows: []
  agents:
    - agent.sre
provides:
  - fabric-monitoring
requires:
  - fabric
  - newrelic
  - python
  - sql
references: []
updated: 2026-07-12
reviewed: null
tags: [fabric, monitoring, observability]
triggers: [fabric monitoring, platform monitoring, new relic fabric]
---

# Capability: Fabric Monitoring

> **Status:** Placeholder (RC1) — structure only; orchestrated skills not yet authored.

## Purpose

End-to-end fabric workspace monitoring: setup, dashboards, alerting, and incident response.

## When to use

- Setting up monitoring for a new Fabric workspace
- Reviewing or improving existing Fabric observability
- Connecting Fabric telemetry to New Relic

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Agent | `agent.sre` | Placeholder |
| Skills | TBD | Not authored |
| Workflows | TBD | Not authored |

## Steps

1. Assess current Fabric workspace telemetry — *delegates to skill (TBD)*
2. Configure monitoring integration — *delegates to skill (TBD)*
3. Build dashboards — *delegates to skill (TBD)*
4. Define alerting and runbooks — *delegates to workflow (TBD)*

## Exit criteria

- Monitoring active with documented dashboards
- Alerting configured with runbook
- Evidence of validation in non-production environment

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| — | — | No evidence yet — `confidence: Unknown` |
