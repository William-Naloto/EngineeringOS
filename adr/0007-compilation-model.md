# ADR 0007: Compilation Model

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

v0.1 used `adapters/` for manual IDE translation. This requires maintaining Cursor rules, Claude instructions, and Copilot configs separately — duplicating effort and causing drift.

## Decision

EngineeringOS is the **single source of truth**. `compilers/` transform canonical knowledge into IDE-native formats:

```
EngineeringOS (canonical)
    ↓ compilers/cursor/
Cursor Rules (.cursor/rules/*.mdc)

EngineeringOS (canonical)
    ↓ compilers/claude-code/
Claude Instructions

EngineeringOS (canonical)
    ↓ compilers/copilot/
Copilot Instructions

EngineeringOS (canonical)
    ↓ compilers/openhands/
OpenHands Configuration
```

### Compiler responsibilities

1. Read artifacts by ID from `standards/`, `packs/`, `agents/`
2. Resolve dependencies
3. Transform to target IDE format
4. Write output to configured destination
5. Never modify canonical source

`adapters/` retained for **runtime integration hooks** (e.g., MCP connections, live routing) that compilers do not cover.

## Consequences

- **Positive:** One knowledge base serves every AI; no manual IDE maintenance; reproducible builds
- **Negative:** Compiler development is significant engineering effort
- **Neutral:** Compiled output is generated, not committed (add to `.gitignore`) — **or** committed for convenience (team decision at v0.5)

## References

- [compilers/README.md](../compilers/README.md)
- [adapters/README.md](../adapters/README.md)
