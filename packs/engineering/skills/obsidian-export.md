---
id: skill.engineering.obsidian-export
version: "0.1.0"
status: experimental
lifecycle: validated
owner: EngineeringOS Maintainers
classification: BestPractice
confidence: Medium
dependencies: []
provides: [obsidian-export, obsidian-vault, knowledge-vault]
requires:
  - obsidian
  - node
references:
  - research/engineering/platform/2026-07-18-engineeringos-week-sprint-obsidian-setup-runtime-refactor-ca.md
  - reference/obsidian/README.md
updated: 2026-07-18
reviewed: 2026-07-18
tags: [engineering, obsidian, export, vault]
triggers: [export obsidian, obsidian vault, open vault, knowledge vault]
---

# Skill: Obsidian Vault Export

Export EngineeringOS canonical knowledge to an Obsidian vault for human browsing, linking, and team second-brain workflows.

## When to use

- Onboarding a team member to EngineeringOS knowledge base
- Weekly knowledge review with Dataview dashboards
- Browsing capability/skill relationships via wikilinks and graph overview
- After editing capabilities, packs, or agents in the canonical repo

## Prerequisites

- EngineeringOS repo cloned with Node.js ≥ 20
- [Obsidian](https://obsidian.md/) installed
- Optional: Dataview, Templater, Obsidian Git community plugins

## Steps

### 1. Export the vault

**One-command setup (first time):**

```bash
cd EngineeringOS
npm run setup:obsidian
```

**Re-export after knowledge changes:**

```bash
npm run export:obsidian
```

**MCP:**

```
engineeringos.export target=obsidian scope=all
```

**Scoped export:**

```bash
OBSIDIAN_SCOPE=capability OBSIDIAN_CAPABILITY=capability.fabric.monitoring npm run export:obsidian
```

Default output: `dist/obsidian-vault/`

### 2. Open in Obsidian

1. Obsidian → **File → Open folder as vault**
2. Select `dist/obsidian-vault/`
3. Start from `README.md` or `_index/CAPABILITIES.md`

### 3. Configure plugins

| Plugin | Type | Purpose |
|--------|------|---------|
| **Mermaid** | Core plugin | Render `_index/graph-overview.md` diagrams |
| **Dataview** | Community | Capability Matrix dashboards |
| **Templater** | Community | Author from `_templates/` |
| **Obsidian Git** | Community | Optional vault sync |

Enable Mermaid: **Settings → Core plugins → Mermaid** (no Community plugin needed for rendering).

### 4. Navigate the vault

| Path | Content |
|------|---------|
| `_index/CAPABILITIES.md` | Capability index + Dataview table |
| `_index/CAPABILITY_MATRIX.md` | Status/confidence dashboard |
| `_index/graph-overview.md` | Mermaid link map between artifacts |
| `_templates/` | Research note templates |
| `Capabilities/` | Capability recipes |
| `Skills/` | Pack skills |
| `Agents/` | Agent personas |

### 5. Re-export workflow

```
Edit canonical source (packs/, capabilities/)
  → npm test
  → npm run export:obsidian
  → Refresh Obsidian (reopen vault or reload)
```

## Output checklist

- [ ] Export completed without errors
- [ ] `dist/obsidian-vault/README.md` present
- [ ] `_index/graph-overview.md` renders in Reading view
- [ ] Wikilinks resolve (e.g. `[[agent.sre]]` in capability notes)
- [ ] Dataview tables load (requires Dataview plugin)

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Editing vault files as source of truth | Lost on next export — edit canonical repo |
| Installing "Mermaid Tools" expecting rendering | Rendering is Core Mermaid; Tools is authoring-only |
| Committing only vault without canonical changes | Drift between Obsidian and EKL source |

## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| research/engineering/platform/2026-07-18-engineeringos-week-sprint-obsidian-setup-runtime-refactor-ca.md | Internal experience | Medium |
| reference/obsidian/README.md | Internal decision | High |
| Session export: 48 files, 5 capabilities, 7 skills | Benchmark | Medium |
