# Skills Index

> **Version:** 0.1.1  
> **Last updated:** 2026-07-12  
> **Total skills:** 0 (0 stable)

Registry of all skills. Skills live inside self-contained packs at `packs/<pack>/skills/`.

For coverage overview, see [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md).

---

## Index Format

| Field | Description |
|-------|-------------|
| `id` | `skill.<pack>.<name>` (dot notation) |
| `title` | Human-readable name |
| `version` | SemVer |
| `status` | draft · experimental · stable · deprecated |
| `pack` | Parent pack ID |
| `provides` | Capability tokens |
| `path` | Relative path to artifact |

---

## Skills by Pack

_No skills registered._

<!-- Template:
| id | title | version | status | provides | path |
|----|-------|---------|--------|----------|------|
| skill.foundation.code-review | Code Review | 0.1.0 | draft | code-review | packs/foundation/skills/code-review/SKILL.md |
-->

---

## Skills by Status

| Status | Count |
|--------|-------|
| stable | 0 |
| experimental | 0 |
| draft | 0 |
| deprecated | 0 |

---

## Adding a Skill

1. Create skill inside `packs/<pack>/skills/<name>/` with Knowledge Contract
2. Add to pack `manifest.yaml` modules list
3. Update this index and [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md)
4. Pass [validation](validation/) before promotion

See [CONTRIBUTING.md](CONTRIBUTING.md).
