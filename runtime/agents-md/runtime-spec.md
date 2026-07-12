# Runtime Specification: AGENTS.md

> **runtime_id:** `agents-md`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Repository agent instructions | Yes | `AGENTS.md` |
| Nested agents | Yes | `<subdir>/AGENTS.md` |

## Output mapping

| EKS artifact | AGENTS.md output |
|--------------|------------------|
| Resolved graph | Root `AGENTS.md` |
| `capability.*` | `## Capabilities` section entries |
| `agent.*` | `## Agent Roles` section |
| `topic.*` | Knowledge sections |

## Format

Follow emerging AGENTS.md convention — single root file with structured sections compiled from EKS graph.

## Compiler location

`compilers/agents-md/`
