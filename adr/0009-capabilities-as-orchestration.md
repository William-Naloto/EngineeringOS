# ADR 0009: Capabilities as Orchestration Layer

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

At scale (500+ skills), routing individual skills by context signals becomes unmanageable. Contributors and agents need a higher-level unit: *what can the AI accomplish?*

## Decision

Introduce **capability artifacts** in `capabilities/` as the primary routing unit.

### Dependency injection model

```
Capability → Agent → Skill → Workflow
```

### Terminology

| Term | Definition |
|------|------------|
| **Capability artifact** | Orchestration recipe (`capability.fabric.monitoring`) |
| **Provides token** | Atomic flag in contract (`fabric-monitoring`) |
| **Capability Matrix** | Generated coverage dashboard |

### Routing change

Routers match **capabilities first**, then resolve `orchestrates` to load agents, skills, and workflows. Individual skill routing is fallback only.

### Structure

```
capabilities/<domain>/<name>.md
```

Domain subdirectories required when count exceeds 50.

## Consequences

- **Positive:** Dramatically simpler routing; progress measured by accomplishments; LEGO model (skills = bricks, capabilities = sets)
- **Negative:** Additional authoring layer; capability-skill drift if orchestration not maintained
- **Mitigation:** Auto-generate skill graph; validation checks orchestration references

## References

- [capabilities/README.md](../capabilities/README.md)
- [docs/skill-graph.md](../docs/skill-graph.md)
