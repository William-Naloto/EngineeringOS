# Pipeline Stage: Resolver

> **EKL v1 — Normative**  
> **Also known as:** Dependency Resolver (reference implementation file name)

## Purpose

Build the complete knowledge graph for a compilation request.

## Inputs

- Normalized graph
- Build request: `activated_capabilities`, `activated_competencies`, project overlay
- `routing/manifest.yaml`

## Algorithm (MUST)

1. **Seed** — Load nodes for each activated capability
2. **Expand orchestration** — For each capability, load `orchestrates.agents`, `orchestrates.skills`, `orchestrates.workflows`, `orchestrates.competencies`
3. **Expand competencies** — Load all `topic.*` nodes listed in competency manifest
4. **Transitive dependencies** — Resolve `dependencies` recursively
5. **Filter** — Apply `status_filter`, `confidence_minimum`, `lifecycle` exclusions
6. **Topological sort** — Order nodes: standards → topics → skills → agents → capabilities
7. **Cap** — Enforce `max_artifacts_per_session` from routing defaults

## Outputs

- `resolved-graph.json` — ordered node list with edges
- `resolution-manifest.json` — which capabilities triggered which nodes

## Capability-first rule

Resolver MUST NOT load individual skills unless reached via capability orchestration or explicit build flag `include_orphan_skills: true`.
