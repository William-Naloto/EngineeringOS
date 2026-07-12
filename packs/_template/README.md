# Pack Template

> Copy this directory to create a new knowledge pack.

This is a **structural reference**, not a publishable pack.

## Usage

```bash
cp -r packs/_template packs/<your-pack-name>
```

Then edit `manifest.yaml`, `README.md`, and populate subdirectories.

## Structure

| Directory | Purpose |
|-----------|---------|
| `skills/` | Domain skills (`id: skill.<pack>.<name>`) |
| `workflows/` | Domain workflows (`id: workflow.<pack>.<name>`) |
| `templates/` | Reusable templates for this domain |
| `references/` | Curated external documentation links |
| `examples/` | Worked examples demonstrating skills |
| `changelog/` | Per-pack version history |

Every artifact must implement the [Knowledge Contract](../../KNOWLEDGE_CONTRACT.md).
