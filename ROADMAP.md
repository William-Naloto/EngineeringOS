# EngineeringOS Roadmap

> **Last updated:** 2026-07-12  
> **Current milestone:** Standards Alignment (pause implementation)

**Architecture frozen.** [ADR 0014](adr/0014-knowledge-evolution-policy.md) · [ADR 0015](adr/0015-canonical-knowledge-as-product.md)

**The product is canonical knowledge (EKL).** Compilers are replaceable.

---

## What this is

**EKL** — Engineering Knowledge Language. An open engineering knowledge standard.

```
Markdown  →  Parser  →  Canonical AST  →  Validator  →  Resolver  →  Optimizer (optional)  →  Compiler  →  Target
```

Like OpenAPI → codegen. Like TypeScript → tsc. Like Terraform → provider.

**Not EKS** — avoids Amazon Elastic Kubernetes Service collision.

---

## Milestone sequence

| Milestone | Focus | Status |
|-----------|-------|--------|
| **v0.1.1** | Platform frozen | ✅ Tagged |
| **Standards Alignment** | EKL spec, RFC 2119, spec/reference split | 🚧 Current |
| **Sprint 1A** | Reference compiler implementation | ⏸ Paused |
| **Sprint 1B** | Competencies as compile inputs | Deferred |
| **Sprint 2** | EKL v1 ratification + CI validation | Planned |
| **Sprint 3** | Review PR capability (compiled) | Planned |

---

## Standards Alignment (current)

**Objective:** Map EKL against existing standards. No new features.

| Deliverable | Status |
|-------------|--------|
| [SPECIFICATION.md](SPECIFICATION.md) | ✅ |
| [spec/specification.md](spec/specification.md) | ✅ |
| [spec/contracts.md](spec/contracts.md) | ✅ |
| [spec/semantics.md](spec/semantics.md) | ✅ |
| [spec/compatibility.md](spec/compatibility.md) | ✅ |
| [spec/standards-alignment.md](spec/standards-alignment.md) | ✅ |
| [reference/](reference/) — vendor targets | ✅ |
| ADR 0015 amended — Canonical Knowledge as Product | ✅ |
| EKS → EKL rename | ✅ |
| Implementation paused (Sprint 1A on hold) | ⏸ |
| Review sign-off (resumes Sprint 1A) | ⏳ Pending |

**Exit criteria:** Standards alignment reviewed and signed off. Then resume Sprint 1A.

---

## Sprint 1A — Reference Compiler (paused)

```bash
ekl build --target cursor --capability capability.engineering.review-pr
ekl build --target claude ...
```

Targets: Cursor, Claude, AGENTS.md, Copilot, OpenHands, Roo, Windsurf — see [reference/](reference/).

---

## Sprint 1B — Principal Architect (deferred)

15 topic drafts in `competencies/principal-software-architect/` are **compile inputs**.

One `ekl build` → all targets. Do not write competencies manually per IDE.

---

## Standards-first rule

Before any new concept, ask: Does OpenAPI, OCI, JSON Schema, SPDX, Terraform, or K8s CRD already solve this?

See [spec/standards-alignment.md](spec/standards-alignment.md).

---

## Anti-patterns

| ❌ | ✅ |
|----|-----|
| Invent without checking standards | Reuse / Extend / Document divergence |
| Name it EKS | EKL |
| Compiler is the product | Canonical knowledge is the product |
| Spec mentions Cursor | `reference/cursor/` only |
| Write competencies manually | Compile once |
