# EngineeringOS MCP Specification

> **Version:** 0.1.0-draft  
> **Status:** Architecture — no implementation  
> **Date:** 2026-07-12  
> **Normative companion:** [EKL v1.0](../../SPECIFICATION.md)

This document defines the **Model Context Protocol (MCP) contract** for EngineeringOS. It is the API specification that MUST be implemented before any runtime code is written — analogous to OpenAPI preceding code generators.

---

## 1. Goals

### 1.1 Primary goals

| Goal | Description |
|------|-------------|
| **Expose knowledge, not embed it** | The MCP server MUST NOT contain engineering knowledge. All knowledge lives in the EngineeringOS repository as EKL artifacts. |
| **Canonical runtime** | The MCP server is the canonical runtime interface for AI IDEs and agents to consume EngineeringOS. |
| **Vendor neutrality** | Cursor, Claude Code, Copilot, Gemini CLI, OpenHands, and others are **compiler targets**, not special cases in the MCP layer. |
| **Capability-first** | The runtime MUST load capabilities first and resolve dependencies downward — never the entire repository. |
| **Standards alignment** | The specification MUST reference and align with existing industry standards wherever applicable. |

### 1.2 Non-goals

The MCP specification does NOT define:

- Domain-specific engineering knowledge (Fabric, security, architecture practices, etc.)
- Implementation language or framework for the runtime
- IDE-specific behavior or UI integration
- GitHub integration, filesystem traversal, or caching strategies (defined in [runtime.md](runtime.md) as behavioral contracts only)
- Business logic embedded in the MCP layer

---

## 2. Terminology

