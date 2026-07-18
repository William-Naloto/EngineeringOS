# Pack: Data Engineering & ML Features

> **Pack ID:** `pack.data`  
> **Status:** Draft — feature store and Databricks patterns  
> **Owner:** Data Platform — GHQ B2B Delta

Knowledge pack for **data engineering** and **ML feature management** on Databricks, supporting personalization and B2B data products.

## Scope

- Feature store architecture (offline + online)
- Unity Catalog feature tables
- Feature versioning and lineage for ML models
- Integration with MLP Personalization pipelines

## Enables capabilities

- [Feature Store](../../capabilities/data/feature-store.md) — `capability.data.feature-store`

## Modules

| Module | ID | Purpose |
|--------|-----|---------|
| Feature store design | `skill.data.feature-store-design` | Architecture and boundaries |
| Unity Catalog features | `skill.data.databricks-unity-catalog-features` | Implement feature tables |

## Platform context

- **Databricks** — primary compute for feature engineering and model training
- **Unity Catalog** — governance, lineage, and access control for feature tables
- **Use case:** MLP Personalization — consumer features, product affinity, recommendation inputs
