# Build Pipeline

> **EKL v1** — Reference implementation  
> **Specification:** [spec/specification.md](../spec/specification.md)

Conforms to the normative pipeline in [spec/specification.md §5.1](../spec/specification.md#51-parse-pipeline). Reference-only extensions are labeled below.

## Normative pipeline

```
Markdown source
    ↓ Parser
Canonical AST
    ↓ Validator
Validated AST graph
    ↓ Resolver
Resolved AST graph
    ↓ Optimizer (optional)
Optimized AST graph
    ↓ Compiler
Compilation target output
```

## Reference implementation (full)

The reference pipeline inserts optional extensions documented in [spec/specification.md §5.2](../spec/specification.md#52-reference-implementation-extensions):

```
Markdown source
    ↓ Parser
Canonical AST
    ↓ Validator
    ↓ Normalizer          ← reference extension (MAY)
Validated AST graph
    ↓ Resolver
Resolved AST graph
    ↓ Optimizer (optional)
Optimized AST graph
    ↓ Compiler
    ↓ Publisher           ← reference extension (MAY)
Compilation target output
```

The **canonical AST is the product.** Pipeline stages are transformations.

---

## Stages

| Stage | Normative | Spec |
|-------|-----------|------|
| Parser | MUST | Extract contract + body + evidence from Markdown |
| Validator | MUST | [validator.md](validator.md) |
| Normalizer | MAY (reference) | [normalizer.md](normalizer.md) |
| Resolver | MUST | [dependency-resolver.md](dependency-resolver.md) |
| Optimizer | SHOULD (optional) | [optimizer.md](optimizer.md) |
| Compiler | MUST | [compiler.md](compiler.md) |
| Publisher | MAY (reference) | [publisher.md](publisher.md) |

---

## CLI (reference implementation)

```bash
ekl build --target cursor --capability capability.engineering.review-pr --output ./my-project
ekl validate --all
ekl resolve --capability capability.engineering.review-pr
```

**Paused** until Standards Alignment milestone sign-off.

See [ROADMAP.md](../ROADMAP.md).
