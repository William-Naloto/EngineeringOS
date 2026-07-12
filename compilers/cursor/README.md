# Cursor Compiler

> **Status:** Not started (v0.5 target)

Transforms EngineeringOS artifacts into Cursor-native formats.

## Planned output

| Source | Target |
|--------|--------|
| `standards/` | `.cursor/rules/<standard>.mdc` |
| `packs/<pack>/skills/` | `.cursor/skills/<skill>/SKILL.md` |
| `agents/` | `.cursor/rules/agent-<name>.mdc` |
| Routing rules | Rule activation conditions |

## Configuration

```yaml
# compilers/cursor/config.yaml (planned)
target: cursor
output_dir: .cursor/
include_agents: true
maturity_filter: stable
```

See [compilers/README.md](../README.md).
