# ADR 0005: Agents as Personas

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

Skills teach *how* to do something. But AI-assisted engineering also needs *who* is doing it — a principal architect reviews differently than a senior Python engineer or a TPM.

## Decision

Introduce `agents/` for **persona definitions** that are distinct from skills:

| Concept | Location | Purpose |
|---------|----------|---------|
| **Skill** | `packs/<pack>/skills/` | Teaches a capability |
| **Agent** | `agents/` | Defines a persona lens |

Agents:

- Reference standards and skills by ID (never duplicate content)
- Define tone, priorities, review criteria, and scope
- Are loadable alongside skills via routing
- Implement the Knowledge Contract with `id: agent.<name>`

## Consequences

- **Positive:** Composable persona + skill combinations; clear separation of "who" vs "how"
- **Negative:** Agents without skills are hollow; must maintain dependency graph
- **Neutral:** Compilers may bundle agent + skill into IDE context

## References

- [agents/README.md](../agents/README.md)
- [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md)
