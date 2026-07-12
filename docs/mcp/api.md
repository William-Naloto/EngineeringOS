# EngineeringOS MCP API

> **Version:** 0.1.0-draft  
> **Status:** Architecture — no implementation  
> **Companion:** [specification.md](specification.md) · [runtime.md](runtime.md)

This document defines every MCP tool exposed by the EngineeringOS MCP Server. Each tool maps to an EOR operation. No implementation exists yet — this is the contract.

Tool names follow the pattern `engineeringos.<verb>`.

---

## 1. Conventions

### 1.1 Transport

Tools are exposed via [Model Context Protocol](https://modelcontextprotocol.io/) `tools/list` and `tools/call`.

### 1.2 Input validation

All tool inputs MUST be validated against the JSON Schema definitions below before execution.

### 1.3 Response envelope

All tools return the envelope defined in [specification.md §7.1](specification.md#71-response-envelope).

### 1.4 Scoping

Unless otherwise noted, scoped tools apply **capability-first routing** and MUST NOT load the entire repository.

---

## 2. Tool catalog

| Tool | Class | Description |
|------|-------|-------------|
| [engineeringos.status](#engineeringosstatus) | Read | Repository and runtime status |
| [engineeringos.capabilities](#engineeringoscapabilities) | Read | List capabilities |
| [engineeringos.competencies](#engineeringoscompetencies) | Read | List competencies |
| [engineeringos.skills](#engineeringosskills) | Read | Search skills |
| [engineeringos.find](#engineeringosfind) | Read | Find artifacts by query |
| [engineeringos.review](#engineeringosreview) | Transform | Review a capability |
| [engineeringos.compile](#engineeringoscompile) | Transform | Compile for a runtime target |
| [engineeringos.dependencies](#engineeringosdependencies) | Read | Show dependency graph |
| [engineeringos.roadmap](#engineeringosroadmap) | Read | Return roadmap status |
| [engineeringos.progress](#engineeringosprogress) | Read | Return sprint progress |
| [engineeringos.validate](#engineeringosvalidate) | Validate | Validate repository or scope |
| [engineeringos.graph](#engineeringosgraph) | Read | Return capability graph |
| [engineeringos.search](#engineeringossearch) | Read | Semantic and keyword search |
| [engineeringos.adr](#engineeringosadr) | Read | Search ADRs |
| [engineeringos.pack](#engineeringospack) | Read | Return pack information |
| [engineeringos.owner](#engineeringosowner) | Read | Show ownership |
| [engineeringos.evidence](#engineeringosevidence) | Read | Return evidence chain |
| [engineeringos.snapshot](#engineeringossnapshot) | Transform | Generate consultant snapshot |
| [engineeringos.export](#engineeringosexport) | Transform | Export documentation |

---

## 3. Tool definitions

### engineeringos.status

Returns repository and runtime health status.

**Input:**

```json
{
  "type": "object",
  "properties": {},
  "additionalProperties": false
}
```

**Output `data`:**

```json
{
  "type": "object",
  "required": ["repository", "runtime", "index"],
  "properties": {
    "repository": {
      "type": "object",
      "properties": {
        "root": { "type": "string" },
        "ekl_version": { "type": "string" },
        "release": { "type": "string" },
        "artifact_count": { "type": "integer" }
      }
    },
    "runtime": {
      "type": "object",
      "properties": {
        "phase": { "enum": ["INIT", "READY", "ACTIVE", "SHUTDOWN"] },
        "eor_version": { "type": "string" }
      }
    },
    "index": {
      "type": "object",
      "properties": {
        "built_at": { "type": "string", "format": "date-time" },
        "entries": { "type": "integer" },
        "types": { "type": "object", "additionalProperties": { "type": "integer" } }
      }
    }
  }
}
```

---

### engineeringos.capabilities

List capabilities with optional filtering.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "domain": { "type": "string", "description": "Filter by domain segment" },
    "status": { "enum": ["draft", "experimental", "stable", "deprecated"] },
    "provides": { "type": "string", "description": "Filter by provides token" },
    "limit": { "type": "integer", "default": 50, "maximum": 200 }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "capabilities": {
      "type": "array",
      "items": { "$ref": "#/definitions/ArtifactSummary" }
    },
    "total": { "type": "integer" }
  }
}
```

---

### engineeringos.competencies

List competencies with topic counts.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "status": { "enum": ["draft", "experimental", "stable", "deprecated"] },
    "enables_capability": { "type": "string", "description": "Filter by enabled capability ID" },
    "limit": { "type": "integer", "default": 50 }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "competencies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "version": { "type": "string" },
          "status": { "type": "string" },
          "topic_count": { "type": "integer" },
          "enables_capabilities": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "total": { "type": "integer" }
  }
}
```

---

### engineeringos.skills

Search skills within scope.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string", "description": "Keyword search" },
    "pack": { "type": "string", "description": "Filter by pack ID" },
    "capability": { "type": "string", "description": "Scope to capability orchestration" },
    "status": { "enum": ["draft", "experimental", "stable", "deprecated"] },
    "include_orphan": { "type": "boolean", "default": false },
    "limit": { "type": "integer", "default": 50 }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "skills": { "type": "array", "items": { "$ref": "#/definitions/ArtifactSummary" } },
    "total": { "type": "integer" },
    "scoped_by_capability": { "type": "string" }
  }
}
```

---

### engineeringos.find

Find artifacts by ID, query, or type.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "Exact artifact ID" },
    "query": { "type": "string", "description": "Fuzzy search across IDs and paths" },
    "type": { "enum": ["capability", "competency", "skill", "workflow", "standard", "agent", "pack", "template", "adr"] },
    "limit": { "type": "integer", "default": 20 }
  },
  "anyOf": [
    { "required": ["id"] },
    { "required": ["query"] },
    { "required": ["type"] }
  ]
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "artifacts": { "type": "array", "items": { "$ref": "#/definitions/ArtifactSummary" } },
    "total": { "type": "integer" }
  }
}
```

---

### engineeringos.review

Review a capability — resolve its subgraph and return a structured review context.

**Input:**

```json
{
  "type": "object",
  "required": ["capability"],
  "properties": {
    "capability": { "type": "string", "description": "Capability ID to review" },
    "include_body": { "type": "boolean", "default": true },
    "include_evidence": { "type": "boolean", "default": true },
    "min_confidence": { "enum": ["High", "Medium", "Low", "Unknown"], "default": "Low" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "capability": { "$ref": "#/definitions/ArtifactDetail" },
    "resolved": {
      "type": "object",
      "properties": {
        "competencies": { "type": "array", "items": { "$ref": "#/definitions/ArtifactDetail" } },
        "skills": { "type": "array", "items": { "$ref": "#/definitions/ArtifactDetail" } },
        "workflows": { "type": "array", "items": { "$ref": "#/definitions/ArtifactDetail" } },
        "standards": { "type": "array", "items": { "$ref": "#/definitions/ArtifactDetail" } },
        "agents": { "type": "array", "items": { "$ref": "#/definitions/ArtifactDetail" } }
      }
    },
    "validation": { "$ref": "#/definitions/ValidationReport" },
    "order": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

### engineeringos.compile

Compile resolved knowledge for a compiler target.

**Input:**

```json
{
  "type": "object",
  "required": ["target", "capability"],
  "properties": {
    "target": {
      "enum": ["cursor", "claude", "copilot", "openhands", "gemini", "agents-md", "obsidian", "notebooklm", "confluence", "mkdocs", "docusaurus"]
    },
    "capability": { "type": "string" },
    "output_dir": { "type": "string", "description": "Output directory (default: temp)" },
    "min_status": { "enum": ["draft", "experimental", "stable"], "default": "stable" },
    "min_confidence": { "enum": ["High", "Medium", "Low", "Unknown"], "default": "Medium" },
    "project_overlay": { "type": "string", "description": "Path to .engineeringos/ overlay" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "target": { "type": "string" },
    "capability": { "type": "string" },
    "artifacts_compiled": { "type": "integer" },
    "output_files": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "path": { "type": "string" },
          "type": { "type": "string" },
          "size_bytes": { "type": "integer" }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

### engineeringos.dependencies

Show dependency graph for an artifact.

**Input:**

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": { "type": "string" },
    "depth": { "type": "integer", "default": -1, "description": "-1 for transitive closure" },
    "direction": { "enum": ["downstream", "upstream", "both"], "default": "downstream" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "root": { "type": "string" },
    "nodes": { "type": "array", "items": { "$ref": "#/definitions/GraphNode" } },
    "edges": { "type": "array", "items": { "$ref": "#/definitions/GraphEdge" } }
  }
}
```

---

### engineeringos.roadmap

Return roadmap status from `ROADMAP.md`.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "milestone": { "type": "string", "description": "Filter by milestone name" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "current_milestone": { "type": "string" },
    "milestones": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "status": { "type": "string" },
          "focus": { "type": "string" }
        }
      }
    }
  }
}
```

---

### engineeringos.progress

Return sprint progress from `PROGRESS.md`.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "sprint": { "type": "string" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "current_sprint": { "type": "string" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "item": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  }
}
```

---

### engineeringos.validate

Validate repository or scoped artifacts.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "scope": {
      "enum": ["all", "capability", "pack", "changed"],
      "default": "all"
    },
    "capability": { "type": "string", "description": "Required when scope=capability" },
    "pack": { "type": "string", "description": "Required when scope=pack" },
    "tiers": {
      "type": "array",
      "items": { "enum": ["schema", "dependency", "lifecycle", "evidence", "ownership", "version"] },
      "default": ["schema", "dependency", "lifecycle", "evidence"]
    },
    "fail_on_warnings": { "type": "boolean", "default": false }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "valid": { "type": "boolean" },
    "artifacts_checked": { "type": "integer" },
    "errors": { "type": "array", "items": { "$ref": "#/definitions/ValidationIssue" } },
    "warnings": { "type": "array", "items": { "$ref": "#/definitions/ValidationIssue" } }
  }
}
```

---

### engineeringos.graph

Return capability orchestration graph.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "capability": { "type": "string", "description": "Root capability (omit for all)" },
    "format": { "enum": ["json", "mermaid"], "default": "json" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "nodes": { "type": "array", "items": { "$ref": "#/definitions/GraphNode" } },
    "edges": { "type": "array", "items": { "$ref": "#/definitions/GraphEdge" } },
    "mermaid": { "type": "string", "description": "Present when format=mermaid" }
  }
}
```

---

### engineeringos.search

Semantic and keyword search across artifacts.

**Input:**

```json
{
  "type": "object",
  "required": ["query"],
  "properties": {
    "query": { "type": "string" },
    "mode": { "enum": ["keyword", "semantic", "hybrid"], "default": "hybrid" },
    "type": { "enum": ["capability", "competency", "skill", "workflow", "standard", "agent", "adr"] },
    "limit": { "type": "integer", "default": 20 }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "artifact": { "$ref": "#/definitions/ArtifactSummary" },
          "score": { "type": "number" },
          "snippet": { "type": "string" }
        }
      }
    },
    "total": { "type": "integer" }
  }
}
```

---

### engineeringos.adr

Search Architecture Decision Records.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string" },
    "number": { "type": "integer", "description": "ADR number (e.g. 15 for ADR-0015)" },
    "limit": { "type": "integer", "default": 10 }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "adrs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "number": { "type": "integer" },
          "title": { "type": "string" },
          "path": { "type": "string" },
          "status": { "type": "string" },
          "snippet": { "type": "string" }
        }
      }
    },
    "total": { "type": "integer" }
  }
}
```

---

### engineeringos.pack

Return pack information and contained artifacts.

**Input:**

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": { "type": "string", "description": "Pack ID (e.g. pack.fabric)" },
    "include_artifacts": { "type": "boolean", "default": true }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "pack": { "$ref": "#/definitions/ArtifactSummary" },
    "manifest": {
      "type": "object",
      "properties": {
        "skills": { "type": "array", "items": { "type": "string" } },
        "workflows": { "type": "array", "items": { "type": "string" } },
        "templates": { "type": "array", "items": { "type": "string" } }
      }
    },
    "artifacts": { "type": "array", "items": { "$ref": "#/definitions/ArtifactSummary" } }
  }
}
```

---

### engineeringos.owner

Show ownership for an artifact and its subtree.

**Input:**

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "Artifact ID" },
    "owner": { "type": "string", "description": "List all artifacts by owner" }
  },
  "anyOf": [
    { "required": ["id"] },
    { "required": ["owner"] }
  ]
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "owner": { "type": "string" },
    "artifacts": { "type": "array", "items": { "$ref": "#/definitions/ArtifactSummary" } },
    "registry_match": { "type": "boolean" }
  }
}
```

---

### engineeringos.evidence

Return evidence chain for an artifact.

**Input:**

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": { "type": "string" },
    "transitive": { "type": "boolean", "default": false, "description": "Include dependency evidence" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "artifact_id": { "type": "string" },
    "confidence": { "enum": ["High", "Medium", "Low", "Unknown"] },
    "evidence": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "source": { "type": "string" },
          "type": { "type": "string" },
          "confidence_contribution": { "type": "string" },
          "from_artifact": { "type": "string", "description": "Present when transitive=true" }
        }
      }
    }
  }
}
```

---

### engineeringos.snapshot

Generate a consultant-ready snapshot of resolved knowledge.

**Input:**

```json
{
  "type": "object",
  "required": ["capability"],
  "properties": {
    "capability": { "type": "string" },
    "format": { "enum": ["markdown", "json"], "default": "markdown" },
    "include_evidence": { "type": "boolean", "default": true },
    "include_graph": { "type": "boolean", "default": true }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "capability": { "type": "string" },
    "format": { "type": "string" },
    "content": { "type": "string", "description": "Rendered snapshot" },
    "artifacts_included": { "type": "integer" },
    "generated_at": { "type": "string", "format": "date-time" }
  }
}
```

---

### engineeringos.export

Export documentation for a compiler target.

**Input:**

```json
{
  "type": "object",
  "required": ["target"],
  "properties": {
    "target": {
      "enum": ["mkdocs", "docusaurus", "confluence", "obsidian", "notebooklm"]
    },
    "scope": { "enum": ["all", "pack", "capability"], "default": "all" },
    "pack": { "type": "string" },
    "capability": { "type": "string" },
    "output_dir": { "type": "string" }
  }
}
```

**Output `data`:**

```json
{
  "type": "object",
  "properties": {
    "target": { "type": "string" },
    "output_dir": { "type": "string" },
    "files_written": { "type": "integer" },
    "output_files": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

## 4. Shared definitions

### ArtifactSummary

```json
{
  "type": "object",
  "required": ["id", "type", "version", "status"],
  "properties": {
    "id": { "type": "string" },
    "type": { "type": "string" },
    "version": { "type": "string" },
    "status": { "type": "string" },
    "lifecycle": { "type": "string" },
    "owner": { "type": "string" },
    "confidence": { "type": "string" },
    "path": { "type": "string" },
    "provides": { "type": "array", "items": { "type": "string" } }
  }
}
```

### ArtifactDetail

Extends `ArtifactSummary` with:

```json
{
  "properties": {
    "body": { "type": "string" },
    "evidence": { "type": "array" },
    "dependencies": { "type": "array", "items": { "type": "string" } },
    "orchestrates": { "type": "object" },
    "validation_state": { "$ref": "#/definitions/ValidationReport" }
  }
}
```

### GraphNode

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "type": { "type": "string" },
    "version": { "type": "string" },
    "status": { "type": "string" }
  }
}
```

### GraphEdge

```json
{
  "type": "object",
  "properties": {
    "from": { "type": "string" },
    "to": { "type": "string" },
    "type": { "enum": ["depends_on", "orchestrates", "topic_of", "replaces", "enables"] }
  }
}
```

### ValidationIssue

```json
{
  "type": "object",
  "properties": {
    "artifact_id": { "type": "string" },
    "tier": { "type": "string" },
    "code": { "type": "string" },
    "message": { "type": "string" },
    "path": { "type": "string" }
  }
}
```

### ValidationReport

```json
{
  "type": "object",
  "properties": {
    "valid": { "type": "boolean" },
    "errors": { "type": "array", "items": { "$ref": "#/definitions/ValidationIssue" } },
    "warnings": { "type": "array", "items": { "$ref": "#/definitions/ValidationIssue" } }
  }
}
```

---

## 5. Error mapping

| Tool | Common errors |
|------|---------------|
| All | `INVALID_INPUT`, `NOT_READY`, `INTERNAL_ERROR` |
| Scoped tools | `NOT_FOUND`, `SCOPE_TOO_LARGE` |
| compile, export | `TARGET_UNSUPPORTED`, `VALIDATION_FAILED` |
| dependencies, graph | `CYCLE_DETECTED` |
| validate | `VALIDATION_FAILED` |

---

## 6. MCP registration

When implemented, the MCP server MUST register all tools via `tools/list` with descriptions derived from this document. Tool names MUST NOT be prefixed with the server name in the MCP protocol layer (MCP handles namespacing).

Example `tools/list` entry:

```json
{
  "name": "engineeringos.compile",
  "description": "Compile resolved EKL knowledge for a compiler target (Cursor, Claude, MkDocs, etc.)",
  "inputSchema": { }
}
```

---

## 7. Related documents

| Document | Purpose |
|----------|---------|
| [specification.md](specification.md) | Architecture and lifecycle |
| [runtime.md](runtime.md) | Stage behavior per tool |
| [domain-model.md](domain-model.md) | Entity types in responses |
| `runtime/api/interfaces.ts` | TypeScript interface stubs |
