# Pipeline Stage: Optimizer

> **EKL v1 — Normative (SHOULD implement)**

## Purpose

Minify compiled output to fit runtime context limits without losing semantic content.

## Strategies

| Strategy | Description |
|----------|-------------|
| **Deduplication** | Merge identical evidence tables |
| **Summarization** | Collapse topic bodies to contract + summary when over token budget |
| **Priority ordering** | Capability > agent > competency topic > skill |
| **Truncation** | Drop lowest-priority nodes when hard cap exceeded (with warning) |
| **Reference linking** | Replace full content with ID reference where runtime supports lookup |

## Inputs

- Compiled output files
- Runtime spec `context_limit_tokens` (if defined)
- Build config `optimization_level`: `none` \| `standard` \| `aggressive`

## Outputs

- Optimized output files (in-place or separate `optimized/` dir)
- `optimization-report.json` — what was deduplicated, truncated, or summarized

## Rules

Optimizer MUST NOT drop nodes with `status: stable` without logging a warning.
Optimizer MUST preserve all contract metadata even when body is summarized.
