# EKL v1.0 — Contracts

> **Companion to:** [specification.md](specification.md)  
> **Defines:** Canonical AST node (Knowledge Contract)

---

## 1. Knowledge Node

A **Knowledge Node** is the atomic unit of the canonical AST:

```
KnowledgeNode {
  contract: ContractMetadata   // YAML frontmatter
  body: MarkdownPayload        // Markdown content
  evidence: EvidenceTable      // Required ## Evidence section
}
```

Parsers MUST extract all three components. Validators MUST reject nodes missing any component.

---

## 2. Contract metadata (required fields)

| Field | Type | Rule |
|-------|------|------|
| `id` | string | MUST be globally unique; pattern `type.domain.name` |
| `version` | semver | MUST follow SemVer 2.0.0 |
| `status` | enum | MUST be `draft` \| `experimental` \| `stable` \| `deprecated` |
| `lifecycle` | enum | MUST be `created` \| `validated` \| `published` \| `maintained` \| `deprecated` |
| `owner` | string | MUST be non-empty |
| `classification` | enum | MUST be `Fact` \| `BestPractice` \| `Recommendation` \| `Experimental` |
| `confidence` | enum | MUST be `High` \| `Medium` \| `Low` \| `Unknown` |
| `dependencies` | string[] | MUST be present (empty array if none) |
| `provides` | string[] | MUST be present |
| `requires` | string[] | MUST be present |
| `references` | string[] | MUST be present |
| `updated` | date | MUST be ISO 8601 |
| `reviewed` | date \| null | MUST be present |

### 2.1 Optional fields

| Field | Type | Rule |
|-------|------|------|
| `orchestrates` | object | SHOULD be present on `capability.*` artifacts |
| `replaces` | string | MUST be set when `status: deprecated` |
| `tags` | string[] | MAY be present |
| `triggers` | string[] | MAY be present for routing |

### 2.2 Capability orchestration

Capability artifacts SHOULD include:

```yaml
orchestrates:
  competencies: []
  agents: []
  skills: []
  workflows: []
```

---

## 3. Normative contract rules

- Artifacts MUST have a unique identifier across the entire knowledge graph
- `confidence: Unknown` MUST NOT be compiled to stable targets by default
- `status: stable` artifacts MUST have `reviewed` set to a valid ISO 8601 date
- `status: deprecated` artifacts MUST include `replaces` pointing to a successor
- Compilers SHOULD preserve `classification` and `confidence` in output metadata
- Compilers MUST preserve evidence citations in output

---

## 4. Evidence section

Every artifact body MUST contain:

```markdown
## Evidence

| Source | Type | Confidence contribution |
|--------|------|------------------------|
| ... | ... | ... |
```

### 4.1 Evidence types

| Type | Description |
|------|-------------|
| `Official documentation` | Vendor or standards body |
| `RFC` | Formal specification |
| `Internal experience` | Validated project outcome |
| `Industry practice` | Widely adopted pattern |
| `Benchmark` | Measured data |
| `Internal decision` | ADR or governance document |

Validators MUST reject nodes without an `## Evidence` section.

---

## 5. Schema

Machine validation SHOULD use `schemas/knowledge-contract.schema.yaml` (JSON Schema — see [standards-alignment.md](standards-alignment.md)).

Human-readable guide: [KNOWLEDGE_CONTRACT.md](../KNOWLEDGE_CONTRACT.md) in the reference implementation.

---

## 6. AST graph

Knowledge nodes form a **directed acyclic graph**:

- Edges from `dependencies` and `orchestrates` fields
- Resolvers MUST reject cycles
- Resolvers MUST produce topological ordering

```
GraphNode { id, version, edges: [target_id, ...] }
```

---

## 7. References

- [specification.md](specification.md)
- [semantics.md](semantics.md)
- [compatibility.md](compatibility.md)
- [schemas/knowledge-contract.schema.yaml](../schemas/knowledge-contract.schema.yaml)
