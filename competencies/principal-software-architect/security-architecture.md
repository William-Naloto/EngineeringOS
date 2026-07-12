---
id: topic.architecture.security-architecture
version: "0.1.0"
status: draft
lifecycle: created
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies: []
provides: [security-architecture, security-review]
requires: []
references: []
updated: 2026-07-12
reviewed: null
competency: competency.principal-software-architect
---

# Security Architecture

Embed security in design — not as an afterthought audit.

## Trust boundaries

- Map data flows across boundaries
- Authenticate and authorize at every boundary
- Never trust client input
- Secrets in vaults — never in code or logs

## PR review (security lens)

| Check | Question |
|-------|----------|
| AuthZ | Is access scoped correctly? |
| Data | PII/secrets exposed? |
| Input | Injection risks? |
| Dependencies | Known vulnerabilities? |
| Logging | Secrets redacted? |

## Enables Sprint 1

Supports security dimension of [Review PR](../../capabilities/engineering/review-pr.md).

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| OWASP Top 10 | Official documentation | High |
| Zero Trust principles | Industry practice | Medium |
