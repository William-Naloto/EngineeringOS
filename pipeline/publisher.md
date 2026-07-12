# Pipeline Stage: Publisher

> **EKL v1 — Normative (MAY implement)**

## Purpose

Ship compiled artifacts as versioned releases.

## Outputs

| Artifact | Description |
|----------|-------------|
| GitHub Release | Tagged bundle of compiled outputs |
| `versions/engineeringos-vX.Y.Z.lock` | Pinned source node versions |
| `compile-manifest.json` | Source → output mapping |
| OCI artifact (future) | Container image with pre-compiled context |

## Release checklist

- [ ] Validator passed
- [ ] All Sprint targets compiled successfully
- [ ] Lock file generated
- [ ] CHANGELOG updated
- [ ] GitHub Release created with compiled assets

## CI integration (planned)

```yaml
# .github/workflows/publish.yml (future)
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs: ekl validate → build → optimize → publish
```
