---
id: skill.fabric.pipeline-health-check
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies:
  - skill.fabric.monitoring-setup
provides: [fabric-pipeline-diagnostics]
requires:
  - microsoft-fabric
references:
  - https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-overview
updated: 2026-07-13
reviewed: null
tags: [fabric, pipeline, troubleshooting]
triggers: [pipeline failed, fabric pipeline error, slow pipeline]
---

# Skill: Fabric Pipeline Health Check

Diagnose failed, slow, or flaky Fabric pipelines and produce actionable remediation steps.

## When to use

- Alert fired for pipeline failure or SLA breach
- Stakeholder reports missing or stale data
- Post-incident review of pipeline reliability

## Triage checklist

### 1. Identify the run

- Workspace → item → latest failed run
- Record: `run_id`, start time, duration, error message, activity name

### 2. Classify failure

| Category | Indicators | Typical fix |
|----------|------------|-------------|
| **Source** | Connection timeout, auth error | Rotate secret, check firewall |
| **Transform** | Spark OOM, notebook exception | Tune cluster, fix code |
| **Sink** | Write conflict, schema mismatch | Align schema, idempotent write |
| **Capacity** | Throttling, queued | Reschedule, scale capacity |
| **Dependency** | Upstream not ready | Fix schedule order, add sensor |

### 3. Check recent changes

- Git commit to linked notebook in last 48h?
- Schema change in source lakehouse?
- Parameter or credential rotation?

### 4. Assess blast radius

| Question | Action |
|----------|--------|
| Downstream dashboards affected? | Notify report owners |
| SLA breach? | Escalate per incident workflow |
| Data quality impact? | Trigger DQ validation skill (future) |

### 5. Remediation and follow-up

1. Apply fix (code, config, or operational)
2. Re-run pipeline; confirm success
3. Backfill if data gap exists
4. Add test or alert if gap was undetected

## NRQL starter (New Relic)

```sql
SELECT count(*) FROM FabricPipelineRun
WHERE workspace = 'YOUR_WORKSPACE' AND status = 'failed'
FACET item_name SINCE 24 hours ago
```

## Output

- Root cause summary (classified)
- Remediation steps taken
- Whether backfill required
- Recommendation for alert or test improvement

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Fabric pipeline overview](https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-overview) | Official documentation | High |
| GHQ B2B Delta pipeline incident patterns | Internal experience | Medium |
