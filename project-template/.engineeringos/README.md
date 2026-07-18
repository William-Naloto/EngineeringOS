# Project Overlay

> **Version:** 0.1.1  
> **Important:** Overlays live in EngineeringOS only — never in consumer repositories.

Consumer project mappings are stored under `project-overlays/<project-id>/` in the EngineeringOS repository. Use `scripts/install-project-cursor.sh` to install compiled Cursor rules locally without committing them to Azure DevOps or other consumer VCS.

## Structure (in EngineeringOS repo)

```
project-overlays/<project-id>/
├── manifest.yaml       # Activated packs, agents, routing hints
├── context/            # Project architecture, conventions, glossary
└── README.md           # Install instructions
```

## Manifest example

```yaml
engineeringos_version: "0.1.1"
activated_packs:
  - pack.fabric
activated_agents:
  - agent.architect
  - agent.reviewer
maturity_filter: experimental
routing_hints:
  tags: [domain:platform, lang:python]
```

## Rules

- **Do** keep overlays in EngineeringOS `project-overlays/`
- **Do** install Cursor bundles locally via `scripts/install-project-cursor.sh`
- **Do not** add `.engineeringos/` or compiled rules to consumer repositories
- **Do not** commit secrets anywhere

See [project-overlays/README.md](../../project-overlays/README.md).
