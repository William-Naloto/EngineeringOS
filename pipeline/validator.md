# Pipeline Stage: Validator

> **EKL v1 — Normative**

## Purpose

Reject invalid knowledge before compilation. Invalid knowledge MUST NOT reach runtime output.

## Inputs

- All knowledge nodes in build scope
- `schemas/knowledge-contract.schema.yaml`
- Build configuration (`confidence_minimum`, `status_filter`)

## Checks (MUST)

| Check | Failure action |
|-------|---------------|
| Contract schema valid | Reject node |
| Required fields present | Reject node |
| `id` globally unique | Reject build |
| `id` matches dot-notation pattern | Reject node |
| No cyclic dependencies | Reject build |
| `confidence: Unknown` + `status: stable` | Reject node (default) |
| `## Evidence` section present | Reject node |
| `owner` in OWNERS registry (stable only) | Warn / reject per config |
| `reviewed` set for `status: stable` | Reject node |
| Research nodes in compile scope | Reject build |

## Outputs

- `validation-report.json` — pass/fail per node with reasons
- Filtered node set (only valid nodes proceed)

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | All nodes valid |
| 1 | One or more nodes rejected |
| 2 | Build-breaking error (cycles, duplicate IDs) |
