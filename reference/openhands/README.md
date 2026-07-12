# Reference Compiler: OpenHands

> **target_id:** `openhands`  
> **ekl_abstract_target:** `ai-context-agents`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for OpenHands. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Agent configuration | Yes | `config.yaml` or project instructions |
| Microagents | Partial | Compiled from `skill.*` nodes |
| MCP | Runtime (adapters/) | — |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| `agent.*` | Agent persona config |
| `capability.*` | Task orchestration config |
| `skill.*` | Microagent definitions |

## Implementation

`compilers/openhands/`
