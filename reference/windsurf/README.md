# Reference Compiler: Windsurf

> **target_id:** `windsurf`  
> **ekl_abstract_target:** `ai-context-rules`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for Windsurf. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Rules | Yes | `.windsurf/rules/` |
| Workflows | Partial | From `workflow.*` nodes |
| Memories | No native target | — |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| `agent.*` | Rule file |
| `capability.*` | Rule file with orchestration |
| `topic.*` | Rule file |

## Implementation

`compilers/windsurf/`
