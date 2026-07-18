---
id: capability.data.feature-store
version: "0.1.0"
status: experimental
lifecycle: validated
owner: Data Platform — GHQ B2B Delta
classification: Recommendation
confidence: Medium
dependencies: []
orchestrates:
  skills:
    - skill.data.feature-store-design
    - skill.data.databricks-unity-catalog-features
    - skill.platform.slo-definition
  workflows: []
  agents:
    - agent.principal-data-engineer
provides:
  - feature-store
requires:
  - databricks
  - spark
  - unity-catalog
references:
  - https://docs.databricks.com/en/machine-learning/feature-store/index.html
updated: 2026-07-13
reviewed: 2026-07-13
tags: [data, feature-store, ml, personalization]
triggers: [feature store, ML features, feature engineering, unity catalog features]
---

# Capability: Feature Store

> **Status:** Experimental — Databricks skills wired for MLP Personalization

## Purpose

Design and implement a governed feature store on Databricks Unity Catalog for ML personalization workloads — offline training tables, optional online serving, versioning, and freshness SLOs.

## When to use

- Launching or extending MLP Personalization model features
- Consolidating ad-hoc feature notebooks into governed tables
- Defining feature freshness and quality gates before model training

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Agent | `agent.principal-data-engineer` | Draft persona |
| Skills | `skill.data.feature-store-design`, `skill.data.databricks-unity-catalog-features`, `skill.platform.slo-definition` | Draft |
| Pack | `pack.data` | Draft |

## Steps

1. **Design** — entities, feature groups, offline/online split (`skill.data.feature-store-design`)
2. **Implement** — Unity Catalog tables, idempotent compute (`skill.data.databricks-unity-catalog-features`)
3. **Define SLO** — feature freshness target (`skill.platform.slo-definition`)
4. **Validate** — uniqueness, null rate, lineage, New Relic publish events
5. **Register** — pin feature version in model registry metadata

## MLP Personalization context

| Entity | Example features |
|--------|------------------|
| `consumer_id` | `purchase_count_30d`, `category_affinity`, `last_purchase_days` |
| `product_id` | `view_count_7d`, `conversion_rate`, `seasonal_score` |

Catalog namespace: `mlp_personalization.features_offline.*`

## Exit criteria

- Feature tables created in Unity Catalog with documented schema
- Refresh pipeline scheduled and monitored
- Freshness SLO defined and alerting configured
- Model training references explicit feature version

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Databricks Feature Store](https://docs.databricks.com/en/machine-learning/feature-store/index.html) | Official documentation | High |
| skill.data.feature-store-design | Internal artifact | Medium |
| MLP Personalization feature requirements (GHQ B2B Delta) | Internal experience | Medium |
