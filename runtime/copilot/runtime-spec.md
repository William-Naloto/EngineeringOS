# Runtime Specification: GitHub Copilot

> **runtime_id:** `copilot`  
> **runtime_version:** 1.0.0-draft  
> **eks_version:** 1.0

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Repository instructions | Yes | `.github/copilot-instructions.md` |
| Path-specific instructions | Yes | `.github/instructions/*.instructions.md` |
| Agent mode | Partial | Via copilot-instructions |

## Output mapping

| EKS artifact | Copilot output |
|--------------|----------------|
| Resolved graph | `.github/copilot-instructions.md` |
| `capability.*` | Top-level `##` sections |
| Domain-specific topics | `.github/instructions/<domain>.instructions.md` |

## Context limits

| Limit | Value |
|-------|-------|
| copilot-instructions.md | < 16KB recommended |

## Compiler location

`compilers/copilot/`
