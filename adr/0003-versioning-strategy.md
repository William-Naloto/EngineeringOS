# ADR 0003: Versioning Strategy

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** BestPractice

## Context

EngineeringOS contains artifacts with different change velocities: standards rarely change, skills evolve rapidly, packs version independently.

## Decision

Adopt **three-level versioning**:

| Level | Scheme | Example |
|-------|--------|---------|
| **OS release** | SemVer | `engineeringos v0.1.1` |
| **Artifact** | SemVer in Knowledge Contract | `skill.fabric.semantic-model v1.0.0` |
| **Pack** | SemVer in pack manifest | `pack.fabric v2.1.0` |

### Rules

1. OS MAJOR bump = breaking contract or routing schema change
2. Artifact version is independent of OS version
3. Packs pin artifact versions in `manifest.yaml`
4. Release lock files in `versions/` pin all artifacts for reproducibility
5. `status: deprecated` artifacts remain for one minor OS version before removal

## Consequences

- **Positive:** Consumers pin exactly what they need; independent pack releases don't force OS bump
- **Negative:** Version matrix complexity; lock files must be maintained
- **Neutral:** Git history supplements `updated` field for audit

## References

- [GOVERNANCE.md](../GOVERNANCE.md)
- [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md)
