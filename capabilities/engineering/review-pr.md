---
id: capability.engineering.review-pr
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Unknown
dependencies:
  - standard.review.pull-request
  - standard.git.commit-messages
orchestrates:
  skills: []
  workflows: []
  agents:
    - agent.reviewer
  competencies:
    - competency.principal-software-architect
provides:
  - code-review
  - pull-request-review
requires: []
references: []
updated: 2026-07-12
reviewed: null
tags: [engineering, review, pull-request]
triggers: [review PR, pull request, code review]
---

# Capability: Review Pull Request

> **Status:** Placeholder (RC1)

## Purpose

Complete pull request review: correctness, standards compliance, test adequacy, and actionable feedback.

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Competency | `competency.principal-software-architect` | Sprint 1 — topics in progress |
| Agent | `agent.reviewer` | Placeholder |
| Topics used | architecture-review, security-architecture, naming, git-and-change, documentation | Draft |

## Exit criteria

- Review comments are specific and actionable
- Standards compliance assessed
- Approval or change request with rationale

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| — | — | No evidence yet |