| Term | Definition |
|------|------------|
| **EngineeringOS** | The platform and canonical knowledge repository — the source of truth |
| **EKL** | Engineering Knowledge Language — the normative specification and knowledge model ([spec/specification.md](../../spec/specification.md)) |
| **EOR** | EngineeringOS Runtime — the runtime that interprets EKL and exposes tools via MCP |
| **MCP Server** | The MCP transport adapter that maps EOR operations to [Model Context Protocol](https://modelcontextprotocol.io/) tools |
| **Knowledge Node** | Canonical AST unit: Contract + Body + Evidence ([spec/contracts.md](../../spec/contracts.md)) |
| **Compiler Target** | Abstract or concrete consumer of compiled EKL output (Cursor, MkDocs, Confluence, etc.) |
| **Capability-first routing** | Resolution strategy that activates capabilities before individual skills ([ADR 0009](../../adr/0009-capabilities-as-orchestration.md)) |

### 2.1 Naming model

```
EngineeringOS          Platform + canonical repository
        │
        ▼
EKL                    Knowledge language specification
        │
        ▼
EOR                    Runtime (parse, validate, route, compile)
        │
        ▼
MCP Server             Protocol adapter
        │
        ▼
AI IDE / Agent         Compiler target consumer
```

Multiple EOR implementations MAY exist in the future, exactly as multiple databases implement SQL. EngineeringOS ships the **reference EOR**.

---

## 3. Scope

### 3.1 In scope

1. MCP tool definitions ([api.md](api.md))
2. Domain model as seen by the runtime ([domain-model.md](domain-model.md))
3. Runtime behavioral contracts ([runtime.md](runtime.md))
4. Request and response lifecycle (this document, §6–§7)
5. Interface stubs under `runtime/` (no implementation)

### 3.2 Out of scope

1. EKL normative rules (see `spec/`)
2. Reference compiler output formats (see `reference/`)
3. Canonical knowledge content (`capabilities/`, `competencies/`, `packs/`, etc.)
4. Implementation of parsers, validators, resolvers, routers, compilers, or caches

---

## 4. Architecture

### 4.1 Layer model

The EOR processes requests through a fixed layer stack. Each layer has a single responsibility. Layers MUST NOT skip upstream stages.

```
┌─────────────────────────────────────────────────────────┐
│  MCP Tools (api.md)                                     │  Protocol surface
├─────────────────────────────────────────────────────────┤
│  Compiler                                               │  Target-specific output
├─────────────────────────────────────────────────────────┤
│  Router                                                 │  Capability-first selection
├─────────────────────────────────────────────────────────┤
│  Dependency Resolver                                    │  Graph expansion + ordering
├─────────────────────────────────────────────────────────┤
│  Normalizer (optional, reference extension)             │  Structural normalization
├─────────────────────────────────────────────────────────┤
│  Validator                                              │  Schema + semantic checks
├─────────────────────────────────────────────────────────┤
│  EKL AST                                                │  Canonical graph representation
├─────────────────────────────────────────────────────────┤
│  Parser                                                 │  Markdown → AST
├─────────────────────────────────────────────────────────┤
│  Filesystem / Repository Index                          │  Artifact discovery
└─────────────────────────────────────────────────────────┘
```

### 4.2 Separation of concerns

| Layer | Responsibility | MUST NOT |
|-------|----------------|----------|
| **Filesystem** | Locate artifacts by ID, path, or index | Parse or interpret content |
| **Parser** | Extract contract, body, evidence | Validate semantics |
| **AST** | Represent nodes and edges | Contain business rules |
| **Validator** | Enforce EKL contract rules | Route or compile |
| **Normalizer** | Normalize structure and metadata | Change semantic meaning |
| **Resolver** | Expand dependencies and orchestration | Load entire repository |
| **Router** | Match context to capabilities | Hardcode IDE logic |
| **Compiler** | Emit target-specific output | Modify canonical source |
| **MCP Tools** | Expose operations to AI clients | Embed engineering knowledge |

### 4.3 Architecture principles

1. **EngineeringOS is the source of truth.** The MCP MUST NOT duplicate knowledge, hardcode prompts, or embed engineering rules.
2. **EKL is the canonical language.** The runtime reads EKL. It MUST NOT invent new metadata fields.
3. **Vendor neutral.** No Cursor-specific logic in EOR or MCP layers. IDEs are compiler targets.
4. **Capability-first routing.** Load Capability → Competencies → Skills → Standards → Evidence automatically. Never load the entire repository.

### 4.4 Reference standards

| Standard | Usage in this specification |
|----------|----------------------------|
| [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) | Normative keywords (MUST, SHOULD, MAY) |
| [JSON Schema](https://json-schema.org/) | Tool input/output schemas in [api.md](api.md) |
| [Model Context Protocol](https://modelcontextprotocol.io/) | Transport and tool invocation |
| [OpenAPI](https://www.openapis.org/) | Structural analogy for spec-before-implementation |
| [OpenTelemetry](https://opentelemetry.io/) | Observability hooks (future) |
| [OCI](https://opencontainers.org/) | Packaging analogy for compiled artifacts |
| [SPDX](https://spdx.dev/) | License and provenance metadata (future) |

---

## 5. Lifecycle

### 5.1 Server lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  INIT    │───▶│  READY   │───▶│  ACTIVE  │───▶│ SHUTDOWN │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │                │
     │               │                └── Handle MCP tool requests
     │               └── Index loaded, health checks pass
     └── Load repository root, build index skeleton
```

| Phase | Behavior |
|-------|----------|
| **INIT** | Discover repository root. Build artifact index (IDs, paths, types). Do NOT parse all artifacts. |
| **READY** | Respond to `engineeringos.status`. Reject compile/route requests until index is consistent. |
| **ACTIVE** | Full tool surface available. Lazy-parse artifacts on demand. |
| **SHUTDOWN** | Flush optional cache. Release file handles. |

### 5.2 Artifact lifecycle (EKL)

The MCP exposes but does not own artifact lifecycle. See [domain-model.md](domain-model.md) and [ADR 0011](../../adr/0011-artifact-lifecycle.md).

| Dimension | Field | MCP exposure |
|-----------|-------|--------------|
| Loadability | `status` | Filtered by router and compiler |
| Provenance | `lifecycle` | Returned in artifact metadata |
| Validation | `validation_state` | Returned by `engineeringos.validate` |

### 5.3 Request lifecycle

Every MCP tool request follows:

1. **Authenticate** — MCP transport authentication (out of EOR scope)
2. **Parse request** — Validate tool input against JSON Schema
3. **Route** — Map tool to EOR operation
4. **Resolve scope** — Determine minimal artifact set (capability-first)
5. **Execute** — Parse → validate → resolve → compile (as needed)
6. **Respond** — Structured JSON response with metadata
7. **Observe** — Emit telemetry (future)

---

## 6. Request flow

### 6.1 Generic request flow

```
AI IDE
  │
  │  MCP tool call (e.g. engineeringos.compile)
  ▼
MCP Server
  │
  │  Deserialize + validate input schema
  ▼
API Layer (runtime/api/)
  │
  │  Map tool → EOR operation
  ▼
Router (runtime/router/)
  │
  │  Capability-first scope resolution
  ▼
Resolver (runtime/resolver/)
  │
  │  Expand orchestration + dependencies
  ▼
Validator (runtime/validator/)     ← per-node, on demand
  │
  ▼
Parser (runtime/parser/)           ← lazy, per unresolved node
  │
  ▼
Filesystem Index
  │
  │  Return resolved AST subgraph
  ▼
Compiler (runtime/compiler/)       ← if compile/export tool
  │
  ▼
MCP Response
```

### 6.2 Capability-first resolution flow

When a request activates one or more capabilities:

```
Request: capability.engineering.review-pr
    │
    ▼
Load capability node
    │
    ▼
Expand orchestrates.competencies
    │
    ▼
Expand competency manifests → topics
    │
    ▼
Expand orchestrates.skills, workflows, agents
    │
    ▼
Transitively resolve dependencies
    │
    ▼
Filter by status, confidence, lifecycle
    │
    ▼
Topological sort → resolved subgraph
```

The resolver MUST NOT load artifacts outside this subgraph unless explicitly requested (e.g. `include_orphan_skills: true`).

### 6.3 Read vs write operations

| Class | Tools | Side effects |
|-------|-------|--------------|
| **Read** | status, capabilities, competencies, skills, find, dependencies, graph, search, adr, pack, owner, evidence, roadmap, progress | None on canonical source |
| **Transform** | review, compile, snapshot, export | Emit derived output only; MUST NOT modify repository |
| **Validate** | validate | Report only; MUST NOT modify repository |

---

## 7. Response flow

### 7.1 Response envelope

All MCP tool responses SHOULD use a consistent envelope:

```json
{
  "ok": true,
  "meta": {
    "ekl_version": "1.0.0",
    "eor_version": "0.1.0",
    "request_id": "uuid",
    "duration_ms": 42,
    "artifacts_loaded": 7,
    "capability_first": true
  },
  "data": { }
}
```

Error responses:

```json
{
  "ok": false,
  "meta": { "request_id": "uuid", "duration_ms": 12 },
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable summary",
    "details": [ ]
  }
}
```

### 7.2 Error taxonomy

| Code | HTTP analogy | When |
|------|--------------|------|
| `INVALID_INPUT` | 400 | Tool input fails JSON Schema validation |
| `NOT_FOUND` | 404 | Artifact, capability, or pack not found |
| `VALIDATION_FAILED` | 422 | EKL validation rules violated |
| `CYCLE_DETECTED` | 422 | Circular dependency in graph |
| `NOT_READY` | 503 | Server in INIT phase |
| `TARGET_UNSUPPORTED` | 400 | Compiler target not registered |
| `SCOPE_TOO_LARGE` | 413 | Request exceeds `max_artifacts_per_session` |
| `INTERNAL_ERROR` | 500 | Unexpected runtime failure |

### 7.3 Observability (future)

EOR implementations SHOULD emit OpenTelemetry spans per layer:

- `eor.parse`
- `eor.validate`
- `eor.resolve`
- `eor.route`
- `eor.compile`
- `mcp.tool.<name>`

---

## 8. Repository layout

```
EngineeringOS/
├── spec/                    # EKL normative specification (vendor-neutral)
├── docs/mcp/                # This specification (MCP contract)
│   ├── specification.md     # This document
│   ├── domain-model.md      # EOR view of EKL entities
│   ├── runtime.md           # Runtime behavioral contracts
│   └── api.md               # MCP tool definitions
├── runtime/                 # EOR interface stubs (no implementation)
│   ├── ast/
│   ├── parser/
│   ├── validator/
│   ├── normalizer/
│   ├── resolver/
│   ├── router/
│   ├── compiler/
│   ├── cache/
│   └── api/
├── reference/               # Reference compiler targets
└── capabilities/, ...       # Canonical EKL source
```

---

## 9. Compliance

An implementation claiming **EOR MCP compliance** MUST:

1. Implement all MCP tools defined in [api.md](api.md)
2. Conform to EKL v1 parsing and validation semantics
3. Apply capability-first routing for all scoped operations
4. NOT embed engineering knowledge in the MCP layer
5. NOT contain vendor-specific logic outside compiler targets
6. Expose `ekl_version` and `eor_version` in response metadata

Third-party EOR implementations MAY coexist with the reference implementation, analogous to multiple OpenAPI code generators.

---

## 10. Related documents

| Document | Purpose |
|----------|---------|
| [domain-model.md](domain-model.md) | Entity definitions as seen by EOR |
| [runtime.md](runtime.md) | Parsing, validation, routing, compilation contracts |
| [api.md](api.md) | MCP tool catalog with schemas |
| [SPECIFICATION.md](../../SPECIFICATION.md) | EKL entry point |
| [ARCHITECTURE.md](../../ARCHITECTURE.md) | Platform architecture |
| [KNOWLEDGE_CONTRACT.md](../../KNOWLEDGE_CONTRACT.md) | Human-readable contract guide |

---

## Normative language

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** in this document are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).
