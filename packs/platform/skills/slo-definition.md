---
id: skill.platform.slo-definition
version: "0.1.0"
status: draft
lifecycle: created
owner: Data Platform — GHQ B2B Delta
classification: BestPractice
confidence: Medium
dependencies: []
provides: [slo-definition, platform-observability]
requires:
  - newrelic
references:
  - https://sre.google/sre-book/service-level-objectives/
updated: 2026-07-13
reviewed: null
tags: [slo, sli, reliability]
triggers: [SLO, SLI, error budget, reliability target]
---

# Skill: SLO Definition for Data Products

Define Service Level Indicators (SLIs) and Objectives (SLOs) for data platform services with measurable error budgets.

## When to use

- Launching a new data product with reliability commitments
- Formalizing informal "it should run by 8am" expectations
- Prioritizing reliability work via error budget policy

## SLI candidates for data platforms

| Data product type | SLI | Measurement |
|-------------------|-----|-------------|
| Batch pipeline | **Freshness** | Data available by deadline |
| Batch pipeline | **Success rate** | Completed runs / total runs |
| Streaming job | **Lag** | Consumer lag < threshold |
| Feature store | **Serving availability** | Successful feature reads |
| API | **Availability** | Successful requests / total |

## SLO template

```yaml
service: fabric-pipeline-order-refresh
sli: freshness
objective: 99.5% of days data ready by 06:00 UTC
measurement_window: 30 days
error_budget: 0.5% (~3.6 hours/month equivalent)
alerting:
  budget_burn_fast: 2% budget in 1 hour → page
  budget_burn_slow: 5% budget in 6 hours → ticket
```

## Process

1. **Identify user journey** — who depends on this data and by when?
2. **Pick 1–2 SLIs** — avoid metric overload
3. **Set objective** — start conservative; tighten after 90 days of data
4. **Implement measurement** — NRQL or custom event in New Relic
5. **Define error budget policy** — what happens when budget exhausted?
6. **Review quarterly** — adjust objective based on business need

## Error budget policy (starter)

| Budget remaining | Action |
|------------------|--------|
| > 50% | Normal feature development |
| 25–50% | Reliability work gets 25% sprint capacity |
| < 25% | Freeze non-critical features; focus on reliability |
| Exhausted | Incident review required before new features |

## Output

- SLO document with SLI, objective, measurement query
- New Relic alert conditions for budget burn
- Stakeholder sign-off recorded in Evidence

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| [Google SRE — SLOs](https://sre.google/sre-book/service-level-objectives/) | Industry practice | High |
| Data platform freshness incidents (GHQ B2B Delta) | Internal experience | Medium |
