# Reference Compiler: Claude Code

> **target_id:** `claude`  
> **ekl_abstract_target:** `ai-context-instructions`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for Claude Code. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Project instructions | Yes | `CLAUDE.md` |
| Commands | Yes | `.claude/commands/<name>.md` |
| MCP | Runtime (adapters/) | — |
| Subagents | Partial | Via CLAUDE.md sections |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| All resolved nodes | `CLAUDE.md` (ordered sections) |
| `capability.*` | `## Capability: <title>` section |
| `agent.*` | `## Agent Persona: <title>` section |
| `topic.*` | `### <title>` subsection |
| Commands from workflows | `.claude/commands/` |

## CLAUDE.md structure

```markdown
# Project Engineering Context
> Compiled from EngineeringOS <version> | EKL <ekl_version>

## Capabilities
...

## Agents
...

## Knowledge
...
```

## Context limits

| Limit | Value |
|-------|-------|
| CLAUDE.md recommended | < 32KB |
| Optimizer | Summarize topics when over budget |

## Implementation

`compilers/claude/`
