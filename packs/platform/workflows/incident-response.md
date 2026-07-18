---
id: workflow.platform.incident-response
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies:
  - skill.platform.newrelic-dashboard
  - skill.fabric.pipeline-health-check
provides: [incident-response]
requires:
  - newrelic
references: []
updated: 2026-07-13
reviewed: null
tags: [incident, on-call, sre]
triggers: [incident, on-call, outage, pagerduty]
---

# Workflow: Platform Incident Response

Structured workflow for responding to data platform incidents affecting Fabric pipelines, Databricks jobs, or downstream ML personalization services.

## Severity levels

| Level | Criteria | Response |
|-------|----------|----------|
| **SEV-1** | Production data unavailable; ML serving degraded | Page on-call; war room |
| **SEV-2** | Delayed data; partial degradation | On-call investigates < 30 min |
| **SEV-3** | Non-prod or single non-critical pipeline | Ticket; next business day |

## Steps

### 1. Acknowledge (0–5 min)

- Acknowledge alert in New Relic / PagerDuty
- Post in Teams incident channel: service, severity, initial impact
- Assign **Incident Commander** (IC)

### 2. Triage (5–20 min)

| Check | Tool / Skill |
|-------|--------------|
| Recent deployments | Azure DevOps pipeline history |
| Fabric pipeline status | `skill.fabric.pipeline-health-check` |
| New Relic error spike | Dashboard — Overview page |
| Upstream dependency | Check source systems |

### 3. Mitigate (20–60 min)

- Apply fastest safe fix: rollback, re-run, scale, disable non-critical job
- Document hypothesis and action in incident thread
- Update stakeholders if SEV-1/2

### 4. Resolve

- Confirm SLI/SLO back within target
- Close alert; mark incident resolved in tracking system

### 5. Post-incident (within 5 business days)

- Blameless postmortem for SEV-1/2
- Capture learnings → `research/` via [capture/learn.md](../../capture/learn.md)
- Create follow-up tickets for preventive work

## Communication template

```
[SEV-X] <Service> — <one-line impact>
Status: Investigating | Mitigating | Resolved
IC: <name>
Impact: <who/what affected>
Next update: <time>
```

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Google SRE — incident management | Industry practice | High |
| GHQ B2B Delta on-call runbooks | Internal experience | Medium |
