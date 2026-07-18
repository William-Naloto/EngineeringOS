---
id: capability.platform.observability
version: "0.1.0"
status: experimental
lifecycle: validated
owner: Data Platform — GHQ B2B Delta
classification: Recommendation
confidence: Medium
dependencies: []
orchestrates:
  skills:
    - skill.platform.newrelic-dashboard
    - skill.platform.slo-definition
  workflows:
    - workflow.platform.incident-response
  agents:
    - agent.sre
provides:
  - platform-observability
  - newrelic-observability
requires:
  - newrelic
references:
  - https://docs.newrelic.com/
updated: 2026-07-13
reviewed: 2026-07-13
tags: [platform, observability, sre]
triggers: [observability, monitoring, SLO, alerting, new relic]
---

# Capability: Platform Observability

> **Status:** Experimental — New Relic + SLO skills wired

## Purpose

Design and operate platform-wide observability for AB InBev data services: New Relic dashboards, SLI/SLO definitions, alerting, and structured incident response.

## When to use

- New data service needs dashboards and SLOs
- Defining reliability targets for batch or streaming pipelines
- On-call response to platform-wide alerts
- Standardizing observability across GHQ B2B Delta teams

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Agent | `agent.sre` | Draft persona |
| Skills | `skill.platform.newrelic-dashboard`, `skill.platform.slo-definition` | Draft |
| Workflow | `workflow.platform.incident-response` | Draft |
| Pack | `pack.platform` | Draft |

## Steps

1. **Define service boundaries** — name, owner, value stream (`Data - MLP Personalization`)
2. **Build dashboard** — golden signals NRQL widgets (`skill.platform.newrelic-dashboard`)
3. **Define SLOs** — freshness, success rate, or availability (`skill.platform.slo-definition`)
4. **Configure alerts** — map widgets to policies with severity
5. **Run incidents** — `workflow.platform.incident-response` when alerts fire

## Cross-capability support

This capability provides shared observability patterns consumed by:

- `capability.fabric.monitoring` — Fabric-specific signals on shared dashboards
- `capability.data.feature-store` — feature freshness SLIs

## Exit criteria

- Dashboard published with standard naming convention
- At least one SLO defined with NRQL measurement
- Alert policies tested with synthetic failure
- Error budget policy documented for stakeholders

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [New Relic documentation](https://docs.newrelic.com/) | Official documentation | High |
| [Google SRE — SLOs](https://sre.google/sre-book/service-level-objectives/) | Industry practice | High |
| skill.platform.newrelic-dashboard | Internal artifact | Medium |
| GHQ B2B Delta on-call practices | Internal experience | Medium |
