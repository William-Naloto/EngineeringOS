# EKL v1.0 — Compatibility

> **Companion to:** [specification.md](specification.md)  
> **Defines:** Versioning and backward compatibility rules

---

## 1. Versioning scheme

EKL uses **Semantic Versioning 2.0.0** at three levels:

| Level | Example | Independent? |
|-------|---------|--------------|
| EKL specification | `1.0.0` | Yes |
| Reference implementation release | `v0.1.1` | Yes |
| Knowledge node | `skill.fabric.semantic-model v2.1.0` | Yes |
| Compiler | `reference/cursor v0.3.0` | Yes |

---

## 2. EKL specification versioning

### 2.1 MAJOR version (breaking)

A MAJOR bump is REQUIRED when:

- Removing a required contract field
- Changing the meaning of a required field
- Changing identifier format rules
- Removing an artifact type
- Changing resolution algorithm incompatibly

### 2.2 MINOR version (backward compatible)

A MINOR bump MAY add:

- Optional contract fields
- New artifact types (with defaults for existing parsers)
- New compilation target abstractions
- New validation SHOULD checks

### 2.3 PATCH version

A PATCH bump MAY fix:

- Clarifications in specification text
- Non-normative examples
- Schema corrections that don't change validation behavior

---

## 3. Backward compatibility rules

### 3.1 Artifact compatibility

- MINOR artifact versions MUST remain backward compatible within the same `id`
- Removing a required field from a contract is a MAJOR artifact version change
- Compilers MUST reject unknown **mandatory** fields in strict mode
- Compilers SHOULD emit warnings for unknown optional fields
- Deprecated fields SHOULD emit warnings for one MINOR EKL version before removal

### 3.2 Parser compatibility

- Parsers MUST accept all EKL v1.0 artifacts when implementing v1.x
- Parsers MUST NOT silently ignore required fields
- Parsers SHOULD support `ekl_version` field in build configuration

### 3.3 Compiler compatibility

- Compilers MUST declare supported `ekl_version` range in manifest
- Compilers MUST reject artifacts above their supported EKL version in strict mode
- Compilers SHOULD degrade gracefully in permissive mode with warnings

### 3.4 Third-party packs

- Third-party knowledge packs MUST declare `ekl_version` compatibility
- Packs targeting EKL v1 MUST use v1 contract fields only
- Pack authors MUST NOT fork the specification — extend via `provides` tokens and new artifact IDs

---

## 4. Migration rules

### 4.1 Deprecated artifacts

- `status: deprecated` artifacts MUST remain for at least one reference implementation MINOR release
- `replaces` field MUST point to the successor artifact
- Compilers SHOULD include migration notices in output for deprecated nodes

### 4.2 Specification upgrades

When EKL v2 is released:

- v1 artifacts MUST continue to compile under v1 compilers
- v2 compilers MUST support v1 artifacts in compatibility mode
- Migration guides MUST be published as ADRs in the reference implementation

---

## 5. Lock files

Reference implementation releases SHOULD publish lock files pinning:

```yaml
ekl_version: "1.0.0"
engineeringos_version: "0.1.1"
nodes:
  - id: topic.architecture.design-principles
    version: "0.1.0"
```

---

## 6. References

- [SemVer 2.0.0](https://semver.org/)
- [specification.md](specification.md)
- [contracts.md](contracts.md)
