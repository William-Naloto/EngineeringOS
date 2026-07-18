# Project Conventions — BEES Unity Catalog

> **Classification:** Project overlay context (EngineeringOS only)  
> **Applies to:** `data-platform-bees-unity-catalog-service` (consumer repo)

## Pull requests

- Create PRs in Azure DevOps against `master`
- Notify `#bees-unity-catalog` with reviewers: Vanessa Souza, Alexandre Furlan, Guilherme Lima, Vinicius Almeida
- Follow [UC PR best practices](https://ab-inbev.atlassian.net/wiki/spaces/PKB/pages/3788046362/Unity+Catalog+-+Best+practices+-+Pull+Request)
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`) preferred

## Notebooks (Databricks)

- UC team workspace path prefix: `/Workspace/Shared/workspace/` or repo-relative under `notebooks/dw-unity-catalog-app/`
- Load secrets from `unity_catalog` scope via `dbutils.secrets`; fall back to `powerbi-secrets` when documented
- Pin pip dependencies in `%pip install` cells for reproducibility
- Prefer shared modules (`.py` alongside job notebook) over monolithic notebooks
- Use `data_platform` libs when available on cluster; document native fallbacks

## Observability patterns

| Pattern | When | Destination |
|---------|------|-------------|
| OTLP gauges | Live operational metrics (incremental) | New Relic via `otlp.nr-data.net` |
| NR custom events | Historical backfill / replay | `FabricCapacitySummary`, `databricks_jobs` |
| Delta watermark | Cross-run deduplication | `data_platform_am.bronze.*` or `gold.*` state tables |

Watermark tables are **state tables** (one row per entity), not append-only run logs.

## Naming

| Element | Convention | Example |
|---------|------------|---------|
| Notebook job | `<domain>_<purpose>_job.py` | `fabric_capacity_eventhouse_nr_poller_job.py` |
| Shared module | `<domain>_<purpose>.py` | `fabric_capacity_eventhouse_nr_poller.py` |
| Workflow JSON | `aut_<area>_<name>.json` | `aut_newrelic_databricks_job_status.json` |
| UC catalog | `data_platform_am` | Bronze/silver/gold schemas per domain |
| NR entity | kebab-case service name | `fabric-capacity-poller` |

## EngineeringOS boundary

- EngineeringOS artifacts are **never committed** to the consumer Azure DevOps repo
- Install Cursor bundles locally via `scripts/install-project-cursor.sh`
- Use MCP `engineeringos` for live routing — no overlay folder in consumer repo
- Capture validated learnings to EngineeringOS `research/` only
