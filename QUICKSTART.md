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

**v0.1.1-RC1** — platform architecture only. No production knowledge yet.

Do not tag until [releases/v0.1.1-RC1.md](releases/v0.1.1-RC1.md) is signed off.
