# Pipeline Stage: Compiler

> **EKL v1 — Normative**

## Purpose

Transform resolved knowledge graph into runtime-specific output.

## Inputs

- `resolved-graph.json`
- `runtime/<target>/runtime-spec.md`
- Compiler configuration

## Algorithm (MUST)

1. Load runtime spec for target `T`
2. For each node in resolved order, apply target mapping rules
3. Transform contract + body → runtime format
4. Write output files to configured `output_dir`
5. Emit `compile-manifest.json` listing source ID → output path + version

## Rules

- Compiler MUST NOT modify canonical source
- Compiler MUST declare `ekl_version` and `compiler_version` in output manifest
- Deprecated nodes MUST include migration notice if runtime spec requires

## Per-target implementations

| Target | Location | Status |
|--------|----------|--------|
| Cursor | `compilers/cursor/` | Not implemented |
| Claude | `compilers/claude/` | Not implemented |
| Copilot | `compilers/copilot/` | Not implemented |
| AGENTS.md | `compilers/agents-md/` | Not implemented |
| OpenHands | `compilers/openhands/` | Not implemented |
| Roo | `compilers/roo/` | Not implemented |
| Windsurf | `compilers/windsurf/` | Not implemented |

## Output types

Compilers produce **AI Context** — not merely rules files. See runtime specs.
