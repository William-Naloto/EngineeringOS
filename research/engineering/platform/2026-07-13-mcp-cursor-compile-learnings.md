# Research: EngineeringOS MCP and Cursor compile operational learnings

> Date: 2026-07-13
> Author: EngineeringOS Team
> Project: EngineeringOS
> Status: extracted
> Reviewed: 2026-07-13
> Reviewer: EngineeringOS Maintainers
> Vendor: engineering
> Domain: platform

## Context

First operational session: MCP server active, Obsidian vault export, Cursor compile for `capability.engineering.review-pr` (19 artifacts).

## Observations

- (Fact) `engineeringos.compile target=cursor capability=capability.engineering.review-pr` produces 17 topic rules + agent + capability rule.
- (BestPractice) Capability rule should use `alwaysApply: true`; topics and agents use `alwaysApply: false`.
- (Fact) Agents without `## Evidence` section require compiler fallback parsing until promoted to full EKL contract.
- (Recommendation) Install compiled bundle via `cp -R cursor/ <project>/.cursor` — output uses `cursor/` folder name to avoid sandbox/gitignore issues during build.
- (BestPractice) Run `npm run catalog` after capability changes to refresh `versions/capability-catalog.snapshot.json`.
- (Unknown) Optimal max rules per project before Cursor context degradation — monitor with real PR reviews.

## Sources

- EngineeringOS session 2026-07-13
- [reference/cursor/README.md](../reference/cursor/README.md)
- [runtime/compiler/cursor/cursor-compiler.ts](../runtime/compiler/cursor/cursor-compiler.ts)

## Open questions

- Should review-pr compile include only subset of topics (router-selected) vs full competency expansion?
- When to promote agents to `experimental` with Evidence sections?

## Capture pipeline

| Stage | Status |
|-------|--------|
| Learn | ✅ |
| Review | ✅ |
| Extract | ✅ |
| Publish | ✅ skill.engineering.cursor-compile |
