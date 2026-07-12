# Pipeline Stage: Validator

> **EKL v1 — Reference implementation**  
> **Conforms to:** [spec/semantics.md §3](../spec/semantics.md#3-validation-semantics)

## Purpose

Reject invalid knowledge before compilation. Invalid knowledge MUST NOT reach runtime output.

## Inputs

- All knowledge nodes in build scope
- `schemas/knowledge-contract.schema.yaml`
- Build configuration (`confidence_minimum`, `status_filter`)

## Checks (MUST)

Per [spec/semantics.md §3.1](../spec/semantics.md#31-validator-must-checks):

| Check | Failure action |
|-------|---------------|
| Contract schema valid | Reject node |
| Required fields present | Reject node |
| `id` globally unique | Reject build |
| `id` matches `type.domain.name` pattern | Reject node |
| No cyclic dependencies | Reject build |
| `confidence: Unknown` + `status: stable` | Reject node (default) |
| `## Evidence` section present | Reject node |
| `reviewed` set when `status: stable` | Reject node |
| Research nodes in compile scope | Reject build |

## Checks (SHOULD)

Per [spec/semantics.md §3.2](../spec/semantics.md#32-validator-should-checks):

| Check | Failure action |
|-------|---------------|
| `owner` in ownership registry (stable only; `OWNERS.md` in reference implementation) | Warn or reject per config |
| `reviewed` stale (> 12 months, `lifecycle: maintained`) | Warn |
| Orphan skills (not referenced by any capability) | Warn |

## Outputs

- `validation-report.json` — pass/fail per node with reasons
- Filtered node set (only valid nodes proceed)

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | All nodes valid |
| 1 | One or more nodes rejected |
| 2 | Build-breaking error (cycles, duplicate IDs) |
