# EngineeringOS Runtime (EOR)

> **Version:** 0.1.0-draft  
> **Status:** Parser implemented (Sprint 2 layer 1)  
> **Specification:** [docs/mcp/specification.md](../docs/mcp/specification.md)

The **EngineeringOS Runtime (EOR)** is the runtime that interprets EKL and exposes EngineeringOS knowledge via MCP. It is the layer between the canonical repository and AI IDEs.

```
EngineeringOS          Platform + canonical repository
        │
        ▼
EKL                    Knowledge language specification
        │
        ▼
EOR (this directory)     Parse, validate, route, compile
        │
        ▼
MCP Server               Protocol adapter
        │
        ▼
AI IDE / Agent           Compiler target consumer
```

---

## Architecture

```
Filesystem
    ↓
Parser          runtime/parser/
    ↓
EKL AST         runtime/ast/
    ↓
Validator       runtime/validator/
    ↓
Normalizer      runtime/normalizer/   (optional, reference extension)
    ↓
Resolver        runtime/resolver/
    ↓
Router          runtime/router/
    ↓
Compiler        runtime/compiler/
    ↓
MCP Tools       runtime/api/
```

Cache interfaces are defined in `runtime/cache/` but not implemented in Sprint 2.

---

## Directory layout

| Path | Responsibility |
|------|----------------|
| `ast/` | Canonical AST types — nodes, edges, graph |
| `index/` | Filesystem artifact index (lazy discovery) |
| `parser/` | Markdown → KnowledgeNode | **Implemented** |
| `validator/` | EKL contract enforcement | **Implemented** |
| `normalizer/` | Structural normalization |
| `resolver/` | Dependency expansion + topological sort | **Implemented** |
| `router/` | Capability-first scope resolution | **Implemented** |
| `compiler/` | Compiler target interfaces |
| `cache/` | Cache layer interfaces (future) |
| `api/` | MCP tool handlers + stdio transport | **Implemented** |
| `index.ts` | Re-exports all interfaces |

---

## Compiler targets

Defined as interfaces in `compiler/interfaces.ts`. Not implemented.

| Target | EKL abstract target |
|--------|---------------------|
| Cursor | `ai-context-rules` |
| Claude Code | `ai-context-instructions` |
| GitHub Copilot | `ai-context-instructions` |
| OpenHands | `ai-context-agents` |
| Gemini CLI | `ai-context-instructions` |
| Obsidian | `knowledge-vault` |
| NotebookLM | `knowledge-vault` |
| Confluence | `wiki` |
| MkDocs | `documentation-site` |
| Docusaurus | `documentation-site` |

Reference compiler implementations live in [reference/](../reference/).

---

## Development

```bash
npm install          # optional — TypeScript build
npm test             # node --experimental-strip-types --test
```

Parser tests run against real artifacts in `capabilities/` and `competencies/`.

### MCP Server

```bash
npm install
ENGINEERINGOS_ROOT=. npm run mcp
```

Cursor MCP config example:

```json
{
  "mcpServers": {
    "engineeringos": {
      "command": "node",
      "args": ["--experimental-strip-types", "runtime/api/mcp-main.ts"],
      "cwd": "/path/to/EngineeringOS",
      "env": {
        "ENGINEERINGOS_ROOT": "/path/to/EngineeringOS"
      }
    }
  }
}
```

---

## Legacy vendor runtime specs

The subdirectories `cursor/`, `claude/`, `copilot/`, etc. contain **deprecated** vendor runtime specs from v0.1.0. They have been superseded by [reference/](../reference/). Do not add new content there.

---

## Principles

1. **No engineering knowledge here.** EOR parses, validates, routes, and compiles — it never embeds domain content.
2. **EKL is canonical.** All metadata comes from Knowledge Contracts.
3. **Vendor neutral.** IDE-specific logic belongs in compiler targets, not in EOR core.
4. **Capability-first.** Never load the entire repository.

---

## Related documents

| Document | Purpose |
|----------|---------|
| [docs/mcp/specification.md](../docs/mcp/specification.md) | MCP contract |
| [docs/mcp/domain-model.md](../docs/mcp/domain-model.md) | Entity model |
| [docs/mcp/runtime.md](../docs/mcp/runtime.md) | Behavioral contracts |
| [docs/mcp/api.md](../docs/mcp/api.md) | MCP tool definitions |
| [SPECIFICATION.md](../SPECIFICATION.md) | EKL entry point |
