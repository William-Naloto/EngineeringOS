# Pipeline Stage: Optimizer

> **EKL v1 — Normative (SHOULD implement; optional stage)**

## Purpose

Reduce the resolved AST graph to fit runtime context limits without losing semantic content. Runs **after Resolver, before Compiler** per [spec/specification.md §5.1](../spec/specification.md#51-parse-pipeline).

## Strategies

| Strategy | Description |
|----------|-------------|
| **Deduplication** | Merge identical evidence tables |
| **Summarization** | Collapse topic bodies to contract + summary when over token budget |
| **Priority ordering** | Capability > agent > competency topic > skill |
| **Truncation** | Drop lowest-priority nodes when hard cap exceeded (with warning) |
| **Reference linking** | Replace full content with ID reference where runtime supports lookup |

## Inputs

- `resolved-graph.json`
- Reference target spec `context_limit_tokens` (if defined) from `reference/<target>/`
- Build config `optimization_level`: `none` \| `standard` \| `aggressive`

## Outputs

- `optimized-graph.json` — graph passed to Compiler
- `optimization-report.json` — what was deduplicated, truncated, or summarized

## Rules

Optimizer MUST NOT drop nodes with `status: stable` without logging a warning.
Optimizer MUST preserve all contract metadata even when body is summarized.
