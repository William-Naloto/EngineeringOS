# Runtime Specification: OpenHands

> **runtime_id:** `openhands`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Agent configuration | Yes | `config.yaml` or project instructions |
| Microagents | Partial | Compiled from `skill.*` nodes |
| MCP | Runtime (adapters/) | — |

## Output mapping

| EKS artifact | OpenHands output |
|--------------|------------------|
| `agent.*` | Agent persona config |
| `capability.*` | Task orchestration config |
| `skill.*` | Microagent definitions |

## Compiler location

`compilers/openhands/`
