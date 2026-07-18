# Project Context — BEES Unity Catalog Service

> **Classification:** Project overlay context (EngineeringOS only)  
> **Owner:** Unity Catalog / Data Platform — GHQ B2B Delta

## Purpose

Provision and operate Databricks Unity Catalog resources for all BEES data domains: catalogs, schemas, external locations, storage credentials, Delta Share, and workspace automation for the UC team workspace (`dmz001-dw`).

## Architecture snapshot

```
Azure (subscriptions, storage, Key Vault, VNet)
        ↓
Databricks workspaces (per domain / landing zone)
        ↓
Unity Catalog (catalogs, schemas, grants via AAD groups)
        ↓
Notebooks + Workflows (ETL, automation, observability)
        ↓
Downstream: Brewdat, domain consumers, New Relic telemetry
```

Primary UC workspace: `dbw{env}am-dmz001-dw-unity-catalog-app`  
Primary catalog: `data_platform_am`  
Environments: `prd`, `uat`, `sit`

## Repository map

| Path | Purpose |
|------|---------|
| `unity-catalog/teams/` | Terraform `.tfvars` for catalogs, schemas, external locations |
| `unity-catalog/test_new_onboarding_jsons/` | Domain onboarding templates |
| `notebooks/dw-unity-catalog-app/` | UC team workspace notebooks |
| `notebooks/.../automation/powerbi/` | Fabric capacity → New Relic pollers |
| `notebooks/.../automation/new_relic/` | NR lookup tables, job status monitoring |
| `pipelines/.../workflows/` | Databricks job definitions (JSON) |
| `pipelines/.../workflows/docs/` | Workflow documentation |

## Active automation areas (2026-07)

| Area | Location | Observability |
|------|----------|---------------|
| Fabric capacity metrics | `automation/powerbi/fabric_capacity_eventhouse_nr_*` | OTLP gauges + NR custom events |
| Databricks job status | `automation/new_relic/lookup/newrelic_databricks_job_status` | NR Events API + Delta watermark |
| NR team/workspace lookup | `automation/new_relic/lookup/newrelic_lookup_team_workspace` | Reference tables |

## External systems

| System | Usage |
|--------|-------|
| Azure DevOps | Source control, PRs, CI (`ab-inbev/GHQ_B2B_Delta`) |
| Databricks | Notebooks, jobs, Unity Catalog, secrets (`unity_catalog` scope) |
| Microsoft Fabric | Eventhouse capacity metrics, Power BI workspaces |
| New Relic | Dashboards, alerts, OTLP, Events API |
| Confluence (PKB) | Unity Catalog best practices and architecture |
| Slack `#bees-unity-catalog` | PR notifications and team support |

## Capability mapping

| Consumer activity | EngineeringOS capability |
|-------------------|--------------------------|
| PR review (notebooks, tfvars, pipelines) | `capability.engineering.review-pr` |
| Fabric Eventhouse / capacity monitoring | `capability.fabric.monitoring` |
| New Relic dashboards, SLOs, incidents | `capability.platform.observability` |
| ML feature tables on Unity Catalog | `capability.data.feature-store` |
| New domain onboarding or service design | `capability.engineering.design-architecture` |

## References

- [Unity Catalog Overview (Confluence)](https://ab-inbev.atlassian.net/wiki/spaces/PKB/pages/3719136044/Unity+Catalog+-+Overview)
- [Unity Catalog BEES Architecture](https://ab-inbev.atlassian.net/wiki/spaces/PKB/pages/3590587269/Unity+Catalog+-+BEES+Architecture)
- [UC PR Best Practices](https://ab-inbev.atlassian.net/wiki/spaces/PKB/pages/3788046362/Unity+Catalog+-+Best+practices+-+Pull+Request)
