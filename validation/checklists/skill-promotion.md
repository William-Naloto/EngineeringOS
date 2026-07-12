# Skill Promotion Checklist

> **Status:** Placeholder (v0.1.1)

Use this checklist before promoting a skill from `draft` to `experimental` or `stable`.

## Contract compliance

- [ ] Knowledge Contract frontmatter is complete
- [ ] `id` follows dot-notation convention
- [ ] `version` is SemVer
- [ ] `owner` is set
- [ ] `classification` is set
- [ ] `dependencies` are valid IDs (no circular deps)
- [ ] `provides` tokens are registered in CAPABILITY_MATRIX.md
- [ ] `updated` date is current

## Content quality

- [ ] Single responsibility — one skill, one capability
- [ ] Under ~500 lines
- [ ] No vendor-specific syntax (unless pack-scoped)
- [ ] No secrets, credentials, or PII
- [ ] Claims are classified (Fact, BestPractice, Recommendation, Experimental)

## Validation

- [ ] Test prompts pass (see `prompts/test/`)
- [ ] Regression prompts pass if updating existing skill
- [ ] Human reviewer has set `reviewed` date

## Index updates

- [ ] SKILLS_INDEX.md updated
- [ ] CAPABILITY_MATRIX.md updated
- [ ] Pack manifest updated (if pack-scoped)
