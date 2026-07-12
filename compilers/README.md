# Compilers

> **Version:** 0.1.1  
> **Classification:** Recommendation

Compilers transform canonical engineering knowledge into **AI Context** and other output formats. EngineeringOS is the single source of truth — every consumer is a compilation target.

## Engineering Knowledge Compiler (EKC)

Internally: **EKC** — maintain one versioned source, validate with evidence, compile to any format.

```
Canonical knowledge (competencies, capabilities, agents)
    ↓ compiler
AI Context → Cursor · Claude · Copilot · Gemini CLI · OpenHands · Roo · Cline · Windsurf
    ↓ compiler
Documentation → MkDocs · Docusaurus · Confluence · GitHub Wiki
    ↓ compiler
Knowledge tools → Obsidian Vault · NotebookLM package
```

**Not** "generate Cursor Rules." **Generate AI Context** — and everything else is another target.

## Compiler responsibilities

1. **Resolve** — Read artifacts by ID; resolve `dependencies` transitively
2. **Filter** — Apply routing rules and project overlay configuration
3. **Transform** — Convert Markdown + contract to IDE-native format
4. **Write** — Output to configured destination path
5. **Report** — Log compiled artifacts, versions, and warnings

Compilers **never modify** canonical source in `standards/`, `packs/`, or `agents/`.

## Planned compilers

| Compiler | Target | Output | Status |
|----------|--------|--------|--------|
| `cursor/` | Cursor IDE | `.cursor/rules/*.mdc`, skills | Not started |
| `claude-code/` | Claude Code | `CLAUDE.md` | Not started |
| `copilot/` | GitHub Copilot | `.github/copilot-instructions.md` | Not started |
| `openhands/` | OpenHands | Config files | Not started |
| `windsurf/` | Windsurf | Rule files | Not started |

## Input resolution order

```
1. Project overlay (.engineeringos/manifest.yaml)
2. Activated packs (packs/<name>/manifest.yaml)
3. Referenced standards (standards/)
4. Agent personas (agents/) — if configured
5. Routing rules (routing/manifest.yaml)
```

## Output policy

| Option | Recommendation |
|--------|---------------|
| Commit compiled output | Convenient for teams without build step |
| Gitignore compiled output | Cleaner repo; requires CI build |

**Decision deferred to v0.5.** See [ADR 0007](../adr/0007-compilation-model.md).

## Relationship to adapters

| | Compilers | Adapters |
|---|-----------|----------|
| **When** | Build time | Runtime |
| **Purpose** | Generate IDE config files | Live integration hooks (MCP, routing) |
| **Output** | Static files | Dynamic connections |

Both reference canonical source by ID. Neither duplicates knowledge.

## CLI (planned v1.0)

```bash
eos compile --target cursor --packs fabric,python --output ./my-project
eos compile --target claude-code --agents architect,reviewer
eos validate --all
eos route --query "review this PR"
```

**Classification:** Experimental idea
