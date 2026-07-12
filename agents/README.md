# Agents

> **Status:** Placeholder (v0.1.1)  
> **Classification:** Recommendation

Agent personas define **who** the AI acts as — not **how** to do a task. Skills teach capabilities; agents define the lens.

## Personas vs Skills

| | Agent (persona) | Skill |
|---|----------------|-------|
| **Answers** | Who am I? | How do I do this? |
| **Defines** | Tone, priorities, scope, review criteria | Step-by-step instructions |
| **Changes** | Rarely | Frequently |
| **Location** | `agents/` | `packs/<pack>/skills/` |
| **Example** | "Review as a principal architect" | "How to review a semantic model" |

## Loading model

```
Routing matches task
    → Load agent persona (who)
    → Load relevant skills (how)
    → Agent applies skill through persona lens
```

Agents reference standards and skills by ID. They never duplicate knowledge content.

## Available personas

| File | ID | Status |
|------|-----|--------|
| [architect.md](architect.md) | `agent.architect` | Placeholder |
| [reviewer.md](reviewer.md) | `agent.reviewer` | Placeholder |
| [principal-data-engineer.md](principal-data-engineer.md) | `agent.principal-data-engineer` | Placeholder |
| [senior-python.md](senior-python.md) | `agent.senior-python` | Placeholder |
| [product-manager.md](product-manager.md) | `agent.product-manager` | Placeholder |
| [tpm.md](tpm.md) | `agent.tpm` | Placeholder |
| [technical-writer.md](technical-writer.md) | `agent.technical-writer` | Placeholder |
| [sre.md](sre.md) | `agent.sre` | Placeholder |

See [ADR 0005](../adr/0005-agents-as-personas.md).
