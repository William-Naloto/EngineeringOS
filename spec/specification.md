# EKL v1.0 — Specification

> **Engineering Knowledge Language**  
> **Version:** 1.0.0-draft  
> **Status:** Draft  
> **Date:** 2026-07-12

This document is the **normative specification** for the Engineering Knowledge Language (EKL). Implementations claiming EKL v1 compliance MUST conform to this document and its companion specifications.

EngineeringOS is the reference implementation. Third parties MAY implement parsers, validators, resolvers, optimizers, and compilers against EKL without forking EngineeringOS.

**Analogy:** OpenAPI describes APIs. OCI describes containers. SPDX describes licenses. **EKL describes engineering knowledge.**

Companion documents:

- [contracts.md](contracts.md) — AST node definition
- [semantics.md](semantics.md) — operational semantics
- [compatibility.md](compatibility.md) — versioning rules
- [standards-alignment.md](standards-alignment.md) — industry standard mapping

---

## 1. Scope

### 1.1 In scope

EKL v1 defines:

1. Artifact model and canonical AST
2. Metadata contract (Knowledge Contract)
3. Dependency and orchestration semantics
4. Routing semantics
5. Validation semantics
6. Lifecycle states
7. Versioning and backward compatibility
8. Compilation target abstraction (vendor-neutral)
9. Extensibility rules

### 1.2 Out of scope

EKL v1 does NOT define:

- Domain-specific engineering knowledge (Fabric, Python, security practices, etc.)
- Implementation language for compilers
- IDE, editor, or AI product behavior
- Specific output file formats (defined in reference implementations per target)

---

## 2. Terminology

| Term | Definition |
|------|------------|
| **Artifact** | A versioned unit of engineering knowledge with a Knowledge Contract |
| **Knowledge Node** | Canonical AST unit: Contract + Body + Evidence |
| **Canonical AST** | Vendor-neutral parsed representation of all knowledge nodes |
| **Competency** | Professional role knowledge base (`competency.*`) |
| **Capability** | Orchestration recipe (`capability.*`) |
| **Provides token** | Atomic capability flag in contract `provides` field |
| **Reference implementation** | EngineeringOS — demonstrates EKL compliance |
| **Compilation target** | Abstract runtime consumer of compiled output |
| **Research artifact** | Unvalidated notes; excluded from compilation |

---

## 3. Normative language

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** in this specification are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

---

## 4. Artifact model

### 4.1 Artifact types

| Type prefix | Compilable | Description |
|-------------|------------|-------------|
| `competency.` | Yes | Professional role knowledge |
| `capability.` | Yes | Orchestration recipe |
| `agent.` | Yes | Persona lens |
| `topic.` | Yes | Competency topic unit |
| `skill.` | Yes | Atomic skill |
| `workflow.` | Yes | Sequenced process |
| `standard.` | Yes | Cross-domain convention |
| `template.` | Yes | Reusable template |
| `pack.` | Manifest only | Bundle manifest |
| Research | **No** | Pre-validation notes |

### 4.2 Identifier rules

- Artifacts MUST have a globally unique `id` using dot notation: `type.domain.name`
- Identifiers MUST use lowercase kebab-case within segments
- Identifiers MUST NOT change once `status: stable`
- Superseded identifiers MUST set `replaces` to the successor `id`

### 4.3 Layer hierarchy

```
Research (unvalidated)
    ↓ capture pipeline
Competencies / Standards
    ↓ dependencies
Skills / Topics
    ↓ orchestrated by
Capabilities
    ↓ applied through
Agents
    ↓ sequenced by
Workflows
```

Research artifacts MUST NOT be compiled into runtime outputs.

---

## 5. Canonical AST

The canonical AST is the **product** of EKL. See [contracts.md](contracts.md).

```
KnowledgeNode := ContractMetadata + MarkdownBody + EvidenceSection
```

Parsers MUST produce canonical AST from Markdown source. Compilers MUST consume canonical AST — not raw Markdown.

### 5.1 Parse pipeline

```
Markdown source
    ↓ Parser (extract YAML frontmatter + body)
Canonical AST node
    ↓ Validator
Validated AST graph
    ↓ Resolver (dependency expansion)
Resolved AST graph
    ↓ Optimizer (optional)
Optimized AST graph
    ↓ Compiler (reference implementation)
Compilation target output
```

### 5.2 Reference implementation extensions

The normative pipeline (§5.1) defines EKL compliance. The [reference implementation](../pipeline/README.md) MAY add stages that do not change the normative order of Parser, Validator, Resolver, Optimizer, and Compiler:

| Stage | Position | Requirement | Purpose |
|-------|----------|-------------|---------|
| **Normalizer** | After Validator | MAY | Structure and metadata normalization before resolution |
| **Publisher** | After Compiler | MAY | Release packaging and distribution |

Reference implementations MUST NOT reorder normative stages. **Resolver** is the normative name; reference docs MAY use `dependency-resolver.md` as the stage specification file.

---

## 6. Compilation targets (abstract)

EKL defines **compilation targets** abstractly. Specific output formats are defined in reference implementations under `reference/<target>/`.

| Target ID | Abstract purpose |
|-----------|-----------------|
| `ai-context-rules` | Rule-based AI context injection |
| `ai-context-instructions` | Project-level AI instructions |
| `ai-context-agents` | Multi-agent instruction files |
| `documentation-site` | Static documentation output |
| `knowledge-vault` | Personal/team knowledge base |
| `wiki` | Collaborative wiki pages |

Reference implementations MAY map abstract targets to concrete products (e.g., `ai-context-rules` → a specific IDE). The specification MUST NOT name vendor products.

---

## 7. Compliance

An implementation is **EKL v1 compliant** if it:

1. MUST parse all required contract fields per [contracts.md](contracts.md)
2. MUST reject cyclic dependencies
3. MUST NOT compile research artifacts
4. MUST implement Parser, Validator, and Resolver stages
5. MUST produce output for at least one compilation target
6. MUST NOT modify canonical source during compilation
7. MUST declare `ekl_version` in compiler manifest

---

## 8. Extensibility

### 8.1 New artifact types

New artifact types MUST be proposed via ADR in the reference implementation and MUST NOT break existing parsers.

### 8.2 New compilation targets

New targets MUST:
1. Define abstract target in this specification (or ADR)
2. Implement reference compiler in `reference/<target>/`
3. MUST NOT require changes to canonical knowledge

### 8.3 Third-party compilers

Third parties MAY implement EKL-compliant compilers by conforming to [contracts.md](contracts.md), [semantics.md](semantics.md), and [compatibility.md](compatibility.md).

---

## 9. References

- [contracts.md](contracts.md)
- [semantics.md](semantics.md)
- [compatibility.md](compatibility.md)
- [standards-alignment.md](standards-alignment.md)
- [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119)
