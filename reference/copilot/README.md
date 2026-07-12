# Reference Compiler: GitHub Copilot

> **target_id:** `copilot`  
> **ekl_abstract_target:** `ai-context-instructions`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification only

Implements EKL v1 for GitHub Copilot. See [spec/specification.md](../../spec/specification.md).

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Repository instructions | Yes | `.github/copilot-instructions.md` |
| Path-specific instructions | Yes | `.github/instructions/*.instructions.md` |
| Agent mode | Partial | Via copilot-instructions |

## EKL artifact mapping

| EKL artifact | Output |
|--------------|--------|
| Resolved graph | `.github/copilot-instructions.md` |
| `capability.*` | Top-level `##` sections |
| Domain-specific topics | `.github/instructions/<domain>.instructions.md` |

## Context limits

| Limit | Value |
|-------|-------|
| copilot-instructions.md | < 16KB recommended |

## Implementation

`compilers/copilot/`
