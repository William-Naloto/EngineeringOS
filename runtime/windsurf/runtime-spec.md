# Runtime Specification: Windsurf

> **runtime_id:** `windsurf`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Rules | Yes | `.windsurf/rules/` |
| Workflows | Partial | From `workflow.*` nodes |
| Memories | No native target | — |

## Output mapping

| EKS artifact | Windsurf output |
|--------------|-----------------|
| `agent.*` | Rule file |
| `capability.*` | Rule file with orchestration |
| `topic.*` | Rule file |

## Compiler location

`compilers/windsurf/`
