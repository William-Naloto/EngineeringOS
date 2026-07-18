---
id: skill.fabric.monitoring-setup
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies: []
provides: [fabric-monitoring, fabric-telemetry]
requires:
  - microsoft-fabric
  - newrelic
references:
  - https://learn.microsoft.com/en-us/fabric/admin/monitoring-workspace
updated: 2026-07-13
reviewed: null
tags: [fabric, monitoring, observability]
triggers: [fabric monitoring, workspace monitoring, fabric telemetry]
---

# Skill: Fabric Workspace Monitoring Setup

Configure observability for a Microsoft Fabric workspace so pipeline failures, capacity issues, and refresh problems are visible before users report them.

## When to use

- Onboarding a new Fabric workspace to platform monitoring
- Auditing an existing workspace with no alerting
- Connecting Fabric operational signals to New Relic

## Prerequisites

- Fabric workspace Admin or Member role
- New Relic account with ingest capability (logs/events)
- Workspace name, capacity SKU, and item inventory documented

## Steps

### 1. Inventory workspace items

Document all items and owners:

| Item type | Name | Owner | Schedule | Criticality |
|-----------|------|-------|----------|-------------|
| Lakehouse | — | — | — | High/Medium/Low |
| Pipeline | — | — | cron/scheduled | — |
| Semantic model | — | — | refresh | — |
| Notebook | — | — | ad-hoc | — |

### 2. Enable Fabric monitoring views

1. Open **Fabric Admin portal** → **Monitoring hub**
2. Confirm workspace appears in usage and activity reports
3. Export or API-access pipeline run history where available
4. Record baseline: avg run duration, failure rate (7-day window)

### 3. Define health signals

| Signal | Source | Threshold (starting point) |
|--------|--------|---------------------------|
| Pipeline failure | Run history | Any failure on critical pipelines |
| Run duration P95 | Run history | >2× 7-day baseline |
| Refresh failure | Semantic model | Any failed refresh |
| Capacity throttling | Admin metrics | Sustained >5 min |

### 4. Forward to New Relic

Forward structured events with consistent attributes:

```
workspace: <fabric-workspace-name>
item_type: pipeline | lakehouse | semantic_model
item_name: <name>
run_id: <id>
status: success | failed | cancelled
duration_ms: <number>
value_stream: Data - MLP Personalization
```

Use New Relic log/event API or existing platform forwarder. Namespace events under `Fabric` domain for dashboard reuse.

### 5. Validate

- Trigger a test pipeline run; confirm event in New Relic within 5 minutes
- Document dashboard link and alert policy IDs in workspace runbook

## Output

- Workspace monitoring checklist (completed)
- New Relic dashboard URL
- Alert policy IDs for critical pipelines
- Runbook entry in team wiki or Obsidian vault

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Microsoft Fabric monitoring](https://learn.microsoft.com/en-us/fabric/admin/monitoring-workspace) | Official documentation | High |
| GHQ B2B Delta Fabric workspace operations | Internal experience | Medium |
| New Relic event ingestion patterns | Internal experience | Medium |
