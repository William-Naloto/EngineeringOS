# Capabilities

> **Version:** 0.1.1-RC1  
> **Classification:** Recommendation

Capabilities are **orchestration recipes** — complete LEGO sets built from skill bricks, agent personas, and workflows.

## Capability vs Skill

| | Capability | Skill |
|---|-----------|-------|
| **Analogy** | Complete LEGO set | Single brick |
| **Answers** | What can the AI accomplish? | How to do one thing? |
| **Routing** | Router loads capabilities first | Resolved via capability orchestration |
| **Location** | `capabilities/<domain>/` | `packs/<pack>/skills/` |
| **ID** | `capability.fabric.monitoring` | `skill.fabric.semantic-model` |

## Dependency injection model

```
Capability: Fabric Monitoring
    requires: Architecture, Documentation, Python, SQL, Fabric, New Relic
    orchestrates:
      agents: [agent.sre]
      skills: [skill.fabric.monitoring-setup, skill.newrelic.dashboard]
      workflows: [workflow.platform.incident-response]
```

## Organization

```
capabilities/
├── README.md
├── platform/
│   ├── observability.md          # capability.platform.observability
│   └── incident-response.md
├── fabric/
│   └── monitoring.md             # capability.fabric.monitoring
├── engineering/
│   ├── review-pr.md
│   ├── design-architecture.md
│   └── feature-development.md
└── data/
    └── feature-store.md
```

At scale (100+ capabilities), organize by domain subdirectory. Flat files only while count < 50.

**Classification:** Recommendation — see [ADR 0009](../adr/0009-capabilities-as-orchestration.md)

## Placeholder capabilities (RC1)

| File | ID | Status |
|------|-----|--------|
| [fabric/monitoring.md](fabric/monitoring.md) | `capability.fabric.monitoring` | Placeholder |
| [platform/observability.md](platform/observability.md) | `capability.platform.observability` | Placeholder |
| [engineering/review-pr.md](engineering/review-pr.md) | `capability.engineering.review-pr` | Placeholder |
| [engineering/design-architecture.md](engineering/design-architecture.md) | `capability.engineering.design-architecture` | Placeholder |
| [data/feature-store.md](data/feature-store.md) | `capability.data.feature-store` | Placeholder |

## Index

See [CAPABILITIES_INDEX.md](../CAPABILITIES_INDEX.md).

## Skill graph

Capabilities sit at the top of the [skill graph](docs/skill-graph.md), which will be auto-generated from contracts at scale.
