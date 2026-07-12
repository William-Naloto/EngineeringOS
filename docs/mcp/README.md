# MCP Documentation

> **Sprint 2 deliverable** — architecture before implementation  
> **Status:** Draft

This directory contains the **MCP contract** for EngineeringOS. These documents MUST be completed before any runtime code is written — analogous to OpenAPI preceding code generators.

---

## Documents

| Document | Purpose |
|----------|---------|
| [specification.md](specification.md) | Goals, terminology, scope, architecture, lifecycle, request/response flow |
| [domain-model.md](domain-model.md) | How EOR models EKL entities: Artifact, Capability, Competency, Skill, etc. |
| [runtime.md](runtime.md) | Parsing, validation, resolution, routing, compilation behavioral contracts |
| [api.md](api.md) | Every MCP tool with JSON Schema input/output definitions |

---

## Architecture stack

```
EngineeringOS          Platform + canonical repository
        │
        ▼
EKL                    Knowledge language (spec/)
        │
        ▼
EOR                    Runtime (runtime/)
        │
        ▼
MCP Server             Protocol adapter
        │
        ▼
AI IDE / Agent         Compiler targets (reference/)
```

---

## Interface stubs

TypeScript interface definitions (no implementation) live in [runtime/](../runtime/):

```
runtime/
├── ast/interfaces.ts
├── parser/interfaces.ts
├── validator/interfaces.ts
├── normalizer/interfaces.ts
├── resolver/interfaces.ts
├── router/interfaces.ts
├── compiler/interfaces.ts
├── cache/interfaces.ts
└── api/interfaces.ts
```

---

## Related

| Path | Purpose |
|------|---------|
| [SPECIFICATION.md](../SPECIFICATION.md) | EKL normative specification |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Platform architecture |
| [runtime/README.md](../runtime/README.md) | EOR runtime overview |
