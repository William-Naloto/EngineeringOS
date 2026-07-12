# Adapters

> **Version:** 0.1.1  
> **Classification:** Recommendation

Runtime integration hooks that supplement **compilers** (build-time transformation).

## Compilers vs Adapters

| | Compilers (`compilers/`) | Adapters (`adapters/`) |
|---|--------------------------|------------------------|
| **When** | Build time | Runtime |
| **Purpose** | Generate IDE config files | Live integration (MCP, routing, APIs) |
| **Output** | Static files (`.cursor/rules/`, `CLAUDE.md`) | Dynamic connections |
| **Source** | Canonical artifacts by ID | Canonical artifacts by ID |

Both reference canonical knowledge. Neither duplicates content.

## Planned adapters

| Adapter | Purpose | Status |
|---------|---------|--------|
| `cursor/` | MCP routing, live skill loading | Not started |
| `claude-code/` | Runtime project context | Not started |
| `copilot/` | Workspace integration | Not started |
| `openhands/` | Agent runtime hooks | Not started |

## Adapter manifest (planned)

```yaml
adapter_version: "0.1.0"
engineeringos_version: "0.1.1"
target: cursor
mode: runtime
supported_features: [routing, mcp]
```

See [ADR 0007](adr/0007-compilation-model.md) and [compilers/README.md](../compilers/README.md).
