# ADR 0001: Repository Architecture

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

EngineeringOS must scale to hundreds of skills across multiple domains, IDEs, and teams without becoming difficult for AI agents to navigate or humans to maintain.

## Decision

Adopt a **platform architecture** with distinct layers:

```
EngineeringOS (source of truth)
    ↓ compilers
IDE-specific output (Cursor, Claude, Copilot, OpenHands, …)
```

Repository structure:

```
EngineeringOS/
├── agents/          # Personas (not skills)
├── standards/       # Stable conventions (rarely change)
├── packs/           # Self-contained, independently versioned domain bundles
├── research/        # Raw, unvalidated research
├── adr/             # Architecture Decision Records
├── validation/      # Checklists and regression prompts
├── compilers/       # Source → IDE transformation
├── adapters/        # Runtime integration hooks (supplements compilers)
├── routing/         # Selective loading rules
├── capture/         # Dynamic learning pipeline
├── templates/       # Shared templates
├── schemas/         # Contract validation
└── docs/            # Extended documentation
```

## Consequences

- **Positive:** Each concern has a clear home; packs publish independently; compilers eliminate manual IDE maintenance
- **Negative:** More folders to learn initially; migration cost from v0.1 `core/` layout
- **Neutral:** `adapters/` retained alongside `compilers/` for runtime hooks vs. build-time compilation

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [ENGINEERING_PHILOSOPHY.md](../ENGINEERING_PHILOSOPHY.md)
