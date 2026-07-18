# Project Overlays

> **Boundary rule:** EngineeringOS never lives inside consumer repositories.

Project overlays describe **how** EngineeringOS capabilities map to external projects (AB InBev, client repos, etc.). They live **only** in this EngineeringOS repository and are never committed to consumer projects.

## Model

```
EngineeringOS (GitHub — canonical)
├── capabilities/          ← knowledge
├── packs/                 ← skills
├── project-overlays/      ← consumer project mapping (here)
│   └── <project-id>/
│       ├── manifest.yaml
│       └── context/
├── dist/                  ← compiled outputs (obsidian, cursor)
└── scripts/
    └── install-project-cursor.sh   ← local install to consumer (not committed)

Consumer project (Azure DevOps, etc.)
├── .cursor/rules/         ← project's own rules (tracked)
├── .cursor/rules/engineeringos/   ← LOCAL ONLY — installed by script, never commit
└── (no .engineeringos/, no EngineeringOS files tracked)
```

## Usage

1. Pick overlay: `project-overlays/<project-id>/`
2. Install Cursor bundles locally:

```bash
./scripts/install-project-cursor.sh /path/to/consumer/project
```

3. Use MCP `engineeringos` in Cursor while working in the consumer project
4. Capture learnings back to EngineeringOS — never to the consumer repo

## Registered overlays

| Project ID | Consumer repository | Program |
|------------|---------------------|---------|
| `data-platform-bees-unity-catalog-service` | `ab-inbev/GHQ_B2B_Delta/data-platform-bees-unity-catalog-service` | GHQ B2B Delta |
