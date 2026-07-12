---
id: topic.architecture.git-and-change
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: High
dependencies: []
provides: [git-workflow, change-management]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Git and Change Management

How architects expect changes to flow through version control.

## Commit messages

- Imperative mood: "Add user authentication" not "Added"
- Explain **why** in body when not obvious
- Reference ticket/issue when applicable

## Pull requests

- One logical change per PR
- Description states purpose, approach, and test plan
- Structural changes link to ADR
- Size: prefer reviewable diffs (< 400 lines when possible)

## Branch strategy

Follow project convention. Architect reviews:

- Is this the right granularity for rollback?
- Are migrations reversible?
- Feature flags for risky changes?

## Enables Sprint 1

Git dimension of [Review PR](../../capabilities/engineering/review-pr.md).

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Conventional Commits | Industry practice | Medium |
| Internal PR review practice | Internal experience | Medium |
