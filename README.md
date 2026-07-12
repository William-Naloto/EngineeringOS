# EngineeringOS

> **An AI Engineering Operating System** — versioned, vendor-agnostic knowledge for AI-assisted software engineering.

**Version:** 0.1.1-RC1 (release candidate — not tagged)  
**Status:** Platform architecture frozen pending RC1 sign-off.

---

## 15-minute onboarding

**Start here:** [QUICKSTART.md](QUICKSTART.md)

---

## What is this?

Not an app. Not a prompt library. A **governed platform**:

```
Capability (recipe) → Agent (who) → Skill (brick) → Workflow
         ↑
    standards/ (stable foundation)
         ↑
    research/ → capture/ → validation/ → publish
```

Compilers transform canonical knowledge into every IDE format.

---

## Key documents

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | 15-minute onboarding |
| [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) | Constitution |
| [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md) | Universal artifact spec |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Platform layout |
| [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) | Coverage dashboard |
| [releases/v0.1.1-RC1.md](releases/v0.1.1-RC1.md) | RC1 checklist |

---

## Platform structure

```
EngineeringOS/
├── capabilities/     # Recipes (router loads first)
├── agents/           # Personas (who)
├── standards/        # Stable conventions
├── packs/            # Self-contained domain bundles
├── research/         # Raw notes (never loaded in prod)
├── capture/          # Learning pipeline (+ future /capture)
├── validation/       # Quality gates
├── compilers/        # Source → IDE
├── adr/              # 13 architecture decisions
└── routing/          # Capability-first loading
```

---

## RC1 status

| Check | Status |
|-------|--------|
| Stress test | ✅ [docs/architectural-stress-test.md](docs/architectural-stress-test.md) |
| 15-min onboarding | ✅ QUICKSTART.md |
| ADRs for all decisions | ✅ 13 ADRs |
| Capability routing | ✅ ADR 0009 |
| Evidence + confidence | ✅ ADR 0010 |
| Scale mitigations documented | ✅ ADR 0012 |
| **Tag v0.1.1** | ⏳ Awaiting sign-off |

---

## Roadmap (capability-centric)

```
v0.2 Core Runtime    → universal standards (git, review, docs…)
v0.3 Technology Packs → fabric, python, databricks…
v0.4 Capabilities     → orchestration recipes
v0.5 Compilers        → one source, every IDE
```

See [ROADMAP.md](ROADMAP.md).

---

## For AI agents

1. [QUICKSTART.md](QUICKSTART.md) → [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md)
2. Match **capabilities** first ([CAPABILITIES_INDEX.md](CAPABILITIES_INDEX.md))
3. Resolve orchestrated agents + skills — never load entire repo
4. Cite **Evidence** — state confidence level — never say "I think…"
