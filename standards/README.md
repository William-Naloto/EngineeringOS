# Standards

> **Status:** Placeholder (v0.1.1)  
> **Classification:** Recommendation

Standards are **stable conventions** that rarely change. They form the foundation that skills and agents depend on.

## Standards vs Skills

| | Standards | Skills |
|---|-----------|--------|
| **Velocity** | Rarely change | Evolve rapidly |
| **Scope** | Cross-domain conventions | Domain-specific capabilities |
| **Location** | `standards/<domain>/` | `packs/<pack>/skills/` |
| **Ownership** | EngineeringOS maintainers | Pack owners |
| **Examples** | Git commit format, naming rules | Fabric semantic models, Python patterns |

## Domains

| Domain | Path | Status |
|--------|------|--------|
| Documentation | `documentation/` | Empty |
| Naming | `naming/` | Empty |
| Architecture | `architecture/` | Empty |
| Git | `git/` | Empty |
| Review | `review/` | Empty |

## Authoring

Every standard implements the [Knowledge Contract](../KNOWLEDGE_CONTRACT.md) with `id: standard.<domain>.<name>`.

Changes to `stable` standards require maintainer approval.

See [ADR 0006](../adr/0006-standards-vs-skills-separation.md).
