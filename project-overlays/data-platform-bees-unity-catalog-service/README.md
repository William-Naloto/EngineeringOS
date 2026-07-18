# Overlay: BEES Unity Catalog Service

> **Consumer:** `ab-inbev/GHQ_B2B_Delta/data-platform-bees-unity-catalog-service`  
> **Lives in EngineeringOS only** — never commit to Azure DevOps.

## Install locally (one command)

From EngineeringOS root:

```bash
./scripts/install-project-cursor.sh ../data-platform-bees-unity-catalog-service
```

This compiles capabilities and installs to the consumer project's `.cursor/` under isolated subfolders:

```
consumer-project/.cursor/
├── rules/                    ← project's own rules (unchanged)
├── rules/engineeringos/      ← LOCAL ONLY — EngineeringOS compiled rules
└── skills/engineeringos/     ← LOCAL ONLY — EngineeringOS compiled skills
```

**Do not commit** `rules/engineeringos/` or `skills/engineeringos/` to Azure DevOps.

## Activated capabilities

| Capability | When to use |
|------------|-------------|
| `capability.engineering.review-pr` | Azure DevOps PRs, notebook reviews |
| `capability.fabric.monitoring` | Fabric capacity pollers, Eventhouse |
| `capability.platform.observability` | New Relic dashboards, SLOs, incidents |
| `capability.data.feature-store` | Unity Catalog ML features |
| `capability.engineering.design-architecture` | Onboarding, new services, ADRs |

## Context files

- [context/project.md](context/project.md) — architecture and repo map
- [context/conventions.md](context/conventions.md) — PR, naming, observability conventions

## MCP usage

With `engineeringos` MCP active in Cursor, open the consumer project and reference capabilities by ID. MCP reads from EngineeringOS — no files needed in the consumer repo.

## Capture learnings

After validating work in the consumer project:

```bash
npm run capture -- learn --title "..." --domain fabric --project "GHQ B2B Delta"
```

Learnings flow into EngineeringOS `research/` — never into Azure DevOps.
