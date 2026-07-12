# Stage 3: Extract

> **Status:** Placeholder (v0.1.1)

## Purpose

Distill validated research into contract-compliant draft artifacts.

## When to use

- Research has been reviewed and approved
- The knowledge is ready to become a skill, standard, or workflow

## Process

1. **Determine artifact type**: standard (cross-domain convention) or skill (domain capability)?
2. **Choose location**:
   - Standard → `standards/<domain>/`
   - Skill → `packs/<pack>/skills/`
   - Workflow → `packs/<pack>/workflows/`
3. **Author** the artifact with full Knowledge Contract frontmatter
4. **Set** `status: draft`
5. **Declare** `dependencies`, `provides`, `requires`, `references`
6. **Update** relevant indexes (SKILLS_INDEX, CAPABILITY_MATRIX, pack manifest)

## Extraction rules

| Rule | Rationale |
|------|-----------|
| One artifact per capability | Composability |
| Reference research in `references` field | Traceability |
| Do not copy-paste research verbatim | Extract the essence |
| Include examples from research in `examples/` | Practical value |

## Next stage

→ [publish.md](publish.md)
