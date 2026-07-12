# EKL v1.0 — Semantics

> **Companion to:** [specification.md](specification.md)  
> **Defines:** Dependency, routing, validation, and lifecycle semantics

---

## 1. Dependency resolution

### 1.1 Resolution algorithm

Given a build request with activated capabilities `C`:

1. Parsers MUST load capability nodes for each `c ∈ C`
2. Resolvers MUST expand `orchestrates` (competencies, agents, skills, workflows)
3. Resolvers MUST expand competency manifests to include all `topic.*` nodes
4. Resolvers MUST transitively resolve `dependencies`
5. Resolvers MUST apply project overlay — overlay MUST win on conflict
6. Resolvers MUST filter by `status`, `confidence`, and `lifecycle` per build config
7. Resolvers MUST topologically sort the resulting graph
8. Resolvers SHOULD enforce `max_artifacts_per_session` cap

### 1.2 Capability-first routing

Routers MUST match capabilities before individual skills.

Individual skills MUST NOT be loaded unless:
- Reached via capability orchestration, OR
- Explicitly requested in build configuration (`include_orphan_skills: true`)

### 1.3 Acyclicity

- Dependency graphs MUST be acyclic
- Validators MUST reject builds with circular dependencies

---

## 2. Routing semantics

### 2.1 Context signals

Routers MAY match on:

| Signal | Description |
|--------|-------------|
| `query` | User message keywords |
| `file_pattern` | Open or referenced file globs |
| `tag` | Explicit tag from project overlay |
| `capability` | Explicit capability activation |
| `status` | Minimum status filter |
| `confidence` | Minimum confidence filter |

### 2.2 Resolution order

Routers MUST resolve in this priority:

```
capability → agent → competency topic → skill → workflow → standard
```

### 2.3 Exclusions

- Research artifacts MUST NOT be loaded by production routers
- `lifecycle: created` artifacts SHOULD NOT be loaded unless explicitly requested
- `status: deprecated` artifacts MUST NOT be loaded unless migration mode enabled

---

## 3. Validation semantics

### 3.1 Validator MUST checks

| Check | Action on failure |
|-------|-------------------|
| Contract schema valid | Reject node |
| Required fields present | Reject node |
| `id` globally unique | Reject build |
| `id` matches `type.domain.name` pattern | Reject node |
| No cyclic dependencies | Reject build |
| `## Evidence` section present | Reject node |
| `confidence: Unknown` + `status: stable` | Reject node (default) |
| `reviewed` set when `status: stable` | Reject node |
| Research in compile scope | Reject build |

Contract field rules in [contracts.md](contracts.md) §2–3 define the `id` pattern and `reviewed` requirements enforced above.

### 3.2 Validator SHOULD checks

| Check | Action on failure |
|-------|-------------------|
| `owner` in ownership registry (stable) | Warn or reject per config |
| `reviewed` stale (> 12 months, maintained) | Warn |
| Orphan skills (not referenced by any capability) | Warn |

### 3.3 Tiered validation (at scale)

| Tier | Scope | When |
|------|-------|------|
| Tier 1 | Contract compliance | Every change |
| Tier 2 | Test prompts | Changed nodes + dependents |
| Tier 3 | Full regression | Release only |

---

## 4. Lifecycle semantics

### 4.1 Status (loadability)

```
draft → experimental → stable → deprecated
```

| Status | Compilable by default? |
|--------|----------------------|
| `draft` | No |
| `experimental` | Opt-in |
| `stable` | Yes |
| `deprecated` | Migration mode only |

### 4.2 Lifecycle (provenance)

```
created → validated → published → maintained → deprecated
```

| Transition | Requirement |
|------------|-------------|
| → `validated` | Tier 1 validation passed |
| → `published` | `status: experimental` or `stable` |
| → `maintained` | Active review schedule |
| → `deprecated` | Successor identified; `replaces` set |

### 4.3 Knowledge evolution

Knowledge MUST be updated per project completion — not during active development. See reference implementation [ADR 0014](../adr/0014-knowledge-evolution-policy.md).

---

## 5. Optimizer semantics

Optimizers SHOULD:

- Deduplicate identical evidence tables
- Summarize bodies when over token budget
- Preserve all contract metadata even when body is summarized
- MUST NOT drop `status: stable` nodes without logging a warning

Priority order when truncating: capability > agent > competency topic > skill.

---

## 6. References

- [specification.md](specification.md)
- [contracts.md](contracts.md)
- [compatibility.md](compatibility.md)
