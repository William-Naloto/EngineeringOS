---
id: capability.fabric.monitoring
version: "0.1.0"
status: experimental
lifecycle: validated
owner: Data Platform — GHQ B2B Delta
classification: Recommendation
confidence: Medium
dependencies: []
orchestrates:
  skills:
    - skill.fabric.monitoring-setup
    - skill.fabric.pipeline-health-check
    - skill.platform.newrelic-dashboard
  workflows:
    - workflow.platform.incident-response
  agents:
    - agent.sre
provides:
  - fabric-monitoring
requires:
  - microsoft-fabric
  - newrelic
  - python
  - sql
references:
  - https://learn.microsoft.com/en-us/fabric/
updated: 2026-07-13
reviewed: 2026-07-13
tags: [fabric, monitoring, observability]
triggers: [fabric monitoring, platform monitoring, new relic fabric, fabric pipeline]
---

# Capability: Fabric Monitoring

> **Status:** Experimental — skills and workflow wired

## Purpose

End-to-end Microsoft Fabric workspace monitoring: setup, dashboards, alerting, pipeline triage, and incident response for GHQ B2B Delta data workloads.

## When to use

- Onboarding a new Fabric workspace to platform monitoring
- Investigating failed or slow Fabric pipelines
- Connecting Fabric telemetry to New Relic dashboards
- Responding to Fabric-related production alerts

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Agent | `agent.sre` | Draft persona |
| Skills | `skill.fabric.monitoring-setup`, `skill.fabric.pipeline-health-check`, `skill.platform.newrelic-dashboard` | Draft |
| Workflow | `workflow.platform.incident-response` | Draft |
| Pack | `pack.fabric`, `pack.platform` | Draft |

## Steps

1. **Inventory** — workspace items, owners, criticality (`skill.fabric.monitoring-setup`)
2. **Configure telemetry** — Fabric events → New Relic with standard facets
3. **Build dashboard** — golden signals + Fabric drill-down (`skill.platform.newrelic-dashboard`)
4. **Define alerts** — pipeline failure, freshness, capacity throttling
5. **Triage failures** — `skill.fabric.pipeline-health-check`
6. **Incidents** — `workflow.platform.incident-response` for SEV-1/2

## Exit criteria

- Monitoring active with documented New Relic dashboard URL
- Alert policies linked to critical pipelines
- Runbook entry with workspace name and on-call escalation path
- Test event validated in New Relic within 5 minutes of setup

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Microsoft Fabric monitoring](https://learn.microsoft.com/en-us/fabric/admin/monitoring-workspace) | Official documentation | High |
| skill.fabric.monitoring-setup | Internal artifact | Medium |
| GHQ B2B Delta Fabric workspace operations | Internal experience | Medium |
| New Relic Fabric event patterns | Internal experience | Medium |
