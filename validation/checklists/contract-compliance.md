# Contract Compliance Checklist

> **Status:** Placeholder (v0.1.1)

Applies to **all** artifact types.

- [ ] Valid YAML frontmatter block at file top
- [ ] All required fields present (see KNOWLEDGE_CONTRACT.md)
- [ ] `id` is globally unique
- [ ] `status` is a valid enum value
- [ ] `classification` is a valid enum value
- [ ] `dependencies` reference existing artifact IDs
- [ ] No circular dependencies in dependency graph
- [ ] `updated` is ISO 8601 date
- [ ] `reviewed` is ISO 8601 date or null
