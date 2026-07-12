# Project Overlay

> **Version:** 0.1.1

Copy to a consuming project's root as `.engineeringos/`.

## Structure

```
.engineeringos/
├── manifest.yaml       # Activated packs, agents, routing hints
├── context/            # Project architecture, conventions, glossary
├── overrides/          # Per-artifact overrides by canonical ID
└── local/              # Gitignored — developer-local extensions
```

## Manifest example

```yaml
engineeringos_version: "0.1.1"
activated_packs:
  - pack.foundation
activated_agents:
  - agent.architect
  - agent.reviewer
maturity_filter: stable
routing_hints:
  tags: [domain:platform, lang:python]
overrides:
  - id: skill.foundation.code-review
    path: overrides/skill.foundation.code-review.override.md
```

## Rules

- **Do** add project conventions and routing hints
- **Do not** duplicate global standards or pack skills — reference by ID
- **Do not** commit secrets to `local/` or any tracked path

See [ARCHITECTURE.md](../ARCHITECTURE.md#project-overlay).
