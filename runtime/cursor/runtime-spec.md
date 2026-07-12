# Runtime Specification: Cursor

> **runtime_id:** `cursor`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0  
> **Classification:** Recommendation

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Rules | Yes | `.cursor/rules/<name>.mdc` |
| Skills | Yes | `.cursor/skills/<skill>/SKILL.md` |
| Commands | Yes | `.cursor/commands/<name>.md` |
| Memories | Partial | Via rules (no native compile target) |
| MCP | No (runtime hook via adapters/) | — |
| Project context | Yes | Rules activation `globs`, `alwaysApply` |

## Output mapping

| EKS artifact | Cursor output |
|--------------|---------------|
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

## Compiler location

`compilers/cursor/`

## References

- [pipeline/compiler.md](../pipeline/compiler.md)
- [spec/EKS-v1.md](../spec/EKS-v1.md)
