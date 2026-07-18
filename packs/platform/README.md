# Pack: Platform Observability

> **Pack ID:** `pack.platform`  
> **Status:** Draft — New Relic and SRE practices  
> **Owner:** Data Platform — GHQ B2B Delta

Knowledge pack for **platform-wide observability**: New Relic dashboards, SLOs, alerting, and incident response for data platform services.

## Scope

- New Relic dashboard design for data pipelines and APIs
- SLI/SLO definition for critical data products
- Incident response workflow for on-call engineers
- Cross-signal correlation (Fabric + Databricks + APIs)

## Enables capabilities

- [Platform Observability](../../capabilities/platform/observability.md) — `capability.platform.observability`
- Supports [Fabric Monitoring](../../capabilities/fabric/monitoring.md) via shared New Relic patterns

## Modules

| Module | ID | Purpose |
|--------|-----|---------|
| New Relic dashboard | `skill.platform.newrelic-dashboard` | Build operational dashboards |
| SLO definition | `skill.platform.slo-definition` | Define SLIs and error budgets |
| Incident response | `workflow.platform.incident-response` | Structured on-call workflow |

## Platform context

AB InBev data platform observability stack:

- **New Relic** — primary APM and custom events (Fabric, batch jobs, APIs)
- **Azure DevOps** — CI/CD pipelines (GHQ_B2B_Delta)
- **Value stream:** Data - MLP Personalization and related B2B data products
