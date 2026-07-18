# Capability Matrix

> **Version:** 0.1.1-RC1  
> **Last updated:** 2026-07-13  
> **Note:** Manual during RC1. Auto-generated from `provides` tokens at v0.2 (ADR 0012).

The Capability Matrix is the **single pane of glass** for EngineeringOS coverage. Instead of asking "what skills do we have?", agents and humans read this matrix.

Each capability maps to `provides` tokens declared in artifact Knowledge Contracts. Status reflects the highest maturity of artifacts providing that capability.

**Classification:** Recommendation

---

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ | Stable artifacts exist; capability is production-ready |
| 🚧 | Draft or experimental artifacts exist; in progress |
| ❌ | No artifacts; capability not started |
| 🔄 | Deprecated; migration in progress |

---

## Core Capabilities

| Capability | Status | Provides token | Pack / Source | Notes |
|------------|--------|----------------|---------------|-------|
| Architecture | 🚧 | `architecture-design` | `capability.engineering.design-architecture` | Experimental — competency wired |
| Documentation | ❌ | `documentation` | — | Standards planned |
| Naming conventions | ❌ | `naming` | — | Standards planned |
| Git workflow | ❌ | `git-workflow` | — | Standards planned |
| Code review | 🚧 | `code-review` | `capability.engineering.review-pr` | Experimental — competency wired |

---

## Domain Capabilities

| Capability | Status | Provides token | Pack / Source | Notes |
|------------|--------|----------------|---------------|-------|
| Python | ❌ | `python-development` | `pack.python` (planned) | — |
| SQL | ❌ | `sql-development` | — | — |
| Spark | ❌ | `spark-development` | — | — |
| Fabric | 🚧 | `fabric-development` | `pack.fabric` | 2 skills — monitoring |
| Power BI | ❌ | `powerbi-reporting` | `pack.fabric` (planned) | — |
| Databricks | 🚧 | `databricks-development` | `pack.data` | Feature store skills |
| Azure | ❌ | `azure-infrastructure` | — | — |
| New Relic | 🚧 | `newrelic-observability` | `pack.platform` | Dashboard + SLO skills |

---

## Capability Artifacts (orchestration recipes)

| Capability artifact | Status | Provides token | Path |
|--------------------|--------|----------------|------|
| Review PR | 🚧 | `pull-request-review` | capabilities/engineering/review-pr.md |
| Design Architecture | 🚧 | `architecture-design` | capabilities/engineering/design-architecture.md |
| Fabric Monitoring | 🚧 | `fabric-monitoring` | capabilities/fabric/monitoring.md |
| Platform Observability | 🚧 | `platform-observability` | capabilities/platform/observability.md |
| Feature Store | 🚧 | `feature-store` | capabilities/data/feature-store.md |

Index: [CAPABILITIES_INDEX.md](CAPABILITIES_INDEX.md)

## Platform Capabilities

| Capability | Status | Provides token | Source | Notes |
|------------|--------|----------------|--------|-------|
| Knowledge contracts | 🚧 | `knowledge-contract` | `KNOWLEDGE_CONTRACT.md` | v0.1.1-RC1 |
| Compilation (Cursor) | 🚧 | `compile-cursor` | `pack.engineering` / `runtime/compiler/cursor/` | MVP + delivery skill |
| Compilation (Obsidian) | 🚧 | `compile-obsidian` | `runtime/compiler/obsidian/` | MVP implemented |
| Compilation (Claude) | ❌ | `compile-claude` | `compilers/` | Planned v0.5 |
| Compilation (Copilot) | ❌ | `compile-copilot` | `compilers/` | Planned v0.5 |
| Validation pipeline | 🚧 | `validation` | `validation/` | Structure defined |
| Research capture | 🚧 | `knowledge-capture` | `capture/` + MCP `engineeringos.capture` | MVP operational |
| Agent personas | 🚧 | `agent-persona` | `agents/` | Placeholders only |

---

## Agent Personas

| Persona | Status | Agent ID | Notes |
|---------|--------|----------|-------|
| Architect | 🚧 | `agent.architect` | Placeholder |
| Reviewer | 🚧 | `agent.reviewer` | Placeholder |
| Principal Data Engineer | 🚧 | `agent.principal-data-engineer` | Placeholder |
| Senior Python Engineer | 🚧 | `agent.senior-python` | Placeholder |
| Product Manager | 🚧 | `agent.product-manager` | Placeholder |
| TPM | 🚧 | `agent.tpm` | Placeholder |
| Technical Writer | 🚧 | `agent.technical-writer` | Placeholder |
| SRE | 🚧 | `agent.sre` | Placeholder |

---

## How to Update

When an artifact reaches a new `status`, update the corresponding row:

1. Find the capability by matching `provides` tokens
2. Update status based on highest artifact maturity
3. Link to the pack or artifact path
4. Update `updated` in this file's header

Promotion to ✅ requires at least one `stable` artifact with matching `provides` token.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full process.

---

## Machine-Readable Export

A JSON export of this matrix is planned for routing engines.

**Target:** `schemas/capability-matrix.schema.yaml` + CI export in v0.5

**Classification:** Experimental idea
