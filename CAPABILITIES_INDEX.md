# Capabilities Index

> **Version:** 0.1.1-RC1  
> **Last updated:** 2026-07-12  
> **Total capabilities:** 5 (0 stable)

Registry of capability artifacts — orchestration recipes the router loads **first**.

For coverage status, see [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md).

> **Scale note:** This index will be **generated** from contract frontmatter at v0.2 (ADR 0012). Manual updates acceptable during RC1 only.

---

## Index Format

| Field | Description |
|-------|-------------|
| `id` | `capability.<domain>.<name>` |
| `title` | Human-readable name |
| `version` | SemVer |
| `status` | draft · experimental · stable · deprecated |
| `confidence` | High · Medium · Low · Unknown |
| `provides` | Provides tokens |
| `orchestrates` | Agents, skills, workflows composed |
| `path` | Relative path |

---

## Capabilities by Domain

### engineering

| id | title | version | status | confidence | provides | path |
|----|-------|---------|--------|------------|----------|------|
| capability.engineering.review-pr | Review Pull Request | 0.1.0 | draft | Unknown | code-review, pull-request-review | capabilities/engineering/review-pr.md |
| capability.engineering.design-architecture | Design Architecture | 0.1.0 | draft | Unknown | architecture-design, system-design | capabilities/engineering/design-architecture.md |

### fabric

| id | title | version | status | confidence | provides | path |
|----|-------|---------|--------|------------|----------|------|
| capability.fabric.monitoring | Fabric Monitoring | 0.1.0 | draft | Unknown | fabric-monitoring | capabilities/fabric/monitoring.md |

### platform

| id | title | version | status | confidence | provides | path |
|----|-------|---------|--------|------------|----------|------|
| capability.platform.observability | Platform Observability | 0.1.0 | draft | Unknown | platform-observability | capabilities/platform/observability.md |

### data

| id | title | version | status | confidence | provides | path |
|----|-------|---------|--------|------------|----------|------|
| capability.data.feature-store | Feature Store | 0.1.0 | draft | Unknown | feature-store | capabilities/data/feature-store.md |

---

## Capabilities by Status

| Status | Count |
|--------|-------|
| stable | 0 |
| experimental | 0 |
| draft | 5 |
| deprecated | 0 |

---

## Planned Capabilities (v0.4)

| Capability | Domain | Needs (estimated) |
|------------|--------|-------------------|
| Build Dashboard | fabric | 6 skills, 2 workflows, 1 agent, 3 templates |
| Incident RCA | platform | 4 skills, 1 workflow, 1 agent |
| Feature Development | engineering | 5 skills, 2 workflows, 2 agents |
| FinOps Analysis | platform | 3 skills, 1 workflow, 1 agent |

Progress measured by **what AI can accomplish**, not file count. See [ROADMAP.md](ROADMAP.md).

---

## Adding a Capability

1. Create `capabilities/<domain>/<name>.md` with full Knowledge Contract + Evidence section
2. Define `orchestrates` (agents, skills, workflows)
3. Update this index and [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md)
4. Add routing rule in `routing/manifest.yaml`
5. Pass validation before promotion

See [CONTRIBUTING.md](CONTRIBUTING.md) and [capabilities/README.md](capabilities/README.md).
