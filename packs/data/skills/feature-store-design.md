---
id: skill.data.feature-store-design
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies: []
provides: [feature-store, feature-engineering]
requires:
  - databricks
  - spark
references:
  - https://docs.databricks.com/en/machine-learning/feature-store/index.html
updated: 2026-07-13
reviewed: null
tags: [feature-store, ml, architecture]
triggers: [feature store design, ML features, feature engineering architecture]
---

# Skill: Feature Store Design

Design a feature store architecture for ML personalization workloads with clear boundaries between offline training and online serving.

## When to use

- Starting a new ML use case (e.g. product recommendation, personalization)
- Consolidating ad-hoc feature tables into governed store
- Planning migration from notebook outputs to reusable features

## Architecture decisions

### 1. Feature taxonomy

| Type | Description | Example (MLP Personalization) |
|------|-------------|-------------------------------|
| **Entity** | Primary key grain | `consumer_id`, `product_id` |
| **Feature** | Computed attribute | `purchase_count_30d`, `category_affinity` |
| **Feature group** | Related features at same grain | `consumer_behavior_features` |

### 2. Offline vs online

```
Offline store (batch)          Online store (low-latency)
Databricks Delta tables  →   Redis / DynamoDB / Databricks Model Serving
Used for: training           Used for: real-time inference
Refresh: daily/hourly        Refresh: streaming or near-real-time sync
```

### 3. Unity Catalog organization

```
catalog: mlp_personalization
  schema: features_offline
    table: consumer_behavior_v1
  schema: features_online
    table: consumer_behavior_serving_v1
```

### 4. Versioning policy

- Feature table suffix: `_v1`, `_v2` — never mutate in place
- Deprecation: 90-day overlap before retiring old version
- Model training pins to explicit feature version in metadata

### 5. Lineage and quality

| Requirement | Implementation |
|-------------|----------------|
| Lineage | Unity Catalog lineage + pipeline job IDs |
| Freshness SLI | Feature computed_by timestamp; alert if stale |
| Null rate | DQ check before publish to online store |
| PII | Tag columns; mask in online store if needed |

## Deliverables

- Feature store design doc (entities, groups, refresh cadence)
- Unity Catalog namespace plan
- Offline/online sync mechanism choice with trade-offs
- SLO for feature freshness (link to `skill.platform.slo-definition`)

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Databricks Feature Store](https://docs.databricks.com/en/machine-learning/feature-store/index.html) | Official documentation | High |
| MLP Personalization feature requirements | Internal experience | Medium |
| Feast / Tecton patterns (reference) | Industry practice | Medium |
