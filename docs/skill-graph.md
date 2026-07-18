# Skill Graph

> **Version:** 0.1.1-RC1  
> **Classification:** Recommendation

The skill graph is the **dependency visualization** of EngineeringOS — how standards, skills, capabilities, agents, and workflows connect.

At scale, this graph is **auto-generated** from Knowledge Contract `dependencies` and `orchestrates` fields (ADR 0012). During RC1, it is documented statically.

---

## Conceptual Graph

```
                    ┌─────────────────┐
                    │   standards/    │
                    │  (foundation)   │
                    └────────┬────────┘
                             │ dependencies
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  skill   │  │  skill   │  │  skill   │
        │ python.* │  │ fabric.* │  │  sql.*   │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │             │             │
             └─────────────┼─────────────┘
                           │ orchestrates
                    ┌──────▼──────┐
                    │ capability  │
                    │  (recipe)   │
                    └──────┬──────┘
                           │ orchestrates
                    ┌──────▼──────┐
                    │   agent     │
                    │  (persona)  │
                    └──────┬──────┘
                           │ sequenced by
                    ┌──────▼──────┐
                    │  workflow   │
                    └─────────────┘
```

---

## Example: Fabric Monitoring

```
standard.architecture.design-principles
standard.documentation.structure
         │
         ├──── skill.fabric.monitoring-setup
         ├──── skill.fabric.pipeline-health-check
         ├──── skill.platform.newrelic-dashboard
         │
         ▼
capability.fabric.monitoring
         │
         ├── agent.sre
         └── workflow.platform.incident-response
```

---

## Graph Properties

| Property | Rule |
|----------|------|
| Direction | Acyclic (DAG) — no circular dependencies |
| Depth | Standards at root; capabilities near leaves |
| Cross-pack edges | Via `dependencies` ID references only |
| Orphan detection | Skills not referenced by any capability flagged |

---

## Future: Auto-Generation

Planned output formats (v0.2+):

| Format | Path | Use |
|--------|------|-----|
| JSON | `indexes/skill-graph.json` | Routing engine, CLI |
| Mermaid | `docs/skill-graph.mmd` | Human visualization |
| DOT | `indexes/skill-graph.dot` | Graphviz |

### Generator pseudocode

```
for each artifact with contract:
  emit nodes[id]
  for dep in dependencies:
    emit edge(dep → id)
  for orch in orchestrates.*:
    emit edge(id → orch)
validate DAG
write indexes/skill-graph.json
```

---

## Using the Graph

| Consumer | Usage |
|----------|-------|
| **Router** | Resolve capability → transitive dependencies |
| **Compiler** | Bundle all deps for IDE output |
| **Maintainer** | Find orphans, circular risks, stale branches |
| **Contributor** | Understand where new skill fits |

---

## RC1 Status

Graph is **specification only**. No artifacts beyond placeholders. Generator deferred to v0.2.

See [ADR 0012](../adr/0012-scale-ready-indexes.md).
