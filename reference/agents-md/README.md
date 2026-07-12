# Reference Compiler: AGENTS.md

> **target_id:** `agents-md`  
> **ekl_abstract_target:** `ai-context-agents`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for AGENTS.md. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Repository agent instructions | Yes | `AGENTS.md` |
| Nested agents | Yes | `<subdir>/AGENTS.md` |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| Resolved graph | Root `AGENTS.md` |
| `capability.*` | `## Capabilities` section entries |
| `agent.*` | `## Agent Roles` section |
| `topic.*` | Knowledge sections |

## Format

Follow emerging AGENTS.md convention — single root file with structured sections compiled from EKL graph.

## Implementation

`compilers/agents-md/`
