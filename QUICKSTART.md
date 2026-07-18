# EngineeringOS Quickstart

> **Read time:** 15 minutes  
> **Version:** 0.1.1-RC1

Get oriented fast. This is the onboarding path for humans and AI agents.

---

## Minute 0–3: What is this?

EngineeringOS is an **AI Engineering Operating System** — not an app, not a prompt library.

```
Canonical knowledge (here)
    ↓ compilers
Cursor · Claude · Copilot · OpenHands · …
```

**Read:** [README.md](README.md) (skim) · [VISION.md](VISION.md) (north star)

---

## Minute 3–7: How artifacts work

Every file implements the same **[Knowledge Contract](KNOWLEDGE_CONTRACT.md)**:

```yaml
id: skill.fabric.semantic-model
version: "1.0.0"
status: draft
lifecycle: created
owner: Your Team
classification: BestPractice
confidence: Medium
dependencies: [standard.architecture.design-principles]
provides: [semantic-model-design]
```

Plus an **Evidence** section in the body citing sources.

**Read:** [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md) · [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) (constitution)

---

## Minute 7–12: How the platform is organized

### The LEGO model

```
Capability (complete set)  →  capabilities/
    orchestrates
Agent (who)                →  agents/
    applies
Skill (brick)              →  packs/<pack>/skills/
    sequenced by
Workflow                   →  packs/<pack>/workflows/

Standards (stable rules)   →  standards/     ← rarely change
Research (raw notes)       →  research/      ← never loaded in production
```

### Routing

Router matches **capabilities first**, then resolves agents and skills.

**Read:** [ARCHITECTURE.md](ARCHITECTURE.md) (layer model + dependency injection)

---

## Minute 12–15: How to contribute

| I want to… | Go to |
|------------|-------|
| Add a standard | `standards/<domain>/` → [CONTRIBUTING.md](CONTRIBUTING.md) |
| Add a skill | `packs/<pack>/skills/` |
| Add a capability recipe | `capabilities/<domain>/` |
| Capture project learnings | [capture/learn.md](capture/learn.md) |
| Check coverage | [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) |
| See what's planned | [ROADMAP.md](ROADMAP.md) |

**Read:** [CONTRIBUTING.md](CONTRIBUTING.md) · [OWNERS.md](OWNERS.md)

---

## For AI agents

1. Read this file
2. Read [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) — constitutional constraints
3. Check project `.engineeringos/manifest.yaml` if present
4. Match **capabilities** via [CAPABILITIES_INDEX.md](CAPABILITIES_INDEX.md) and routing
5. Resolve orchestrated agents + skills — do not load entire repository
6. Cite **Evidence** — never say "I think…"

---

## Key documents map

```
README.md ───────────── Entry
QUICKSTART.md ───────── You are here (15 min)
ENGINEERING_PHILOSOPHY.md ─ Constitution
KNOWLEDGE_CONTRACT.md ─── Artifact spec
ARCHITECTURE.md ───────── Platform layout
CAPABILITY_MATRIX.md ──── Coverage dashboard
GOVERNANCE.md ─────────── Rules
CONTRIBUTING.md ───────── How to add content
ROADMAP.md ────────────── What's next
releases/v0.1.1-RC1.md ── Release candidate checklist
```

---

## Current state

**v0.1.1** — platform architecture with working MCP runtime and Obsidian/Cursor compilers.

| Component | Status |
|-----------|--------|
| MCP server (`npm run mcp`) | ✅ Ready |
| Obsidian export (`npm run export:obsidian`) | ✅ Ready |
| Cursor compile (`npm run export:cursor`) | ✅ Ready |
| Knowledge artifacts | 5 experimental capabilities, 4 packs, 7 skills |

---

## Setup (5 minutes)

### Prerequisites

- Node.js ≥ 20
- [Obsidian](https://obsidian.md/) (for vault browsing)
- [Cursor](https://cursor.com/) (for MCP integration)

### Quick setup

```bash
git clone <repo-url> EngineeringOS
cd EngineeringOS
npm run setup          # installs deps, configures MCP, exports Obsidian vault
```

Or step by step:

```bash
npm install
npm test
npm run setup:mcp      # Cursor MCP only
npm run setup:obsidian # Obsidian vault export only
```

### Obsidian integration

1. Export the vault:
   ```bash
   npm run export:obsidian
   ```
2. Open Obsidian → **File → Open folder as vault**
3. Select `dist/obsidian-vault/`
4. Install plugins: **Dataview**, **Templater**, **Obsidian Git**, **Mermaid**
5. Start from `_index/CAPABILITIES.md` or the vault `README.md`

Re-export after editing canonical knowledge in `capabilities/`, `packs/`, etc.

Environment variables (optional — copy `.env.example` to `.env`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `OBSIDIAN_OUTPUT_DIR` | `dist/obsidian-vault` | Vault output path |
| `OBSIDIAN_SCOPE` | `all` | `all`, `pack`, or `capability` |
| `OBSIDIAN_CAPABILITY` | — | Capability slice ID |
| `OBSIDIAN_MIN_STATUS` | `experimental` | Minimum artifact status |

### Cursor MCP integration

MCP config lives in `.cursor/mcp.json`. After setup, reload Cursor and verify:

```
engineeringos.status
engineeringos.capabilities
engineeringos.export { target: "obsidian" }
```

See [reference/obsidian/README.md](reference/obsidian/README.md) for vault layout spec.
