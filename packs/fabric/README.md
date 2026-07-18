# Pack: Microsoft Fabric

> **Pack ID:** `pack.fabric`  
> **Status:** Draft — initial skills for workspace monitoring  
> **Owner:** Data Platform — GHQ B2B Delta

Knowledge pack for **Microsoft Fabric** workloads: lakehouses, pipelines, semantic models, and workspace observability in the AB InBev data platform context.

## Scope

- Fabric workspace and item monitoring
- Pipeline run health and failure triage
- Telemetry export to New Relic for unified dashboards
- Power BI semantic model operational checks (future)

## Enables capabilities

- [Fabric Monitoring](../../capabilities/fabric/monitoring.md) — `capability.fabric.monitoring`

## Modules

| Module | ID | Purpose |
|--------|-----|---------|
| Monitoring setup | `skill.fabric.monitoring-setup` | Configure Fabric workspace observability |
| Pipeline health | `skill.fabric.pipeline-health-check` | Diagnose failed or slow pipeline runs |

## Platform context

Typical Fabric items in GHQ B2B Delta:

- Lakehouses and warehouses for curated data layers
- Data pipelines (notebooks, Spark jobs, Dataflows)
- Semantic models consumed by Power BI reports
- Workspace-level capacity and refresh schedules

## Usage

Load this pack when the task involves Fabric workspace operations, pipeline monitoring, or connecting Fabric telemetry to platform observability (New Relic).
