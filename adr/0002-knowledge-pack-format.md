# ADR 0002: Knowledge Pack Format

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

v0.1 placed skills, workflows, and packs in separate top-level trees under `core/`. This prevents independent publishing — you cannot ship "only the Fabric pack" without the entire repository.

## Decision

Knowledge packs are **self-contained directories** under `packs/<name>/`:

```
packs/fabric/
├── README.md           # Pack overview
├── manifest.yaml       # Knowledge Contract + module inventory
├── skills/             # Domain skills
├── workflows/          # Domain workflows
├── templates/          # Domain templates
├── references/         # Curated external references
├── examples/           # Worked examples
└── changelog/          # Per-pack version history
```

Each pack:

- Has its own SemVer
- Can be published, pinned, and consumed independently
- Declares dependencies on `standards/` and other packs via Knowledge Contract
- Contains everything needed for its domain

## Consequences

- **Positive:** Independent versioning and publishing; clear domain boundaries; teams own their pack
- **Negative:** Some duplication of structure across packs; cross-pack skill sharing via dependencies only
- **Neutral:** Global `templates/` retained for cross-pack shared templates

## References

- [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md)
- [packs/README.md](../packs/README.md)
