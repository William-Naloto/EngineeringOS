# Stage 4: Publish

> **Status:** Placeholder (v0.1.1)

## Purpose

Promote validated draft artifacts to `experimental` or `stable` status in `packs/` or `standards/`.

## When to use

- Draft artifact has passed validation (see [validation/](../validation/))
- Maintainer approves promotion

## Process

1. **Run** contract compliance checklist
2. **Run** type-specific promotion checklist (skill, standard, pack)
3. **Run** test prompts
4. **Run** regression prompts (if updating existing artifact)
5. **Set** `reviewed` date in Knowledge Contract
6. **Promote** `status` to `experimental` or `stable`
7. **Update** CAPABILITY_MATRIX.md status
8. **Update** PROGRESS.md
9. **Trigger** compiler rebuild (when compilers are active)

## Promotion authority

| Target status | Approver |
|---------------|----------|
| `draft` → `experimental` | Contributor |
| `experimental` → `stable` | Maintainer |
| `stable` → `deprecated` | Maintainer + ADR if architectural |

## Post-publish

- Announce in changelog (pack `changelog/` or OS-level)
- Update release lock file (when versioning is active)
- Verify compiled output (when compilers are active)
