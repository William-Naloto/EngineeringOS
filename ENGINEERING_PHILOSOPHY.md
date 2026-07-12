# Engineering Philosophy

> **Version:** 0.1.1  
> **Status:** Active — constitutional document  
> **Last updated:** 2026-07-12

This document is the **constitution** of EngineeringOS. Every pack, skill, standard, agent persona, and workflow inherits these principles. When in doubt, defer to this document.

**Classification:** Recommendation (governance constraint for all future content)

---

## Purpose

Engineering philosophy is not coding standards and not documentation style. It is the set of **beliefs and trade-offs** that guide how we build, maintain, and evolve engineering knowledge for AI-assisted software development.

---

## Core Beliefs

### 1. Optimize for maintainability over cleverness

Prefer solutions that future contributors (human and AI) can understand, modify, and replace without archaeology.

**Classification:** Best practice

### 2. Prefer evidence over assumptions

Claims in EngineeringOS must be classified. Unverified assertions are labeled explicitly. Research precedes polished knowledge.

**Classification:** Recommendation (architectural constraint)

### 3. Every recommendation must be traceable

Knowledge flows from research → review → pack. Every stable artifact declares its owner, version, dependencies, and review history via the [Knowledge Contract](KNOWLEDGE_CONTRACT.md).

**Classification:** Recommendation

### 4. Small composable modules beat monoliths

One skill, one responsibility. One pack, one publishable domain. Monolithic prompts and rules do not scale.

**Classification:** Best practice

### 5. Documentation is part of the feature, not an afterthought

If knowledge cannot be documented in a parseable contract, it is not ready for publication.

**Classification:** Best practice

### 6. Design for replacement, not permanence

Modules are versioned, deprecatable, and supersedeable. Nothing in EngineeringOS is permanent by default.

**Classification:** Recommendation

### 7. Automate repetitive work before optimizing manual work

Compilers transform canonical knowledge into IDE formats. Validation runs before promotion. Capture pipelines reduce manual curation.

**Classification:** Recommendation

### 8. Capture knowledge only after it has been validated

Raw research lives in `research/`. Polished knowledge lives in `packs/`. The gap between them is intentional.

**Classification:** Recommendation (architectural constraint)

---

## Trade-off Principles

| When choosing between… | Prefer… | Because… |
|------------------------|---------|----------|
| Speed vs. correctness | Correctness (with explicit classification) | Wrong knowledge scales faster than right knowledge |
| Generality vs. specificity | Generality in standards; specificity in packs | Standards are stable; skills evolve |
| Human readability vs. machine parseability | Both — structured Markdown + YAML contract | Neither audience can be sacrificed |
| Centralization vs. independence | Independent packs, centralized contracts | Packs publish alone; contracts keep coherence |
| IDE-native vs. vendor-agnostic | Vendor-agnostic source, compiled output | One knowledge base serves every AI tool |

**Classification:** Recommendation

---

## What We Reject

| Anti-pattern | Why |
|--------------|-----|
| Monolithic rule files | Degrade as they grow; agents load irrelevant context |
| Undocumented magic behavior | Breaks traceability and trust |
| Technology assumptions in global standards | Couples stable knowledge to volatile tooling |
| Copy-paste knowledge across packs | Creates drift; use dependencies and references |
| Publishing research as stable knowledge | Skips validation; poisons downstream agents |
| Manual IDE rule maintenance | Duplicates effort; compilers are the source of truth |

**Classification:** Recommendation

---

## Agent Behavior Inheritance

Every agent persona in `agents/` must align with this philosophy. When an agent's instructions conflict with this document, **this document wins** unless an ADR explicitly supersedes it.

---

## Amendment Process

Changes to this document require:

1. A pull request with rationale
2. Maintainer approval
3. An ADR if the change alters a constitutional principle
4. Version bump in the document header

**Classification:** Recommendation

---

## Relationship to Other Documents

| Document | Relationship |
|----------|-------------|
| [VISION.md](VISION.md) | States *what* EngineeringOS is |
| [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) | States *how we think* (this document) |
| [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md) | States *how artifacts are structured* |
| [ARCHITECTURE.md](ARCHITECTURE.md) | States *how the platform is organized* |
| [GOVERNANCE.md](GOVERNANCE.md) | States *how changes are governed* |
