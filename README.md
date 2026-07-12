# EngineeringOS

> **Reference implementation of EKL v1** — Engineering Knowledge Language

**Version:** v0.1.1 (tagged) · **Milestone:** Standards Alignment

---

## Start here

| Document | Purpose |
|----------|---------|
| **[SPECIFICATION.md](SPECIFICATION.md)** | **EKL normative specification** |
| [spec/standards-alignment.md](spec/standards-alignment.md) | Industry standard mapping |
| [ROADMAP.md](ROADMAP.md) | Milestones |
| [QUICKSTART.md](QUICKSTART.md) | 15-minute onboarding |

---

## The product model

```
Canonical Knowledge (EKL)  =  permanent   ← the product
Compilers                  =  replaceable  ← the ecosystem
Runtime output             =  ephemeral   ← generated
```

Like OpenAPI → codegen. The specification outlives any compiler.

```
Markdown → Parser → Validator → Resolver → Optimizer (optional) → Compiler → Target
```

**EKL** — Engineering Knowledge Language. Not **EKS** (Amazon collision).

---

## Repository layout

```
EngineeringOS/
├── SPECIFICATION.md    # EKL entry point
├── spec/               # Vendor-neutral (MUST NOT name IDEs)
├── reference/          # Reference compilers per target
├── competencies/       # Canonical knowledge
├── pipeline/           # Build pipeline
└── compilers/          # Compiler implementations
```

---

## Status

| Milestone | Status |
|-----------|--------|
| v0.1.1 platform frozen | ✅ [GitHub](https://github.com/William-Naloto/EngineeringOS/releases/tag/v0.1.1) |
| EKL specification | ✅ Draft |
| Standards alignment | 🚧 Current |
| Compiler implementation | ⏸ Paused |

---

## For AI agents

1. [SPECIFICATION.md](SPECIFICATION.md) — normative rules
2. [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) — constitutional constraints
3. Match capabilities first — never load entire repository
4. Cite Evidence — state confidence — never say "I think…"
