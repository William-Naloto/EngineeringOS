# Reference Compiler: Cursor

> **target_id:** `cursor`  
> **ekl_abstract_target:** `ai-context-rules`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only — not implemented

Implements EKL v1 for the Cursor IDE. See [spec/specification.md](../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Rules | Yes | `.cursor/rules/<name>.mdc` |
| Skills | Yes | `.cursor/skills/<skill>/SKILL.md` |
| Commands | Yes | `.cursor/commands/<name>.md` |
| MCP | No (runtime adapter) | — |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| `agent.*` | `.cursor/rules/agent-<name>.mdc` |
| `topic.*` | `.cursor/rules/<topic-id>.mdc` |
| `capability.*` | `.cursor/rules/capability-<name>.mdc` |
| `skill.*` | `.cursor/skills/<name>/SKILL.md` |

## Implementation

`compilers/cursor/` (when built)
