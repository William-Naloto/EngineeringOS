# Reference Compiler: Cursor

> **target_id:** `cursor`  
> **ekl_abstract_target:** `ai-context-rules`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification + MVP runtime compiler (`runtime/compiler/cursor/`)

Implements EKL v1 for the Cursor IDE. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Rules | Yes | `.cursor/rules/<name>.mdc` |
| Skills | Yes | `.cursor/skills/<skill>/SKILL.md` |
| Commands | Yes | `.cursor/commands/<name>.md` |
| Memories | Partial | Via rules (no native compile target) |
| MCP | No (runtime adapter) | — |
| Project context | Yes | Rules activation `globs`, `alwaysApply` |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| `agent.*` | `.cursor/rules/agent-<name>.mdc` |
| `competency.*` / `topic.*` | `.cursor/rules/<topic-id>.mdc` |
| `capability.*` | `.cursor/rules/capability-<name>.mdc` + orchestration metadata |
| `skill.*` | `.cursor/skills/<name>/SKILL.md` |

## Rule file format (.mdc)

```yaml
---
description: <from contract provides + title>
globs: <from triggers file patterns if applicable>
alwaysApply: false
---
<compiled body — Evidence preserved>
```

## Context limits

| Limit | Value | Optimizer action |
|-------|-------|------------------|
| Recommended rules | ≤ 20 active | Priority by capability |
| Max rule size | ~500 lines | Summarize via optimizer |

## Implementation

Runtime compiler: `runtime/compiler/cursor/`  
CLI: `npm run export:cursor`  
MCP: `engineeringos.compile { target: "cursor", capability: "..." }`

## References

- [pipeline/compiler.md](../../pipeline/compiler.md)
- [spec/specification.md](../../spec/specification.md)
