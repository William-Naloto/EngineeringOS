---
id: skill.platform.newrelic-dashboard
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies: []
provides: [newrelic-observability, platform-observability]
requires:
  - newrelic
references:
  - https://docs.newrelic.com/docs/nrql/get-started/introduction-nrql-new-relics-query-language/
updated: 2026-07-13
reviewed: null
tags: [newrelic, dashboard, observability]
triggers: [new relic dashboard, NRQL, monitoring dashboard]
---

# Skill: New Relic Dashboard for Data Platform

Design and implement a New Relic dashboard for data platform services with consistent naming, facets, and alert-ready widgets.

## When to use

- New service or pipeline needs operational visibility
- Existing dashboard is unreadable or missing key signals
- Standardizing dashboards across GHQ B2B Delta teams

## Dashboard structure

### Page 1 — Overview (golden signals)

| Widget | NRQL pattern | Purpose |
|--------|--------------|---------|
| Error rate | `percentage(count(*), WHERE status = 'failed')` | Reliability |
| Throughput | `count(*) TIMESERIES` | Load |
| Latency P95 | `percentile(duration_ms, 95)` | Performance |
| Saturation | Capacity/throttle events | Resource pressure |

### Page 2 — Domain breakdown

Facet by standard attributes:

```
value_stream: Data - MLP Personalization
team: <team-name>
service: fabric-pipeline | databricks-job | api-gateway
environment: dev | staging | prod
```

### Page 3 — Drill-down

- Top failing items (pipelines, jobs, endpoints)
- Recent deployments correlated with error spikes
- Links to Azure DevOps pipeline runs and Fabric workspace

## Naming convention

```
[ValueStream] — [Service] — [Environment]
Example: MLP — Fabric Pipelines — Prod
```

## Alert policy linkage

Every critical widget should map to an alert condition:

| Widget | Alert | Severity |
|--------|-------|----------|
| Error rate > 5% (15 min) | PagerDuty / Teams | Critical |
| P95 latency > 2× baseline | Ticket | Warning |
| No data (30 min) on critical pipeline | PagerDuty | Critical |

## Steps

1. Define service boundaries and `service` attribute values
2. Confirm event/log ingestion with required facets
3. Build Overview page first; validate with on-call engineer
4. Add drill-down pages; link runbooks
5. Create alert policies; test with synthetic failure
6. Document dashboard URL in capability runbook

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [New Relic NRQL docs](https://docs.newrelic.com/docs/nrql/) | Official documentation | High |
| GHQ B2B Delta New Relic dashboard standards | Internal experience | Medium |
| Google SRE — golden signals | Industry practice | Medium |
