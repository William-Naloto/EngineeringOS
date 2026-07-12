# Reference Compiler: Roo Code

> **target_id:** `roo`  
> **ekl_abstract_target:** `ai-context-rules`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for Roo Code. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Custom modes | Yes | `.roo/modes/` or rules |
| Rules | Yes | `.roo/rules/` |
| MCP | Runtime | — |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| `agent.*` | Custom mode definition |
| `capability.*` | Mode orchestration |
| `topic.*` | Rule files |

## Implementation

`compilers/roo/`
