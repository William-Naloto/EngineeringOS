# EngineeringOS Vision

> **Version:** 0.1.1  
> **Status:** Active  
> **Last updated:** 2026-07-12

---

## What EngineeringOS Is

An **AI Engineering Operating System** — a versioned, vendor-agnostic knowledge **platform** that improves AI-assisted software engineering across any IDE.

It is not an application. It is not a prompt library. It is a **governed platform** with:

- Universal [Knowledge Contracts](KNOWLEDGE_CONTRACT.md) for every artifact
- Self-contained, independently publishable [packs](packs/)
- [Agent personas](agents/) distinct from skills
- [Compilers](compilers/) that generate IDE output from a single source of truth
- A [capture pipeline](capture/) that turns project experience into validated knowledge

---

## North Star

> Every AI-assisted engineering action is guided by **relevant, versioned, traceable knowledge** — loaded only when needed, validated before publication, and portable across every tool.

---

## Core Principles

See [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) for the full constitution. Summary:

1. Maintainability over cleverness
2. Evidence over assumptions
3. Traceable recommendations
4. Small composable modules
5. Documentation as part of the feature
6. Design for replacement
7. Automate before optimizing manually
8. Capture only after validation

---

## Platform vs Documentation Repository

EngineeringOS is intentionally designed as a **software platform**, not a documentation repo:

| Platform feature | Purpose |
|-----------------|---------|
| Knowledge Contract | Uniform parsing for any AI |
| Compilers | One source → many IDEs |
| Validation | Quality gates before promotion |
| Capture pipeline | Projects improve the OS |
| Capability Matrix | Coverage at a glance |
| ADRs | Architectural traceability |

**Classification:** Recommendation

---

## What Success Looks Like

| Milestone | Target |
|-----------|--------|
| **v0.1.1** | Platform architecture finalized | ← current |
| **v0.2** | First stable standards and foundation pack |
| **v0.5** | Working compilers + routing |
| **v1.0** | Multi-IDE production adoption |
| **v2.0** | Community-contributed domain packs |

---

## Non-Goals

- AI agent runtime or orchestration
- Model hosting
- Replacing IDE-native features
- Technology-specific content in global standards

**Classification:** Verified fact

---

## Guiding Question

> *Does this belong in a global standard, a domain pack, or a project overlay? Has it been validated? Can an agent load only this artifact?*

If any answer is unclear, it is not ready for publication.
