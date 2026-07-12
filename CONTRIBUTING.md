# Contributing to EngineeringOS

> **Version:** 0.1.1  
> **Last updated:** 2026-07-12

---

## Before You Start

1. [ENGINEERING_PHILOSOPHY.md](ENGINEERING_PHILOSOPHY.md) — constitutional principles
2. [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md) — artifact structure
3. [ARCHITECTURE.md](ARCHITECTURE.md) — platform layout
4. [GOVERNANCE.md](GOVERNANCE.md) — lifecycle and versioning
5. [PROGRESS.md](PROGRESS.md) — active work

---

## What to Contribute

| Type | Location | Contract ID |
|------|----------|-------------|
| Standard | `standards/<domain>/` | `standard.<domain>.<name>` |
| Skill | `packs/<pack>/skills/` | `skill.<pack>.<name>` |
| Workflow | `packs/<pack>/workflows/` | `workflow.<pack>.<name>` |
| Agent persona | `agents/` | `agent.<name>` |
| Knowledge pack | `packs/<name>/` | `pack.<name>` |
| Template | `templates/` or `packs/<pack>/templates/` | `template.<name>` |
| Research | `research/<vendor>/` | No contract (pre-validation) |
| ADR | `adr/` | `NNNN-title.md` |

---

## Contribution Paths

### Path 1: Direct authoring (standards, skills)

For content you already know is correct:

```
Author artifact with Knowledge Contract
    → Update indexes + Capability Matrix
    → Validation checklists
    → Pull request
```

### Path 2: Capture pipeline (research-driven)

For knowledge discovered during projects:

```
capture/learn.md → research/
capture/review.md → validated
capture/extract.md → draft artifact
capture/publish.md → promoted
```

See [capture/](capture/).

---

## Knowledge Contract (required)

Every artifact (except research) must include:

```yaml
---
id: skill.fabric.semantic-model
version: "1.0.0"
status: draft
owner: <team-or-individual>
classification: BestPractice
dependencies: []
provides: [semantic-model-design]
requires: [powerbi]
references: []
updated: 2026-07-12
reviewed: null
---
```

Full spec: [KNOWLEDGE_CONTRACT.md](KNOWLEDGE_CONTRACT.md)  
Schema: [schemas/knowledge-contract.schema.yaml](schemas/knowledge-contract.schema.yaml)

---

## Branch Naming

```
<type>/<short-description>
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `adr`

---

## Commit Messages

```
<type>: <imperative summary>

<optional body>
```

---

## Content Rules

| Rule | Rationale |
|------|-----------|
| One artifact, one responsibility | Selective loading |
| Max ~500 lines per artifact | Context efficiency |
| Classify all claims | Traceability |
| No secrets or PII | Security |
| No vendor syntax in `standards/` | Portability |
| Skills live in packs, not globally | Independent publishing |
| Agents reference by ID, never embed | Personas are lenses |

---

## Index Updates

| Action | Update |
|--------|--------|
| Add skill | [SKILLS_INDEX.md](SKILLS_INDEX.md) + [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) |
| Add workflow | [WORKFLOWS_INDEX.md](WORKFLOWS_INDEX.md) |
| Add pack | [PACKS_INDEX.md](PACKS_INDEX.md) + Capability Matrix |
| Add standard | Capability Matrix |
| Add agent | [agents/README.md](agents/README.md) + Capability Matrix |
| Structural change | New ADR in [adr/](adr/) |

---

## Validation Before Promotion

1. [validation/checklists/contract-compliance.md](validation/checklists/contract-compliance.md)
2. Type-specific checklist (skill, standard, pack, agent)
3. Test prompts in `validation/prompts/test/`
4. Regression prompts (if updating existing)
5. Set `reviewed` date

---

## Pull Request Checklist

```markdown
## Summary
What and why.

## Type
- [ ] Standard  - [ ] Skill  - [ ] Workflow  - [ ] Pack
- [ ] Agent  - [ ] Research  - [ ] ADR  - [ ] Docs  - [ ] Other

## Classification
Primary: Fact / BestPractice / Recommendation / Experimental

## Checklist
- [ ] Knowledge Contract complete
- [ ] Indexes and Capability Matrix updated
- [ ] Validation checklists passed
- [ ] No secrets; no vendor syntax in standards/
- [ ] ADR added if structural change
```
