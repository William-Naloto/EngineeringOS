# EngineeringOS Roadmap

> **Version:** 0.1.1  
> **Last updated:** 2026-07-12  
> **Model:** Sprint-based · Capability-centric · Competency-driven

**Architecture is frozen.** No more restructuring. Incremental evolution only — see [ADR 0014](adr/0014-knowledge-evolution-policy.md).

Progress is measured by **what makes you a better engineer tomorrow morning** — not by folder count or ADR count.

---

## Mental Model: Engineering Knowledge Compiler (EKC)

Internally, think of this project as an **Engineering Knowledge Compiler**:

```
Single versioned source of engineering knowledge
    ↓ validate + enrich (evidence, governance)
    ↓ compile
Cursor · Claude · Copilot · Obsidian · Confluence · MkDocs · NotebookLM · …
```

Every tool is a **compilation target**. The repository is canonical knowledge — not documentation, not Cursor rules.

**Classification:** Recommendation

---

## Organizational Model

```
Engineering (the discipline)
    ↓
Competencies (professional roles — Principal Architect, Principal Reviewer, …)
    ↓
Capabilities (what AI can accomplish — Review PR, Design Architecture, …)
    ↓
Projects (where knowledge is validated)
```

**Not:** Markdown → Markdown → Markdown.

**But:** Teach engineers through competencies that execute capabilities.

---

## Sprint Overview

| Sprint | Deliverable | Production outcome |
|--------|-------------|-------------------|
| **Sprint 1** | Principal Software Architect competency + Review PR capability | AI can review a pull request end-to-end |
| **Sprint 2** | Create Architecture capability | AI can produce ADRs and architecture docs |
| **Sprint 3** | Fabric Solution capability | AI can guide Fabric solution design |
| _Future_ | Additional competencies and capabilities | Incremental |

---

## Sprint 1 — Principal Software Architect + Review PR

**Goal:** ONE production-ready capability. Not twenty half-built skills.

### Capability target

**Review Pull Request** — complete, production-ready.

### Requires (via Principal Software Architect competency)

| Topic | Purpose |
|-------|---------|
| Documentation | Clear review comments |
| Architecture | Assess structural impact |
| Git | Commit and branch hygiene |
| Review | Review process and criteria |
| Testing | Test adequacy assessment |
| Security | Security-sensitive change detection |
| Naming | Convention compliance |
| Logging | Observability considerations |

### Competency target

**Principal Software Architect** — first production competency (~15–20 files).

Sets the quality bar for every competency that follows. Every other competency depends on it.

Location: [competencies/principal-software-architect/](competencies/principal-software-architect/)

### Sprint 1 exit criteria

- [ ] Principal Software Architect competency: `status: stable` on core topics
- [ ] `capability.engineering.review-pr`: production-ready
- [ ] Validation test prompts pass
- [ ] At least one compiler target produces usable output (Cursor or Claude)
- [ ] Capability Matrix shows Review PR as ✅

---

## Sprint 2 — Create Architecture

**Capability:** Design and document system architecture (ADRs, Mermaid, trade-offs).

**Requires:** Architecture, Documentation, Mermaid, ADR authoring, Review.

**Builds on:** Principal Software Architect competency from Sprint 1.

---

## Sprint 3 — Build Microsoft Fabric Solution

**Capability:** End-to-end Fabric solution guidance.

**Requires:** Fabric, SQL, Power BI, Python, Review, Documentation.

**Competency:** Principal Microsoft Fabric Engineer (future).

---

## Future Competencies (backlog)

| Competency | Enables capabilities |
|------------|---------------------|
| Principal Reviewer | Review PR, code quality audits |
| Principal Microsoft Fabric Engineer | Fabric monitoring, semantic models, pipelines |
| Principal Data Engineer | Feature store, pipelines, data quality |
| Principal SRE | Platform observability, incident RCA |

A competency contains architecture, patterns, anti-patterns, performance, security, governance, communication, documentation, troubleshooting — not a single Markdown file.

---

## Compilation Targets (not just IDEs)

| Target | Output | Priority |
|--------|--------|----------|
| Cursor | AI context (rules, skills) | Sprint 1 |
| Claude Code | CLAUDE.md instructions | Sprint 1 |
| GitHub Copilot | copilot-instructions.md | Sprint 2 |
| Obsidian | Vault notes | Backlog |
| NotebookLM | Source package | Backlog |
| Confluence | Pages | Backlog |
| MkDocs / Docusaurus | Documentation site | Backlog |
| GitHub Wiki | Wiki pages | Backlog |

Compilers generate **AI Context** — not merely "Cursor Rules."

---

## What We Will NOT Do

| Anti-pattern | Policy |
|--------------|--------|
| Another week on framework | Architecture frozen |
| Bulk skills without capability | Sprint delivers ONE capability |
| Update OS while developing | ADR 0014 |
| Measure progress by file count | Measure by production capabilities |
| Restructure folders | Incremental ADRs only |

---

## Released

| Version | Meaning |
|---------|---------|
| **v0.1.1** | Platform architecture frozen — tag applied |
| Sprint 1+ | Value delivery begins |
