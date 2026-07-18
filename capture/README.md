# Capture Pipeline

> **Status:** Operational (MVP v0.1.1)  
> **Classification:** Recommendation

The capture pipeline is how **projects improve EngineeringOS** over time. It transforms real engineering experience into validated, contract-compliant knowledge.

## Operational commands

### CLI

```bash
npm run capture -- status
npm run capture -- list
npm run capture -- learn --title "Fabric alert tuning" --vendor microsoft --domain fabric --project "GHQ B2B Delta"
npm run capture -- review --path research/microsoft/fabric/2026-07-13-topic.md --outcome approved --reviewer "Your Name"
npm run capture -- extract --path research/... --artifact-id skill.fabric.alert-tuning --type skill --pack fabric
```

### MCP

```
engineeringos.capture action=status
engineeringos.capture action=list
engineeringos.capture action=learn title="..." vendor=engineering domain=review
engineeringos.capture action=review path=research/... outcome=approved
engineeringos.capture action=extract path=research/... artifact_id=skill.engineering.foo type=skill pack=engineering
```

Draft artifacts land in `research/drafts/` — never auto-promote to `packs/` or `stable`.

---

```
Project experience
    ↓ learn.md
research/ (raw notes)
    ↓ review.md
Validated research
    ↓ extract.md
Draft artifacts (contract-compliant)
    ↓ publish.md
packs/ or standards/ (promoted)
    ↓ validation/
status: stable
```

## Stage documents

| Stage | Document | Actor | Output |
|-------|----------|-------|--------|
| **Learn** | [learn.md](learn.md) | Engineer + AI | Raw notes in `research/` |
| **Review** | [review.md](review.md) | Human reviewer | Classified, validated research |
| **Extract** | [extract.md](extract.md) | Engineer + AI | Draft artifacts with Knowledge Contract |
| **Publish** | [publish.md](publish.md) | Maintainer | Promoted artifacts in `packs/` or `standards/` |

## Principles

- Capture knowledge **only after validation** ([ENGINEERING_PHILOSOPHY.md](../ENGINEERING_PHILOSOPHY.md))
- Research is never loaded by production agents
- Every published artifact must pass validation
- Classify all claims during review

See [ADR 0008](../adr/0008-research-and-capture-pipeline.md).

---

## Future: `/capture` Command

**Classification:** Experimental — [ADR 0013](../adr/0013-self-improving-capture-command.md)

EngineeringOS will support a self-improving capture command:

```
/capture
    → What repository?
    → Analyze commits, PRs, documentation
    → Extract lessons (capture/learn)
    → Suggest artifacts (capture/extract)
    → Open PR against EngineeringOS (capture/publish)
```

All `/capture` output lands in `research/` or `status: draft` only — never auto-promotes to `stable`.

**Target:** `eos capture` CLI in v0.5; agent `/capture` command in v1.0.
