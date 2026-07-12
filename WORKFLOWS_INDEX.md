# Workflows Index

> **Version:** 0.1.1  
> **Last updated:** 2026-07-12  
> **Total workflows:** 0 (0 stable)

Registry of all workflows. Workflows live inside packs at `packs/<pack>/workflows/`.

---

## Index Format

| Field | Description |
|-------|-------------|
| `id` | `workflow.<pack>.<name>` |
| `title` | Human-readable name |
| `version` | SemVer |
| `status` | draft · experimental · stable · deprecated |
| `pack` | Parent pack ID |
| `skills` | Referenced skill IDs |
| `path` | Relative path |

---

## Workflows by Pack

_No workflows registered._

---

## Workflows by Status

| Status | Count |
|--------|-------|
| stable | 0 |
| experimental | 0 |
| draft | 0 |
| deprecated | 0 |

---

## Adding a Workflow

1. Create in `packs/<pack>/workflows/<name>/` with Knowledge Contract
2. Add to pack `manifest.yaml`
3. Update this index
4. Ensure referenced skills exist in [SKILLS_INDEX.md](SKILLS_INDEX.md)

See [CONTRIBUTING.md](CONTRIBUTING.md).
