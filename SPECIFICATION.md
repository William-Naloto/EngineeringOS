# EKL Specification

> **Engineering Knowledge Language (EKL) v1.0**  
> **Status:** Draft  
> **Date:** 2026-07-12

This is the **entry point** for the normative specification. Everything else in this repository references these documents.

**The product is canonical knowledge.** Compilers are replaceable. The specification is permanent.

---

## Specification documents

| Document | Purpose |
|----------|---------|
| [spec/specification.md](spec/specification.md) | Scope, terminology, normative rules, artifact model |
| [spec/contracts.md](spec/contracts.md) | Knowledge Contract — the canonical AST node |
| [spec/semantics.md](spec/semantics.md) | Dependency, routing, validation, lifecycle semantics |
| [spec/compatibility.md](spec/compatibility.md) | Versioning and backward compatibility rules |
| [spec/standards-alignment.md](spec/standards-alignment.md) | Mapping to existing industry standards |

---

## Reference implementation

EngineeringOS is the **reference implementation** of EKL v1. It is not the specification.

| Layer | Location | Contains |
|-------|----------|----------|
| **Specification** | `spec/` | Vendor-neutral; MUST NOT mention Cursor, Claude, or any IDE |
| **Reference compilers** | `reference/` | Cursor, Claude, Copilot, and other compilation targets |
| **Canonical knowledge** | `competencies/`, `capabilities/`, etc. | EKL source documents |

---

## Compilation model

```
Markdown source
    ↓ Parser
Canonical AST (Knowledge Contract + body + evidence)
    ↓ Validator
    ↓ Resolver
    ↓ Optimizer (optional)
    ↓ Compiler (reference implementation)
Runtime target output
```

The **canonical AST is the product.** Everything else is transformation.

---

## Normative language

All specification documents use [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) keywords: **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY**.

---

## Naming

| Term | Meaning |
|------|---------|
| **EKL** | Engineering Knowledge Language — the specification |
| **EngineeringOS** | Reference implementation and canonical knowledge repository |
| **EKC** | Engineering Knowledge Compiler — informal name for the compiler ecosystem |

**EKL** is used instead of "EKS" to avoid collision with Amazon Elastic Kubernetes Service.

---

## Related

- [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md) — human-readable contract guide (references spec)
- [ADR 0015](adr/0015-canonical-knowledge-as-product.md) — architectural decision
- [pipeline/README.md](pipeline/README.md) — build pipeline (reference implementation)
