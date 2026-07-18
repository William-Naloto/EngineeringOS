---
id: skill.engineering.cursor-compile
version: "0.1.0"
status: experimental
lifecycle: validated
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies: []
provides: [compile-cursor, cursor-rules]
requires:
  - cursor
  - node
references:
  - research/engineering/platform/2026-07-13-mcp-cursor-compile-learnings.md
  - reference/cursor/README.md
updated: 2026-07-14
reviewed: 2026-07-14
tags: [engineering, cursor, compile, delivery]
triggers: [compile cursor, export cursor rules, install review-pr rules]
---

# Skill: Cursor Compile from Capability

Compile an EngineeringOS capability into a Cursor-ready bundle (`.cursor/rules` + `.cursor/skills`) for project installation.

## When to use

- Delivering `capability.engineering.review-pr` (or any capability) to a consuming project
- Refreshing Cursor rules after capability or competency updates
- Onboarding a team repo with governed PR review context

## Prerequisites

- EngineeringOS repo cloned with Node.js ≥ 20
- MCP `engineeringos` configured, or CLI access to the repo
- Target capability at `experimental` or `stable`

## Steps

### 1. Compile the capability

**CLI:**

```bash
cd EngineeringOS
CURSOR_CAPABILITY=capability.engineering.review-pr npm run export:cursor
```

**MCP:**

```
engineeringos.compile target=cursor capability=capability.engineering.review-pr
```

Output directory:

```
dist/cursor-compile/capability-engineering-review-pr/cursor/
```

### 2. Verify bundle contents

| Artifact type | Cursor output | Notes |
|---------------|---------------|-------|
| Capability | `cursor/rules/capability-engineering-review-pr.mdc` | `alwaysApply: true` |
| Agent | `cursor/rules/agent-reviewer.mdc` | `alwaysApply: false` |
| Topics | `cursor/rules/topic-architecture-*.mdc` | Resolved via competency |
| Skills | `cursor/skills/<name>/SKILL.md` | When orchestrated |

Check `cursor/rules/engineeringos-manifest.mdc` for the full file list.

### 3. Install in target project

```bash
cp -R dist/cursor-compile/capability-engineering-review-pr/cursor /path/to/project/.cursor
```

If `.cursor/` already exists, merge `rules/` and `skills/` subdirectories — do not overwrite unrelated team rules without review.

### 4. Reload Cursor

Cmd+Shift+P → **Developer: Reload Window**

Verify in **Settings → Rules** and **Skills**.

### 5. Validate with a real PR

1. Open a PR in the target project
2. Confirm the agent applies architecture-review, naming, and git-and-change lenses
3. Capture gaps via `npm run capture -- learn` if review quality is insufficient

## Output checklist

- [ ] Compile exited without errors
- [ ] Manifest lists expected artifact count
- [ ] Capability rule present with `alwaysApply: true`
- [ ] Target project Cursor reloaded
- [ ] Trial PR review completed

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Editing compiled `.mdc` files in the project | Changes are lost on next compile — edit EKL source |
| Compiling all capabilities at once | Context bloat — compile one capability per project need |
| Skipping reload after install | Rules won't activate until Cursor restarts |

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| research/engineering/platform/2026-07-13-mcp-cursor-compile-learnings.md | Internal experience | Medium |
| reference/cursor/README.md | Internal decision | High |
| Session compile: review-pr → 19 artifacts | Benchmark | Medium |
