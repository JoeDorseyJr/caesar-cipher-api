# Traceability Matrix – Caesar Cipher API

## Forward Traceability (Requirements → Design → Tasks)
| Requirement ID | Summary | Validation Path (Usage) | Design Coverage | Tasks Coverage | Notes |
| --- | --- | --- | --- | --- | --- |
| OBJ-1 | Provide REST endpoints for cipher operations | Manual `curl` / integration tests for each route | §System Architecture Overview; §Routing & Request Lifecycle | Phase 2 core routes; Phase 3 advanced endpoints | Covered |
| OBJ-2 | Preserve shift behavior across full range | Unit tests over shifts 0–25 | §Cipher Logic Module | Phase 2 core utilities | Covered |
| OBJ-3 | Enforce authenticated access with Postgres | Seed token then call `/encrypt` (401→200) | §Request Flow with Authentication; §Authentication & Postgres Integration | Phase 4 auth middleware + seed tasks | Covered |
| OBJ-4 | Produce deployable build artifacts & docs | Run `bun run build`; launch `dist/server.js` via README | §Build & Deployment Preparation; §Testing Strategy (manual playbook) | Phase 1 build script task; Phase 2 README doc; Phase 5 CI/build tasks | Covered |
| CC-ENC-001 | `/encrypt` accepts `{text, shift}` | Integration test + `curl` | §Routing & Request Lifecycle | Phase 2 `/encrypt` task | Covered |
| CC-ENC-002 | Reject invalid shift | Negative integration tests | §Routing & Request Lifecycle | Phase 2 `/encrypt` task | Covered |
| CC-ENC-003 | Preserve case & punctuation | Utility unit tests + integration | §Cipher Logic Module | Phase 2 utilities task | Covered |
| CC-DEC-001 | `/decrypt` endpoint | Integration test + manual `curl` | §Routing & Request Lifecycle | Phase 2 `/decrypt` task | Covered |
| CC-DEC-002 | Round-trip matches plaintext | Utility unit tests | §Cipher Logic Module | Phase 2 utilities task | Covered |
| CC-DEC-003 | Reject invalid shifts | Integration tests expecting 400 | §Routing & Request Lifecycle | Phase 2 `/decrypt` task | Covered |
| CC-ENCDEF-001 | `/encode` defaults to 3 | Integration/manual test | §Cipher Logic Module | Phase 2 `/encode` task | Covered |
| CC-ENCDEF-002 | `/encode` allows override | Integration/manual test | §Cipher Logic Module | Phase 2 `/encode` task | Covered |
| CC-ROT13-001 | `/rot13` uses shift 13 | Integration test | §Cipher Logic Module | Phase 2 `/rot13` task | Covered |
| CC-ROT13-002 | Response key `rot13` | Integration test | §Cipher Logic Module | Phase 2 `/rot13` task | Covered |
| CC-BRUTE-001 | `/bruteforce` accepts `{text}` | Integration/manual test | §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-BRUTE-002 | Return keys `"0"`–`"25"` | Unit test verifying map length | §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-BRUTE-003 | Include original text at shift 0 | Integration/manual test | §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-AUTO-001 | `/auto-decrypt` endpoint | Integration test | §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-AUTO-002 | Frequency analysis result | Unit test with known ciphertext | §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-AUTO-003 | Candidates array on uncertainty | Integration test verifying field | §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-HEALTH-001 | `/health` returns `{status:"ok"}` | `curl /health` | §System Architecture Overview; §Logging & Observability | Phase 1 health route task | Covered |
| CC-HEALTH-002 | `/health` <50 ms | Benchmark log under latency threshold | §Testing Strategy | Phase 3 performance benchmark | Covered |
| CC-INFO-001 | `/info` returns metadata | Integration/manual test | §API Documentation Strategy | Phase 3 `/info` task | Covered |
| CC-INFO-002 | Version sourced from package metadata | Unit test referencing `package.json` | §API Documentation Strategy | Phase 3 `/info` task | Covered |
| CC-AUTH-001 | Require auth header | Manual `curl` 401/200 | §Request Flow with Authentication | Phase 4 auth middleware | Covered |
| CC-AUTH-002 | Validate token via Postgres table | Integration/unit tests hitting DB | §Authentication & Postgres Integration | Phase 4 migrations + repository | Covered |
| CC-AUTH-003 | Local seed script | Run `bun run seed:local` | §Authentication & Postgres Integration | Phase 4 seed script task | Covered |
| FR-001 | Core cipher utilities | Unit tests + route usage | §Cipher Logic Module | Phase 2 utilities task | Covered |
| FR-002 | Route modules per endpoint | Integration tests; repo structure | §Routing & Request Lifecycle | Phases 2 & 3 route tasks | Covered |
| FR-003 | Shared validation middleware | Integration tests for error responses | §Routing & Request Lifecycle | Phase 2 routes; Phase 5 error handler | Covered |
| FR-004 | Structured logging | Inspect JSON logs during `curl` | §Logging & Observability | Phase 1 logging task | Covered |
| FR-005 | Bun scripts for workflows | Run `bun run dev/test/build/seed:local` | §Build & Deployment Preparation | Phase 1 build task; Phase 4 seed; Phase 5 CI | Covered |
| FR-006 | Auth middleware protecting routes | Manual/integration tests with tokens | §Request Flow with Authentication | Phase 4 auth task | Covered |
| FR-007 | Build outputs documented & runnable | `bun run build` + README instructions | §Build & Deployment Preparation; §Testing Strategy | Phase 1 build task; Phase 2 README; Phase 5 CI/manual playbook | Covered |
| TR-001 | Strict TypeScript | Compilation fails on implicit any | §Implementation Phase 1 | Phase 1 setup task | Covered |
| TR-002 | Bundle via `bun build` | Build artifacts present in `dist/` | §Build & Deployment Preparation | Phase 1 build task; Phase 5 CI | Covered |
| TR-003 | Configurable port | Start server with default & custom PORT | §Configuration & Environment Management | Phase 1 setup & structure tasks | Covered |
| TR-004 | Automated tests & ≥90% coverage | Observe coverage report | §Testing Strategy | Phase 2 utilities; Ongoing quality gate | Covered |
| TR-005 | Provision local Postgres | Docker compose start & connection | §Authentication & Postgres Integration | Phase 1 provisioning task | Covered |
| TR-006 | DB migrations & seed tooling | Run migrate/seed scripts | §Authentication & Postgres Integration | Phase 4 migrations, seed, CI tasks | Covered |
| TR-007 | Document env variables | README/.env instructions | §Configuration & Environment Management; §API Documentation Strategy | Phase 1 structure; Phase 2 documentation | Covered |
| NFR-001 | Cipher endpoints <100 ms for 1 kB payload | Benchmark suite metrics | §Testing Strategy; §Implementation Phase 3 | Phase 3 benchmark task; Ongoing gate | Covered |
| NFR-002 | Handle ≥50 concurrent requests | Benchmark concurrency metrics | §Testing Strategy | Phase 3 benchmark task; Ongoing gate | Covered |
| NFR-003 | Error responses include `code`, `message` | Manual 400 request | §Routing & Request Lifecycle; §Logging & Observability | Phase 5 error handler | Covered |
| NFR-004 | Auth overhead ≤10 ms | Benchmark comparing authed vs unauth | §Testing Strategy; §Implementation Phase 4 | Phase 4 auth overhead task; Ongoing gate | Covered |

