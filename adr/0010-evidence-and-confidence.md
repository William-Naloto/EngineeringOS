# ADR 0010: Evidence and Confidence Model

> **Status:** Accepted  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

## Context

Prompt repositories propagate unverified claims. AI agents say "I think…" without traceable sources. EngineeringOS must distinguish evidence-backed recommendations from speculation.

## Decision

### 1. Mandatory Evidence section

Every artifact body includes an **Evidence** table citing:

- Official documentation, RFCs, internal experience, industry practice, benchmarks, internal decisions (ADRs)

### 2. Confidence field

Every contract includes:

```yaml
confidence: High | Medium | Low | Unknown
```

| Level | Rule |
|-------|------|
| `High` | Multiple official sources or production validation |
| `Medium` | Industry practice + partial validation |
| `Low` | Single source, limited validation |
| `Unknown` | No evidence yet — **blocks `status: stable`** |

### 3. Agent citation requirement

Agents must cite evidence sources when making recommendations, not assert opinions.

## Consequences

- **Positive:** Distinguishes EngineeringOS from prompt repos; prevents hallucination propagation; audit trail
- **Negative:** Authoring overhead; evidence curation for 500+ skills
- **Mitigation:** Research pipeline feeds evidence; `confidence: Unknown` allowed at draft

## References

- [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md)
- [capture/review.md](../capture/review.md)
