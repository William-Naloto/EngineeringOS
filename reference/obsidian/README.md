# Reference Compiler: Obsidian

> **target_id:** `obsidian`  
> **ekl_abstract_target:** `knowledge-vault`  
> **compiler_version:** 0.0.0-draft  
> **ekl_version:** 1.0  
> **Status:** Specification + MVP runtime compiler (`runtime/compiler/obsidian/`)

Implements EKL v1 for Obsidian vaults. See [spec/specification.md](../../spec/specification.md).

Obsidian is the **human-facing knowledge vault** target — optimized for browsing, linking, and team second-brain workflows. Cursor and Claude targets optimize for AI context injection; Obsidian optimizes for navigability and authoring.

---

## Supported features

| Feature | Supported | Output |
|---------|-----------|--------|
| Vault notes | Yes | `<vault>/` Markdown files |
| Wikilinks | Yes | `[[artifact-id]]` from contract `id` |
| Frontmatter | Yes | YAML Knowledge Contract preserved |
| Dataview dashboards | Yes | `_index/*.md` with Dataview queries |
| Graph view | Partial | Mermaid + wikilink graph |
| Templates | Yes | `_templates/` from EKL templates |
| MCP bridge | No (runtime adapter) | Use EngineeringOS MCP separately |
| Bidirectional sync | Partial | Git-sync vault → canonical repo |

---

## Vault layout

```
EngineeringOS-Vault/
├── _index/
│   ├── CAPABILITY_MATRIX.md      # Dataview dashboard
│   ├── CAPABILITIES.md           # Auto-generated index
│   └── graph-overview.md         # Mermaid + link map
├── _templates/
│   ├── capability.md
│   ├── topic.md
│   └── skill.md
├── Capabilities/
│   └── <domain>/
│       └── <name>.md
├── Competencies/
│   └── <competency>/
│       └── <topic>.md
├── Agents/
│   └── <agent>.md
├── Skills/
│   └── <pack>/
│       └── <skill>.md
├── Standards/
│   └── <domain>/
│       └── <standard>.md
├── ADRs/
│   └── <number>-<title>.md
├── Packs/
│   └── <pack>/
│       └── README.md
└── Research/                       # Optional — status: draft only
    └── <date>-<topic>.md
```

---

## EKL artifact mapping

| EKL artifact | Vault path | Wikilink target |
|--------------|------------|-----------------|
| `capability.*` | `Capabilities/<domain>/<name>.md` | `[[capability.domain.name]]` |
| `competency.*` | `Competencies/<name>/README.md` | `[[competency.name]]` |
| `topic.*` | `Competencies/<competency>/<topic>.md` | `[[topic.architecture.name]]` |
| `agent.*` | `Agents/<name>.md` | `[[agent.name]]` |
| `skill.*` | `Skills/<pack>/<name>.md` | `[[skill.pack.name]]` |
| `standard.*` | `Standards/<domain>/<name>.md` | `[[standard.domain.name]]` |
| `adr/*` | `ADRs/<number>-<slug>.md` | `[[adr-NNNN]]` |

---

## Note format

Frontmatter is copied verbatim from the Knowledge Contract. Body is compiled with wikilinks injected for `dependencies`, `orchestrates`, and Evidence references.

```yaml
---
id: capability.engineering.review-pr
version: "0.1.0"
status: experimental
# ... full contract preserved
tags: [capability, engineering, review]
---
# Capability: Review Pull Request

Orchestrates [[agent.reviewer]] via [[competency.principal-software-architect]].

## Evidence
| Source | Type | Confidence |
|--------|------|------------|
| [[topic.architecture.architecture-review]] | Internal artifact | Medium |
```

### Wikilink resolution rules

1. Use contract `id` as link target: `[[capability.engineering.review-pr]]`
2. Resolve to vault path via artifact index at compile time
3. Unresolved IDs become plain text with compile warning

---

## Dataview dashboards

`_index/CAPABILITY_MATRIX.md` example:

```dataview
TABLE status, confidence, provides, file.link AS artifact
FROM "Capabilities"
SORT status ASC, id ASC
```

`_index/CAPABILITIES.md` is regenerated on each compile from `engineeringos.capabilities` output.

---

## Compile modes

| Mode | Command (planned) | Use case |
|------|-------------------|----------|
| **Full vault** | `ekl build --target obsidian --output ./vault` | Team knowledge base |
| **Capability slice** | `ekl build --target obsidian --capability <id> --output ./vault` | Focused export |
| **Incremental** | `ekl build --target obsidian --incremental` | Git-sync delta only |

MCP equivalent (when implemented): `engineeringos.export { target: "obsidian", capability: "..." }`

---

## Obsidian plugins (recommended)

| Plugin | Purpose |
|--------|---------|
| **Dataview** | Capability Matrix dashboards |
| **Templater** | Authoring from `_templates/` |
| **Git** | Sync vault with EngineeringOS repo |
| **Mermaid** | Render compiled diagrams |

---

## Context limits

| Limit | Value | Compiler action |
|-------|-------|-----------------|
| Max note size | No hard limit | Split at H1 if >2000 lines |
| Wikilinks per note | ≤ 50 | Summarize overflow in appendix |
| Research notes | Excluded by default | `min_status: experimental` filter |

---

## Implementation

Runtime compiler: `runtime/compiler/obsidian/`  
CLI: `npm run export:obsidian`  
MCP: `engineeringos.export { target: "obsidian" }`

---

## References

- [pipeline/compiler.md](../../pipeline/compiler.md)
- [spec/specification.md](../../spec/specification.md)
- [docs/mcp/domain-model.md](../../docs/mcp/domain-model.md) §3.4
- [capture/README.md](../../capture/README.md) — research → vault flow
