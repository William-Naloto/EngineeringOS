# Runtime Specification: Roo Code

> **runtime_id:** `roo`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Custom modes | Yes | `.roo/modes/` or rules |
| Rules | Yes | `.roo/rules/` |
| MCP | Runtime | — |

## Output mapping

| EKS artifact | Roo output |
|--------------|------------|
| `agent.*` | Custom mode definition |
| `capability.*` | Mode orchestration |
| `topic.*` | Rule files |

## Compiler location

`compilers/roo/`
