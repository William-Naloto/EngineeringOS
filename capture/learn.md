# Stage 1: Learn

> **Status:** Placeholder (v0.1.1)

## Purpose

Observe and record raw knowledge from project experience into `research/`.

## When to use

- You discovered a useful pattern during a project
- You evaluated a tool, API, or platform feature
- You solved a problem that others might encounter
- You found documentation gaps or contradictions

## Process

1. **Identify** the knowledge worth capturing
2. **Create** a research note in the appropriate `research/<vendor>/<domain>/` directory
3. **Record** observations, links, and examples — do not polish
4. **Classify** inline: mark claims as fact, best practice, assumption, or unknown
5. **Date** the note (filename or header)

## Research note template

```markdown
# Research: <Topic>

> Date: YYYY-MM-DD
> Author: <name>
> Project: <project-name>
> Status: unvalidated

## Context
What prompted this research?

## Observations
What did you learn? Classify each claim.

## Sources
- [Link](url)

## Open questions
What remains unverified?
```

## Rules

- Do **not** add Knowledge Contract frontmatter (research is pre-contract)
- Do **not** place research in `packs/` or `standards/`
- Do **not** assume research is correct — it awaits review

## Next stage

→ [review.md](review.md)
