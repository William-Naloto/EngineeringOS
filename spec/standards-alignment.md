# EKL v1.0 — Standards Alignment Review

> **Milestone:** Standards Alignment (pre-implementation)  
> **Date:** 2026-07-12  
> **Classification:** Recommendation

Before implementing compilers, this review maps EKL against existing industry standards. **New concepts MUST compete with an existing standard before being invented.**

For each area: **Reuse** · **Extend** · **Diverge** (with rationale)

---

## Review matrix

| Standard | Area | EKL decision | Rationale |
|----------|------|--------------|-----------|
| [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) | Normative language | **Reuse** | MUST/SHOULD/MAY in all spec documents |
| [JSON Schema](https://json-schema.org/) | Contract validation | **Reuse** | `schemas/knowledge-contract.schema.yaml` |
| [SemVer 2.0.0](https://semver.org/) | Versioning | **Reuse** | Spec, artifacts, compilers — see [compatibility.md](compatibility.md) |
| [OpenAPI](https://spec.openapis.org/) | Specification model | **Extend** | EKL is to engineering knowledge what OpenAPI is to APIs; spec/reference split |
| [SPDX](https://spdx.dev/) | Provenance, licensing | **Extend** | `classification`, `confidence`, `evidence`, `owner` fields — richer than SPDX for knowledge |
| [OCI Image Spec](https://github.com/opencontainers/image-spec) | Distribution, immutability | **Extend** | Lock files, publisher stage — future OCI artifact for compiled bundles |
| [OpenTelemetry](https://opentelemetry.io/) | Observability | **Diverge** | Not applicable to knowledge compilation; no OTel integration planned |
| [Terraform](https://developer.hashicorp.com/terraform) | Declarative config + providers | **Extend** | Knowledge = HCL equivalent; compilers = providers; `reference/` = provider implementations |
| [Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) | Extensible resource model | **Extend** | Artifact types + contract fields analogous to CRDs; validation webhook = Validator stage |
| [ADR (Nygard)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | Decision records | **Reuse** | `adr/` directory; evidence type `Internal decision` |
| [CommonMark](https://commonmark.org/) | Markdown body | **Reuse** | Artifact bodies are Markdown |
| [YAML 1.2](https://yaml.org/spec/1.2.2/) | Metadata format | **Reuse** | Contract frontmatter |
| [AGENTS.md](https://agents.md/) (emerging) | Multi-agent instructions | **Extend** | `ai-context-agents` compilation target in reference implementation |

---

## 1. OpenAPI — Specification / implementation split

| OpenAPI | EKL |
|---------|-----|
| OpenAPI Specification | [spec/specification.md](specification.md) |
| Swagger Codegen | `reference/<target>/` compilers |
| `openapi.yaml` | Canonical knowledge (Markdown + contract) |
| Generated client SDK | Compiled AI context / docs |

**Decision:** **Extend.** EKL adopts OpenAPI's pattern: the specification is the product; compilers are an ecosystem.

People don't care about Swagger Codegen. They care about the OpenAPI specification. Same for EKL.

---

## 2. JSON Schema — Validation

| JSON Schema | EKL |
|-------------|-----|
| Schema document | `schemas/knowledge-contract.schema.yaml` |
| Validator | Pipeline Validator stage |
| `$schema` reference | `ekl_version` in build config |

**Decision:** **Reuse.** Contract validation MUST use JSON Schema (or YAML schema equivalent).

---

## 3. SPDX — Provenance

| SPDX | EKL |
|------|-----|
| License identifier | Not in v1 (planned) |
| Package provenance | `owner`, `updated`, `reviewed`, `references` |
| Confidence / evidence | EKL extension — SPDX doesn't cover knowledge confidence |

**Decision:** **Extend.** SPDX inspires provenance fields; EKL adds `confidence` and `Evidence` for knowledge-specific needs.

Future: MAY adopt SPDX license identifiers in contract for pack distribution.

---

## 4. Terraform — Providers

| Terraform | EKL |
|-----------|-----|
| HCL configuration | Canonical knowledge nodes |
| `terraform plan/apply` | `ekl build` / `ekl publish` |
| Providers (AWS, Azure) | Reference compilers (`reference/cursor/`, etc.) |
| State lock | `versions/*.lock` |

**Decision:** **Extend.** Knowledge is declarative. Compilers are replaceable providers. Canonical knowledge is not.

---

## 5. Kubernetes CRD — Extensible types

| Kubernetes CRD | EKL |
|----------------|-----|
| Custom Resource Definition | Artifact type prefixes (`capability.*`, `competency.*`) |
| Admission webhook | Validator stage |
| Controller reconciliation | Publisher / lock file generation |
| API versioning (`v1`, `v2`) | EKL spec versioning per [compatibility.md](compatibility.md) |

**Decision:** **Extend.** Artifact types behave like CRDs; validation webhook = Validator.

---

## 6. OCI — Distribution

| OCI | EKL |
|-----|-----|
| Image manifest | Compile manifest (`compile-manifest.json`) |
| Immutable digest | Lock file pinned versions |
| Registry | GitHub Releases (v1); OCI registry (future) |

**Decision:** **Extend (future).** Publisher stage MAY emit OCI artifacts for compiled knowledge bundles.

---

## 7. OpenTelemetry — Observability

**Decision:** **Diverge.** EKL does not define telemetry for knowledge compilation. Implementations MAY emit OTel spans for build pipeline stages — but this is not normative.

---

## 8. Intentional divergences

| Area | Why diverge |
|------|-------------|
| **Evidence + confidence** | No existing standard covers knowledge claim confidence for AI consumption |
| **Capability orchestration** | No OpenAPI equivalent for "what AI can accomplish" recipes |
| **Competency model** | Professional role knowledge bases — domain-specific to engineering AI |
| **Research exclusion** | Explicit unvalidated layer — most doc systems don't distinguish |

---

## 9. Standards-first rule (normative for contributors)

Before introducing a new EKL concept, contributors MUST ask:

1. Does OpenAPI already solve this?
2. Does OCI already solve this?
3. Does OpenTelemetry already solve this?
4. Does Terraform already solve this?
5. Does Kubernetes CRD already solve this?
6. Does JSON Schema already solve this?
7. Does SPDX already solve this?

If **yes** → prefer **Reuse** or **Extend**.  
If **diverge** → MUST document rationale in an ADR.

---

## 10. Milestone exit criteria

Standards Alignment Review is complete when:

- [x] This document published
- [x] EKL spec split: specification, contracts, semantics, compatibility
- [x] Spec/reference separation enforced
- [x] RFC 2119 adopted throughout spec
- [x] EKS renamed to EKL (avoid Amazon EKS collision)
- [x] ADR 0015 updated to Canonical Knowledge as Product
- [x] Implementation paused (Sprint 1A on hold)
- [ ] Standards alignment review signed off (resumes Sprint 1A)

---

## References

- [specification.md](specification.md)
- [ADR 0015](../adr/0015-canonical-knowledge-as-product.md)
- [SPECIFICATION.md](../SPECIFICATION.md)
