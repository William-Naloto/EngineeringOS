# Runtime Specification: Claude Code

> **runtime_id:** `claude`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Project instructions | Yes | `CLAUDE.md` |
| Commands | Yes | `.claude/commands/<name>.md` |
| MCP | Runtime (adapters/) | — |
| Subagents | Partial | Via CLAUDE.md sections |

## Output mapping

| EKS artifact | Claude output |
|--------------|---------------|
| All resolved nodes | `CLAUDE.md` (ordered sections) |
| `capability.*` | `## Capability: <title>` section |
| `agent.*` | `## Agent Persona: <title>` section |
| `topic.*` | `### <title>` subsection |
| Commands from workflows | `.claude/commands/` |

## CLAUDE.md structure

```markdown
# Project Engineering Context
> Compiled from EngineeringOS <version> | EKS <eks_version>

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

## Compiler location

`compilers/claude/`
