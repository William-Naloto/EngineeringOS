---
id: skill.engineering.engineeringos-setup
version: "0.1.0"
status: experimental
lifecycle: validated
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies: []
provides: [engineeringos-setup, mcp-setup, onboarding]
requires:
  - cursor
  - node
references:
  - research/engineering/platform/2026-07-18-engineeringos-week-sprint-obsidian-setup-runtime-refactor-ca.md
  - QUICKSTART.md
updated: 2026-07-18
reviewed: 2026-07-18
tags: [engineering, setup, mcp, onboarding]
triggers: [setup engineeringos, install engineeringos, onboarding engineeringos]
---

# Skill: EngineeringOS Local Setup

Bootstrap a fresh EngineeringOS clone for daily use with Cursor MCP and Obsidian vault export.

## When to use

- First-time clone of EngineeringOS repository
- New team member onboarding
- After pulling major runtime/compiler changes
- Resetting local MCP or vault configuration

## Prerequisites

- Node.js ≥ 20
- Git
- Cursor IDE (for MCP)
- Obsidian (optional, for vault browsing)

## Steps

### 1. Clone and install

```bash
git clone https://github.com/William-Naloto/EngineeringOS.git
cd EngineeringOS
npm run setup
```

This runs:
1. `npm install`
2. `npm test` (57 tests)
3. Creates `.cursor/mcp.json` (if missing)
4. Exports Obsidian vault to `dist/obsidian-vault/`

### 2. Verify MCP in Cursor

1. Reload Cursor: **Cmd+Shift+P → Developer: Reload Window**
2. Confirm MCP server `engineeringos` is active
3. Test tools:
   - `engineeringos.status`
   - `engineeringos.capabilities`
   - `engineeringos.review capability=capability.engineering.review-pr`

### 3. Optional environment config

```bash
cp .env.example .env
# Edit paths if needed
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENGINEERINGOS_ROOT` | repo root | MCP runtime root |
| `OBSIDIAN_OUTPUT_DIR` | `dist/obsidian-vault` | Vault path |
| `OBSIDIAN_MIN_STATUS` | (none) | Filter export by status |

### 4. Install in a consumer project

```bash
./scripts/install-project-cursor.sh /path/to/consumer/project
```

Or use project overlay:

```bash
./scripts/install-project-cursor.sh ../data-platform-bees-unity-catalog-service
```

See `project-overlays/<project-id>/` for capability mapping.

### 5. Validate end-to-end

```bash
npm test                    # 57/57 pass
npm run build               # TypeScript compiles
npm run export:obsidian     # Vault export
npm run catalog             # Refresh capability snapshot
npm run capture -- status   # Capture pipeline health
```

## Partial setup commands

| Command | Scope |
|---------|-------|
| `npm run setup:mcp` | Cursor MCP only |
| `npm run setup:obsidian` | Obsidian vault only |
| `npm run mcp` | Start MCP server manually |

## Output checklist

- [ ] `npm test` — 57/57 passing
- [ ] `npm run build` — no TypeScript errors
- [ ] `.cursor/mcp.json` configured with correct `ENGINEERINGOS_ROOT`
- [ ] `engineeringos.status` returns healthy in Cursor
- [ ] `dist/obsidian-vault/README.md` exists
- [ ] Optional: consumer project has `.cursor/rules/engineeringos/`

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Committing `.cursor/rules/engineeringos/` to consumer repo | Local install only — use overlay + install script |
| Skipping `npm test` after pull | Runtime regressions go unnoticed |
| Hardcoding machine paths in shared MCP config | Use setup script to generate per-machine config |

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| research/engineering/platform/2026-07-18-engineeringos-week-sprint-obsidian-setup-runtime-refactor-ca.md | Internal experience | Medium |
| QUICKSTART.md | Internal decision | High |
| Session: setup + 57 tests + 48 vault files | Benchmark | Medium |
