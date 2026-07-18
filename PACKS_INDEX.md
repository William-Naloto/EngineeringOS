# Knowledge Packs Index

> **Version:** 0.1.1  
> **Last updated:** 2026-07-13  
> **Total packs:** 3 production draft (1 template)

Self-contained, independently versioned domain bundles. See [packs/README.md](packs/README.md).

---

## Available Packs

| id | title | version | status | modules | path |
|----|-------|---------|--------|---------|------|
| `pack.engineering` | Engineering tooling | 0.1.0 | draft | 1 skill | [packs/engineering/](packs/engineering/) |
| `pack.fabric` | Microsoft Fabric | 0.1.0 | draft | 2 skills | [packs/fabric/](packs/fabric/) |
| `pack.platform` | Platform Observability | 0.1.0 | draft | 2 skills, 1 workflow | [packs/platform/](packs/platform/) |
| `pack.data` | Data Engineering & ML Features | 0.1.0 | draft | 2 skills | [packs/data/](packs/data/) |

### Reference

| id | title | purpose | path |
|----|-------|---------|------|
| `pack._template` | Pack Template | Copy to create new packs | [packs/_template/](packs/_template/) |

---

## Packs by Status

| Status | Count |
|--------|-------|
| stable | 0 |
| experimental | 0 |
| draft | 4 |

---

## Creating a Pack

```bash
cp -r packs/_template packs/<your-pack>
```

Then customize `manifest.yaml`, populate subdirectories, and update this index.

See [ADR 0002](adr/0002-knowledge-pack-format.md).
