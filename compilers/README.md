# Compilers

> **Reference implementation workspace**  
> **Specification:** [SPECIFICATION.md](../SPECIFICATION.md)  
> **Target specs:** [reference/](../reference/)

Compilers are **replaceable**. Canonical knowledge is **not**.

```
Canonical AST  →  reference/<target>/  →  Runtime output
```

## EKL abstract targets → reference implementations

| Abstract target | Reference |
|-----------------|-----------|
| `ai-context-rules` | [reference/cursor/](../reference/cursor/), [reference/roo/](../reference/roo/), [reference/windsurf/](../reference/windsurf/) |
| `ai-context-instructions` | [reference/claude/](../reference/claude/), [reference/copilot/](../reference/copilot/) |
| `ai-context-agents` | [reference/agents-md/](../reference/agents-md/), [reference/openhands/](../reference/openhands/) |

The [specification](../spec/specification.md) MUST NOT name vendor products.

## CLI

```bash
ekl build --target cursor --output ./my-project
```

Implementation paused — see [ROADMAP.md](../ROADMAP.md).
