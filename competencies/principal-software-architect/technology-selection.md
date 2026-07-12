---
id: topic.architecture.technology-selection
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Medium
dependencies:
  - topic.architecture.trade-off-analysis
provides: [technology-selection]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Technology Selection

Select technology with evidence — not familiarity alone.

## Evaluation matrix

| Criterion | Weight | Option A | Option B |
|-----------|--------|----------|----------|
| Team expertise | | | |
| Operational burden | | | |
| Ecosystem maturity | | | |
| Cost (TCO) | | | |
| Exit strategy | | | |
| Security posture | | | |

## Process

1. Define requirements (functional + non-functional)
2. List 2–4 viable options
3. Score against criteria
4. Document in ADR with trade-offs
5. Time-box proof of concept if uncertainty is high

## Red flags

- "We've always used X"
- No exit strategy
- Selected before requirements defined
- Single-vendor lock-in without justification

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Technology radar practice (ThoughtWorks) | Industry practice | Medium |
