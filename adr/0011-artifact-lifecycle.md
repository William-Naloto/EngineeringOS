# ADR 0011: Artifact Lifecycle

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

`status` (draft/stable) governs loadability but does not track provenance through the knowledge pipeline. Maintainers need to know what requires review.

## Decision

Add `lifecycle` field independent of `status`:

```
created → validated → published → maintained → deprecated
```

| Stage | Meaning |
|-------|---------|
| `created` | Authored with complete contract |
| `validated` | Passed validation checklists |
| `published` | Available to consumers (`status: experimental` or `stable`) |
| `maintained` | Actively reviewed on schedule |
| `deprecated` | Superseded; migration path documented |

### Relationship to `status`

| `lifecycle` | Typical `status` |
|-------------|-----------------|
| `created` | `draft` |
| `validated` | `draft` or `experimental` |
| `published` | `experimental` or `stable` |
| `maintained` | `stable` |
| `deprecated` | `deprecated` |

### Review scheduling

`lifecycle: maintained` artifacts with `reviewed` older than 12 months are flagged for re-review (automated check planned v0.5).

## Consequences

- **Positive:** Clear review queue; separates pipeline stage from loadability
- **Negative:** Two fields to maintain
- **Mitigation:** CI validates lifecycle-status consistency

## References

- [GOVERNANCE.md](../GOVERNANCE.md)
- [validation/](../validation/)
