# ADR 0015: Canonical Knowledge as Product

> **Status:** Accepted (amended 2026-07-12)  
> **Supersedes:** ADR 0015 draft title "Compiler as Product"  
> **Classification:** Recommendation

## Context

Sprint 1 began authoring competencies manually. Principal Engineer review rejected this: the value is **knowledge portability**, not more Markdown.

An earlier draft of this ADR stated "the compiler is the product." Further review corrected this:

> People don't care about Swagger Codegen. They care about the OpenAPI specification.

The compiler ecosystem grows around the specification. The compiler is **replaceable**. The knowledge is **not**.

## Decision

### The product model

```
Canonical Knowledge (permanent)  →  Build Pipeline (replaceable)  →  Runtime output (ephemeral)
```

| Layer | Permanence | Analogy |
|-------|-----------|---------|
| **EKL specification** | Permanent | OpenAPI spec |
| **Canonical AST** | Permanent | API schema |
| **Canonical knowledge** | Permanent | API definitions |
| **Compilers** | Replaceable | Swagger Codegen, openapi-generator |
| **Runtime output** | Ephemeral | Generated client SDK |

### Engineering Knowledge Language (EKL)

Define **EKL v1** as the normative specification:

- [SPECIFICATION.md](../SPECIFICATION.md) — entry point
- [spec/specification.md](../spec/specification.md) — normative rules
- [spec/contracts.md](../spec/contracts.md) — AST definition
- [spec/semantics.md](../spec/semantics.md) — operational semantics
- [spec/compatibility.md](../spec/compatibility.md) — versioning rules

**Not EKS** — avoids collision with Amazon Elastic Kubernetes Service.

### Spec / reference separation

| Layer | Location | Rule |
|-------|----------|------|
| Specification | `spec/` | MUST NOT mention vendor products |
| Reference implementation | `reference/` | Implements spec for concrete targets |
| Canonical knowledge | `competencies/`, etc. | EKL source documents |

### Canonical AST

```
Markdown → Parser → Canonical AST → Validator → Resolver → Optimizer → Compiler → Target
```

The **canonical AST is the product.** Everything else is transformation.

### Sprint pivot

| Sprint | Focus |
|--------|-------|
| **Standards Alignment** | EKL spec, standards review, spec/reference split |
| **Sprint 1A** | Reference compiler implementation |
| **Sprint 1B** | Competencies as compile inputs (deferred) |

### Standards-first rule

New concepts MUST compete with existing standards (OpenAPI, OCI, JSON Schema, SPDX, Terraform, K8s CRD) before being invented. See [spec/standards-alignment.md](../spec/standards-alignment.md).

## Consequences

- **Positive:** Credible, interoperable platform; third-party compilers possible; knowledge outlives any IDE
- **Negative:** Specification milestone before visible compiler output
- **Amendment:** "Compiler as product" → "Canonical knowledge as product" — compilers are the ecosystem, not the core

## References

- [SPECIFICATION.md](../SPECIFICATION.md)
- [spec/standards-alignment.md](../spec/standards-alignment.md)
- [ADR 0007](0007-compilation-model.md)
- [ADR 0014](0014-knowledge-evolution-policy.md)
