# Pipeline Stage: Normalizer

> **EKL v1 — Reference extension (MAY implement)**  
> **Position:** After Validator, before Resolver — see [spec/specification.md §5.2](../spec/specification.md#52-reference-implementation-extensions)

## Purpose

Transform knowledge nodes into canonical form for compilation.

## Operations (MUST)

| Operation | Description |
|-----------|-------------|
| ID canonicalization | Lowercase domains; hyphenate names |
| Classification normalization | Map aliases → `Fact` \| `BestPractice` \| `Recommendation` \| `Experimental` |
| Date normalization | ISO 8601 for `updated`, `reviewed` |
| Path resolution | Resolve relative links to absolute repo paths |
| Overlay merge | Apply `.engineeringos/` overrides by artifact `id` |

## Operations (SHOULD)

| Operation | Description |
|-----------|-------------|
| Heading normalization | Consistent heading levels for compiler templates |
| Evidence table validation | Required columns present |
| Tag deduplication | Unique sorted `tags` |

## Outputs

- `normalized-graph.json` — canonical node representations
- Merge log (overlay applications)

## Invariants

Normalizer MUST NOT alter semantic content. Structure and metadata only.
