---
id: topic.architecture.failure-modes
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies:
  - topic.architecture.design-principles
provides: [failure-modes, reliability-design]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Failure Modes

Design assuming failure — identify what breaks and how the system responds.

## For every component, ask

1. What happens when this fails?
2. How is failure detected?
3. What is the recovery path?
4. What is the blast radius?

## Patterns

| Pattern | Use |
|---------|-----|
| Circuit breaker | Prevent cascade |
| Retry with backoff | Transient failures |
| Dead letter queue | Poison messages |
| Graceful degradation | Partial functionality |
| Health checks | Detection |

## Review checklist

- [ ] Single points of failure identified
- [ ] Timeouts defined on external calls
- [ ] Idempotency where retries exist
- [ ] Runbook for top 3 failure scenarios

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Release It! (Nygard) | Industry practice | Medium |
| SRE failure mode analysis | Industry practice | Medium |
