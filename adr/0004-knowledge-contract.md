# ADR 0004: Knowledge Contract

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

v0.1 defined separate contracts for skills, workflows, and packs with inconsistent fields (`maturity` vs `author` vs `requires`). AI agents could not parse all document types uniformly.

## Decision

Introduce a **universal Knowledge Contract** that every artifact implements:

- `id`, `version`, `status`, `owner`, `classification`
- `dependencies`, `provides`, `requires`, `references`
- `updated`, `reviewed`

Dot-notation IDs: `skill.fabric.semantic-model`, `agent.architect`, `standard.git.commit-messages`.

Schema: `schemas/knowledge-contract.schema.yaml`

## Consequences

- **Positive:** Uniform parsing; dependency graph; Capability Matrix integration via `provides`
- **Negative:** Migration from v0.1 frontmatter; more metadata to maintain
- **Neutral:** `classification` uses PascalCase enum values per contract spec

## References

- [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md)
