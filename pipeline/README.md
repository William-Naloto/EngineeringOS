# Build Pipeline

> **EKL v1** — Reference implementation  
> **Specification:** [spec/specification.md](../spec/specification.md)

```
Markdown source
    ↓ Parser
Canonical AST
    ↓ Validator
    ↓ Normalizer
    ↓ Dependency Resolver
    ↓ Compiler
    ↓ Optimizer
    ↓ Publisher
Runtime target output
```

The **canonical AST is the product.** Pipeline stages are transformations.

---

## Stages

| Stage | Spec |
|-------|------|
| Parser | Extract contract + body + evidence from Markdown |
| Validator | [validator.md](validator.md) |
| Normalizer | [normalizer.md](normalizer.md) |
| Dependency Resolver | [dependency-resolver.md](dependency-resolver.md) |
| Compiler | [compiler.md](compiler.md) |
| Optimizer | [optimizer.md](optimizer.md) |
| Publisher | [publisher.md](publisher.md) |

---

## CLI (reference implementation)

```bash
ekl build --target cursor --capability capability.engineering.review-pr --output ./my-project
ekl validate --all
ekl resolve --capability capability.engineering.review-pr
```

**Paused** until Standards Alignment milestone sign-off.

See [ROADMAP.md](../ROADMAP.md).
