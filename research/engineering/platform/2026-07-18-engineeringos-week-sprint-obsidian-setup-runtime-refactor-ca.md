# Research: EngineeringOS week sprint — Obsidian setup, runtime refactor, capture inventory

> Date: 2026-07-18
> Author: William Naloto
> Project: EngineeringOS / Cursor
> Status: extracted
> Reviewed: 2026-07-18
> Reviewer: EngineeringOS Maintainers
> Vendor: engineering
> Domain: platform

## Context

Sprint semanal no Cursor (12–18 Jul 2026) para colocar o EngineeringOS em operação: MCP no Cursor, catalogação de capabilities, compiladores Cursor/Obsidian, capture pipeline, overlay do projeto BEES Unity Catalog, e refactor do runtime EOR.

**Commits na semana:** nenhum commit novo após `c484d5c` (Sprint 2 EOR) — todo o trabalho está em **49 arquivos modificados + 51 novos** (não commitados).

## Inventário — sessões Cursor

| Data | Sessão | Entregas |
|------|--------|----------|
| 12 Jul | Setup inicial + avaliação produto | MCP configurado, roadmap Obsidian, catalogação capabilities |
| 13 Jul | Capabilities + compile + capture | 5 capabilities, 4 packs, 7 skills, compile review-pr, capture MVP, overlay BEES |
| 18 Jul | Refactor + Obsidian ready | TypeScript build fix, Obsidian compiler enhanced, setup scripts, vault export (48 files) |

## Inventário — desenvolvimentos (não commitados)

### Runtime EOR (`runtime/`)

| Componente | Status | Detalhe |
|------------|--------|---------|
| MCP server | ✅ Operacional | 20 tools, stdio, `npm run mcp` |
| Cursor compiler | ✅ MVP | `runtime/compiler/cursor/` — rules `.mdc` + skills |
| Obsidian compiler | ✅ MVP | `runtime/compiler/obsidian/` — vault + wikilinks + graph |
| Capture service | ✅ MVP | `runtime/capture/` — learn/review/extract/status |
| Export/compile services | ✅ | `export-service.ts`, `compile-service.ts` |
| TypeScript build | ✅ Corrigido | `npm run build` passa (era 11 erros) |
| Testes | ✅ 57/57 | parser, validator, resolver, router, MCP, compilers, capture |

### Scripts CLI (`scripts/`)

| Script | Função |
|--------|--------|
| `setup.sh` | Setup completo (MCP + Obsidian) |
| `setup-obsidian.sh` | Export vault Obsidian |
| `setup-cursor-mcp.sh` | MCP Cursor only |
| `export-obsidian.ts` | CLI export Obsidian |
| `export-cursor.ts` | CLI compile Cursor |
| `capture.ts` | Capture pipeline CLI |
| `catalog-capabilities.ts` | Snapshot capability catalog |
| `install-project-cursor.sh` | Instala bundle no projeto consumer |

### Knowledge artifacts

| Tipo | Qtd | IDs principais |
|------|-----|----------------|
| Capabilities | 5 | review-pr, design-architecture, fabric-monitoring, platform-observability, data-feature-store |
| Packs | 4 | engineering, fabric, platform, data |
| Skills | 7 | cursor-compile, monitoring-setup, pipeline-health-check, newrelic-dashboard, slo-definition, databricks-unity-catalog-features, feature-store-design |
| Workflows | 1 | incident-response |
| Agents | 8 | reviewer, sre, principal-data-engineer, etc. |
| Project overlays | 1 | data-platform-bees-unity-catalog-service |

### Obsidian integration (18 Jul)

- Vault export: `dist/obsidian-vault/` (48 arquivos)
- `_index/CAPABILITIES.md`, `CAPABILITY_MATRIX.md`, `graph-overview.md`
- `_templates/research-note.md`
- Plugins recomendados: Dataview, Templater, Obsidian Git; Mermaid = core plugin (não Community)

## Observations

- (Fact) `npm run setup` instala deps, configura `.cursor/mcp.json`, e exporta vault Obsidian em um comando.
- (Fact) `npm run export:obsidian` gera 48 arquivos incluindo wikilinks, templates e graph Mermaid.
- (BestPractice) Editar sempre fonte canônico (`packs/`, `capabilities/`) — nunca `dist/obsidian-vault/` como source of truth.
- (BestPractice) Mermaid no Obsidian usa plugin **Core** (Settings → Core plugins → Mermaid), não Community plugin.
- (BestPractice) Capability-first routing: agentes carregam via `engineeringos.review`, não o repo inteiro.
- (BestPractice) Project overlays vivem só no EngineeringOS; consumer recebe compile local via `install-project-cursor.sh`.
- (Fact) Capture pipeline operacional: `learn → review → extract → publish` com MCP `engineeringos.capture`.
- (Fact) Skill `skill.engineering.cursor-compile` publicado em 13 Jul a partir de research aprovado.
- (Recommendation) Ritual semanal: `capture learn` + review + export Obsidian + atualizar CAPABILITY_MATRIX.
- (Recommendation) Commitar trabalho da semana em PR único: "Sprint 2B — compilers, capture, Obsidian ready".
- (Unknown) Wire project overlays no compile automático (overlayPath ainda não conectado ao EorContext).

## Sources

- Cursor sessions: 12, 13, 18 Jul 2026
- Git: `c484d5c` (base) + working tree 49M/51A files
- `research/engineering/platform/2026-07-13-mcp-cursor-compile-learnings.md`
- `packs/engineering/skills/cursor-compile.md`
- `QUICKSTART.md`, `capture/README.md`

## Open questions

- Quando commitar e taggear v0.1.2?
- Promover skills de `draft` → `experimental` em batch?
- Obsidian Git no vault ou só Git do repo canônico?

## Capture pipeline

| Stage | Status |
|-------|--------|
| Learn | ✅ |
| Review | ✅ |
| Extract | pending → skill.engineering.obsidian-export, skill.engineering.engineeringos-setup |
| Publish | pending |

## Skills a extrair desta semana

| Skill ID | Pack | Origem |
|----------|------|--------|
| `skill.engineering.obsidian-export` | engineering | Sessão 18 Jul — Obsidian vault setup |
| `skill.engineering.engineeringos-setup` | engineering | Sessão 18 Jul — npm run setup workflow |
| `skill.engineering.cursor-compile` | engineering | ✅ Já publicado 13 Jul |
