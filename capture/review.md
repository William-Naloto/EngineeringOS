# Stage 2: Review

> **Status:** Placeholder (v0.1.1)

## Purpose

Human validation and classification of research notes before extraction into artifacts.

## When to use

- A research note in `research/` is ready for evaluation
- Multiple engineers have corroborated observations
- Sources have been verified

## Process

1. **Read** the research note
2. **Verify** claims against authoritative sources
3. **Classify** each claim: Fact, BestPractice, Recommendation, or Experimental
4. **Reject** unverifiable or incorrect claims (mark with rationale)
5. **Approve** for extraction or return to author for more research

## Review criteria

| Criterion | Pass? |
|-----------|-------|
| Claims are sourced | |
| Classification is accurate | |
| No secrets or PII | |
| Relevant to EngineeringOS scope | |
| Not already covered by existing artifacts | |

## Outcomes

| Outcome | Action |
|---------|--------|
| **Approved** | Proceed to [extract.md](extract.md) |
| **Needs more research** | Return to [learn.md](learn.md) |
| **Out of scope** | Archive with rationale |
| **Duplicate** | Link to existing artifact |

## Next stage

→ [extract.md](extract.md)