## Reverse Traceability (Design / Tasks → Requirements)
| Artifact Reference | Description | Linked Requirements |
| --- | --- | --- |
| Design §System Architecture Overview | Overall architecture diagram | OBJ-1, OBJ-2, OBJ-3, CC-HEALTH-001 |
| Design §Request Flow with Authentication | Sequence diagram for auth flow | OBJ-3, CC-AUTH-001/2/3, FR-006, NFR-004 |
| Design §Configuration & Environment Management | Config strategy + PORT override | TR-003, TR-007, FR-002 |
| Design §Build & Deployment Preparation | Build script + documentation guidance | OBJ-4, FR-005, FR-007, TR-002 |
| Design §Testing Strategy | Testing coverage & benchmarks | TR-004, NFR-001/2/4, CC-HEALTH-002, CC-AUTH-001/2/3 |
| Phase 1 – Set up Bun project | Strict TypeScript & PORT override | TR-001, TR-003 |
| Phase 1 – Establish structure & config | Module layout, env docs | FR-002, TR-007 |
| Phase 1 – Provision Postgres | Docker & env templates | TR-005, TR-006 |
| Phase 1 – Health route & logging | `/health`, logs | CC-HEALTH-001, FR-004 |
| Phase 1 – Configure build script | Build artifacts & docs | OBJ-4, FR-005, FR-007, TR-002 |
| Phase 2 – Core utilities | Cipher logic tests | OBJ-2, FR-001, CC-ENC-003, CC-DEC-002 |
| Phase 2 – `/encrypt` & `/decrypt` routes | Route validation | CC-ENC-001/2, CC-DEC-001/3, FR-003 |
| Phase 2 – `/encode` & `/rot13` | Quick encode helpers | CC-ENCDEF-001/2, CC-ROT13-001/2 |
| Phase 2 – README documentation | Usage + env variables | OBJ-4, TR-007, FR-007 |
| Phase 3 – `/bruteforce` endpoint | Brute force support | CC-BRUTE-001/2/3 |
| Phase 3 – `autoDecrypt` endpoint | Auto decrypt heuristics | CC-AUTO-001/2/3 |
| Phase 3 – `/info` metadata | Service metadata | CC-INFO-001/2 |
| Phase 3 – Performance benchmark suite | Latency & concurrency checks | CC-HEALTH-002, NFR-001, NFR-002 |
| Phase 4 – `api_keys` migrations | Auth storage | CC-AUTH-002, TR-006 |
| Phase 4 – Postgres connector | DB access layer | TR-005, TR-006 |
| Phase 4 – Bearer auth middleware | Request protection | CC-AUTH-001, FR-006, NFR-004 |
| Phase 4 – `seed:local` script | Credential seeding | CC-AUTH-003, FR-005 |
| Phase 4 – Auth overhead measurement | Performance validation | NFR-004 |
| Phase 5 – Error handler | Structured error responses | NFR-003, FR-003 |
| Phase 5 – OpenAPI & docs | Contract sharing | OBJ-1, CC-INFO-001, TR-007 |
| Phase 5 – CI scripts | Automated quality checks | FR-005, FR-007, TR-002, TR-004, TR-006 |
| Phase 5 – Manual validation playbook | End-user workflow verification | OBJ-4, NFR-001, FR-007 |
| Ongoing – Coverage gate | Maintain ≥90% coverage | TR-004 |
| Ongoing – Performance budgets | Ensure latency & auth overhead targets | NFR-001, NFR-002, NFR-004 |

All requirements trace forward to concrete design decisions and actionable tasks, and every implementation activity traces back to testable requirements, ensuring end-user outcomes remain verifiable.
