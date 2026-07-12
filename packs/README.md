# Knowledge Packs

> **Status:** Placeholder (v0.1.1)  
> **Classification:** Recommendation

Knowledge packs are **self-contained, independently versioned** domain bundles. Each pack can be published, pinned, and consumed on its own.

## Pack structure

```
packs/<pack-name>/
├── README.md           # Pack overview and usage
├── manifest.yaml       # Knowledge Contract + module inventory
├── skills/             # Domain-specific skills
├── workflows/          # Domain-specific workflows
├── templates/          # Domain-specific templates
├── references/         # Curated external references
├── examples/           # Worked examples
└── changelog/          # Per-pack version history
```

## Why self-contained?

One day you will publish **only** the Fabric pack. Or only New Relic. Or only Python. Each pack is a standalone product.

## Available packs

| Pack | ID | Status | Path |
|------|-----|--------|------|
| _Template_ | `pack._template` | Reference only | [_template/](_template/) |

No production packs yet. See [CAPABILITY_MATRIX.md](../CAPABILITY_MATRIX.md).

## Creating a pack

1. Copy `packs/_template/` to `packs/<your-pack>/`
2. Fill `manifest.yaml` with Knowledge Contract fields
3. Add skills, workflows, and templates
4. Update [PACKS_INDEX.md](../PACKS_INDEX.md) and [CAPABILITY_MATRIX.md](../CAPABILITY_MATRIX.md)
5. Run validation before promoting beyond `draft`

See [ADR 0002](../adr/0002-knowledge-pack-format.md).
