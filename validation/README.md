# Validation

> **Status:** Placeholder (v0.1.1)  
> **Classification:** Recommendation

Every skill, standard, and pack must pass validation before promotion beyond `draft`.

## Validation types

| Type | Location | Purpose |
|------|----------|---------|
| **Checklists** | `checklists/` | Human review criteria before promotion |
| **Test prompts** | `prompts/test/` | Verify skill produces expected behavior |
| **Regression prompts** | `prompts/regression/` | Ensure changes don't break existing behavior |
| **Benchmark prompts** | `prompts/benchmark/` | Measure quality against baseline |

## Validation gate

```
Artifact authored (status: draft)
    ↓ Contract schema validation
    ↓ Checklist review
    ↓ Test prompts pass
    ↓ Regression prompts pass (if updating existing)
    ↓ Human review (reviewed: date set)
status: experimental → stable
```

## Planned checklists

| Checklist | Applies to |
|-----------|-----------|
| `checklists/skill-promotion.md` | Skills |
| `checklists/standard-promotion.md` | Standards |
| `checklists/pack-promotion.md` | Packs |
| `checklists/agent-promotion.md` | Agent personas |
| `checklists/contract-compliance.md` | All artifacts |

**Status:** Not yet authored — structure only.

## Automation target

Validation will run in CI at v0.5. Until then, validation is manual using checklists and prompts in this directory.
