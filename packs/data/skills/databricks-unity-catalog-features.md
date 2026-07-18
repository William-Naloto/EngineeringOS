---
id: skill.data.databricks-unity-catalog-features
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies:
  - skill.data.feature-store-design
provides: [databricks-development, feature-store]
requires:
  - databricks
  - spark
references:
  - https://docs.databricks.com/en/data-governance/unity-catalog/index.html
updated: 2026-07-13
reviewed: null
tags: [databricks, unity-catalog, features]
triggers: [unity catalog, feature table, databricks features]
---

# Skill: Databricks Unity Catalog Feature Tables

Implement governed feature tables in Unity Catalog for offline training and optional online serving.

## When to use

- Feature store design approved; ready to implement
- Adding a new feature group to existing catalog
- Publishing features for MLP Personalization model training

## Prerequisites

- Unity Catalog metastore configured
- `USE CATALOG` and schema permissions granted
- Source data pipelines producing raw inputs

## Implementation steps

### 1. Create feature table (offline)

```python
from databricks import feature_store

fs = feature_store.FeatureStoreClient()

fs.create_table(
    name="mlp_personalization.features_offline.consumer_behavior_v1",
    primary_keys=["consumer_id"],
    df=features_df,  # Spark DataFrame with feature columns
    description="Consumer behavior features for personalization — v1",
)
```

### 2. Register metadata

| Field | Value |
|-------|-------|
| Owner | Data Platform team |
| Refresh | Daily 04:00 UTC |
| Source pipeline | `job/personalization-feature-refresh` |
| PII columns | Tag in Unity Catalog |

### 3. Compute features (idempotent)

- Use incremental merge on `consumer_id` where possible
- Log `computed_at` timestamp column on every run
- Validate: null rate, row count delta vs prior run (<20% without approval)

### 4. Publish to online store (if required)

Options for MLP Personalization serving:

| Option | Latency | Complexity |
|--------|---------|------------|
| Databricks Model Serving + FS | Low | Medium |
| Redis sync job | Very low | Higher ops |
| Batch-only (no online) | N/A | Lowest |

### 5. Grant access

- Training service principal: `SELECT` on offline tables
- Serving principal: `SELECT` on online tables only
- Analysts: read-only on offline via workspace group

## Validation checklist

- [ ] Primary keys unique per run
- [ ] `computed_at` within expected freshness window
- [ ] Unity Catalog lineage shows upstream tables
- [ ] New Relic event emitted on publish success/failure
- [ ] Feature version documented in model registry

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Unity Catalog docs](https://docs.databricks.com/en/data-governance/unity-catalog/index.html) | Official documentation | High |
| GHQ B2B Delta Databricks workspace patterns | Internal experience | Medium |
