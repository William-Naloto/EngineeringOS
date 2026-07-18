---
id: capability.engineering.review-pr
version: "0.1.0"
status: experimental
lifecycle: validated
owner: EngineeringOS Maintainers
classification: Recommendation
confidence: Medium
dependencies:
  - standard.review.pull-request
  - standard.git.commit-messages
orchestrates:
  skills:
    - skill.engineering.cursor-compile
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
updated: 2026-07-14
reviewed: 2026-07-14
tags: [engineering, review, pull-request]
triggers: [review PR, pull request, code review]
---

# Capability: Review Pull Request

> **Status:** Experimental — orchestration wired to competency + agent

## Purpose

Complete pull request review: correctness, standards compliance, test adequacy, and actionable feedback.

## Orchestration

| Type | Artifacts | Status |
|------|-----------|--------|
| Competency | `competency.principal-software-architect` | 15 topics (draft) |
| Agent | `agent.reviewer` | Draft persona |
| Skill | `skill.engineering.cursor-compile` | Experimental — Cursor delivery |
| Topics resolved | architecture-review, security-architecture, naming, git-and-change, documentation, design-principles, trade-off-analysis | Via competency expansion |

## Exit criteria

- Review comments are specific and actionable
- Standards compliance assessed
- Approval or change request with rationale

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| Google engineering practices (code review) | Industry practice | Medium |
| topic.architecture.architecture-review | Internal artifact | Medium |
| topic.architecture.git-and-change | Internal artifact | Medium |
| topic.architecture.naming | Internal artifact | Medium |
| skill.engineering.cursor-compile | Internal artifact | Medium |
