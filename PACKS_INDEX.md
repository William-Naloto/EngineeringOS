# Knowledge Packs Index

> **Version:** 0.1.1  
> **Last updated:** 2026-07-12  
> **Total packs:** 0 production (1 template)

Self-contained, independently versioned domain bundles. See [packs/README.md](packs/README.md).

---

## Available Packs

| id | title | version | status | modules | path |
|----|-------|---------|--------|---------|------|
| — | — | — | — | — | No production packs |

### Reference

| id | title | purpose | path |
|----|-------|---------|------|
| `pack._template` | Pack Template | Copy to create new packs | [packs/_template/](packs/_template/) |

---

## Planned Packs

| Pack ID | Scope | Target |
|---------|-------|--------|
| `pack.foundation` | Git, review, docs, naming | v0.2 |
| `pack.fabric` | Fabric, Power BI, semantic models | v1.0 |
| `pack.python` | Python development | v1.0 |
| `pack.security` | Threat modeling, secrets | v1.0 |
| `pack.data` | Pipelines, quality | v2.0 |
| `pack.platform` | IaC, CI/CD, observability | v2.0 |

**Classification:** Recommendation

---

## Packs by Status

| Status | Count |
|--------|-------|
| stable | 0 |
| experimental | 0 |
| draft | 0 |

---

## Creating a Pack

```bash
cp -r packs/_template packs/<your-pack>
```

Then customize `manifest.yaml`, populate subdirectories, and update this index.

See [ADR 0002](adr/0002-knowledge-pack-format.md).
