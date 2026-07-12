# Competencies

> **Sprint 1 active**  
> **Classification:** Recommendation

Competencies are **professional role knowledge bases** — not single skills, not prompt files.

## Competency vs Skill

| | Competency | Skill |
|---|-----------|-------|
| **Represents** | A professional role | One atomic capability |
| **Scope** | 15–20+ interconnected topics | One task |
| **Example** | Principal Software Architect | How to write an ADR |
| **Analogy** | Job description + expertise | Single procedure |
| **Location** | `competencies/<role>/` | Within competency or pack |

Think **Principal Microsoft Fabric Engineer**, not "Fabric Skill."

A Fabric competency contains: architecture, patterns, anti-patterns, performance, security, governance, semantic models, pipelines, eventstream, monitoring, testing, review, troubleshooting, communication, documentation.

## Organizational model

```
Engineering
    ↓
Competencies (who you are as an engineer)
    ↓
Capabilities (what you can accomplish)
    ↓
Projects (where it's validated)
```

## Active competencies

| Competency | ID | Sprint | Status |
|------------|-----|--------|--------|
| [Principal Software Architect](principal-software-architect/) | `competency.principal-software-architect` | Sprint 1 | 🚧 In progress |

## Planned competencies

| Competency | Sprint | Enables |
|------------|--------|---------|
| Principal Reviewer | Sprint 1 (supporting) | Review PR capability |
| Principal Microsoft Fabric Engineer | Sprint 3 | Fabric Solution capability |

## Structure

```
competencies/<role>/
├── manifest.yaml          # Knowledge Contract + topic inventory
├── README.md              # Competency overview
├── architecture.md        # Topic files (15–20)
├── design-principles.md
├── ...
└── anti-patterns.md
```

Each topic file implements the [Knowledge Contract](../KNOWLEDGE_CONTRACT.md) with Evidence.

## Evolution policy

Competencies evolve per [ADR 0014](../adr/0014-knowledge-evolution-policy.md) — after project completion, not during development.
