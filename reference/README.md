# Reference Implementations

> **EKL v1** — These implement the [specification](../spec/specification.md). They are NOT the specification.

The specification (`spec/`) is vendor-neutral. This directory contains **reference compilers** that map EKL canonical AST to concrete runtime products.

---

## Spec vs reference

| | `spec/` | `reference/` |
|---|---------|--------------|
| **Contains** | Normative EKL rules | Compiler implementations |
| **Mentions vendors?** | MUST NOT | Yes |
| **Required for EKL compliance?** | Yes | No (third parties MAY implement) |

---

## Registered reference targets

| Target | EKL abstract target | Location | Status |
|--------|-------------------|----------|--------|
| Cursor | `ai-context-rules` | [cursor/](cursor/) | Spec only |
| Claude Code | `ai-context-instructions` | [claude/](claude/) | Spec only |
| GitHub Copilot | `ai-context-instructions` | [copilot/](copilot/) | Spec only |
| AGENTS.md | `ai-context-agents` | [agents-md/](agents-md/) | Spec only |
| OpenHands | `ai-context-agents` | [openhands/](openhands/) | Spec only |
| Roo Code | `ai-context-rules` | [roo/](roo/) | Spec only |
| Windsurf | `ai-context-rules` | [windsurf/](windsurf/) | Spec only |
| Obsidian | `knowledge-vault` | [obsidian/](obsidian/) | Spec only |

## Planned reference targets

| Target | EKL abstract target |
|--------|-------------------|
| NotebookLM | `knowledge-vault` |
| MkDocs / Docusaurus | `documentation-site` |
| Confluence | `wiki` |

---

## Reference compiler contract

Each `reference/<target>/` MUST include:

1. `README.md` — maps EKL abstract target to concrete product
2. `compiler-manifest.yaml` — `ekl_version`, supported features, output paths
3. Implementation (when built) — consumes canonical AST, emits target output

Reference compilers MUST NOT modify canonical source.

---

## CLI (reference implementation)

```bash
ekl build --target cursor --capability capability.engineering.review-pr --output ./my-project
ekl validate --all
ekl resolve --capability capability.engineering.review-pr
```

Binary and package name: `ekl` (Engineering Knowledge Language CLI).

---

## See also

- [SPECIFICATION.md](../SPECIFICATION.md)
- [pipeline/README.md](../pipeline/README.md)
- [compilers/README.md](../compilers/README.md) — implementation workspace (links here)
