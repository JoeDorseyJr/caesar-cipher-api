# Traceability Matrix – Caesar Cipher API

| Requirement ID | Summary | Validation Path (Usage) | Design Coverage | Tasks Coverage | Notes / Gaps |
| --- | --- | --- | --- | --- | --- |
| OBJ-1 | Provide REST endpoints for cipher operations | Manual `curl` and integration tests hitting each endpoint | Design §System Architecture Overview; §Routing & Request Lifecycle | Phase 2 core routes; Phase 3 advanced endpoints | Covered via detailed route tasks |
| OBJ-2 | Preserve shift behavior across full range | Unit tests exercising cipher utilities with edge cases | Design §Cipher Logic Module | Phase 2 "Develop core cipher utilities" | Covered |
| OBJ-3 | Enforce authenticated access with Postgres | End user authenticates via seeded token to call endpoints | Design §Request Flow with Authentication; §Authentication & Postgres Integration | Phase 4 auth tasks | Covered |
| OBJ-4 | Ship production build artifacts & docs | Run `bun build` to create dist; deliver docs enabling setup | Design §Build & Deployment Preparation; §API Documentation Strategy | **No explicit task for bundling output**; doc tasks partially cover | Add task to configure/verify `bun build` and artifact output |
| CC-ENC-001 | `/encrypt` accepts `{text, shift}` | Integration test + `curl` POST | Design §Routing & Request Lifecycle | Phase 2 `/encrypt` route task | Covered |
| CC-ENC-002 | Reject invalid shift | Negative integration test using Hono client | Design §Routing & Request Lifecycle | Phase 2 `/encrypt` route task | Covered |
| CC-ENC-003 | Respond with encrypted payload preserving case | Unit tests on utilities + integration | Design §Cipher Logic Module | Phase 2 utilities task; `/encrypt` route task | Covered |
| CC-DEC-001 | `/decrypt` endpoint | Integration test + manual `curl` | Design §Routing & Request Lifecycle | Phase 2 `/decrypt` task | Covered |
| CC-DEC-002 | Round-trip matches plaintext | Unit tests in `caesar.spec.ts` | Design §Cipher Logic Module | Phase 2 utilities task | Covered |
| CC-DEC-003 | Reject shift outside 0–25 | Integration test expecting 400 | Design §Routing & Request Lifecycle | Phase 2 `/decrypt` task | Covered |
| CC-ENCDEF-001 | `/encode` defaults shift 3 | Integration test + manual `curl` without shift | Design §Cipher Logic Module | Phase 2 `/encode` task | Covered |
| CC-ENCDEF-002 | `/encode` allows override | Integration test with custom shift | Design §Cipher Logic Module | Phase 2 `/encode` task | Covered |
| CC-ROT13-001 | `/rot13` applies shift 13 | Integration test verifying constant shift | Design §Cipher Logic Module | Phase 2 `/rot13` task | Covered |
| CC-ROT13-002 | Response key `rot13` | Integration test on payload keys | Design §Cipher Logic Module | Phase 2 `/rot13` task | Covered |
| CC-BRUTE-001 | `/bruteforce` accepts `{text}` | Integration test + manual `curl` | Design §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-BRUTE-002 | Return keys "0"–"25" | Unit test verifying map keys | Design §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-BRUTE-003 | Include original text at shift 0 | Integration test verifying key "0" | Design §Cipher Logic Module | Phase 3 `/bruteforce` task | Covered |
| CC-AUTO-001 | `/auto-decrypt` endpoint | Integration test hitting route | Design §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-AUTO-002 | Frequency analysis returns decrypted result | Unit test with known ciphertext | Design §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-AUTO-003 | Include candidates array on uncertainty | Integration test verifying fallback data | Design §Cipher Logic Module | Phase 3 `autoDecrypt` task | Covered |
| CC-HEALTH-001 | `/health` returns `{status:"ok"}` | `curl /health` invocation | Design §System Architecture Overview; §Logging & Observability | Phase 1 health route | Covered |
| CC-HEALTH-002 | Respond within 50 ms | Performance benchmark with latency check | Design §Testing Strategy | Phase 3 performance benchmark task | Ensure benchmark explicitly records latency metric |
| CC-INFO-001 | `/info` returns metadata | Integration test + `curl /info` | Design §API Documentation Strategy | Phase 3 `/info` task | Covered |
| CC-INFO-002 | Version sourced from package metadata | Unit test referencing `package.json` | Design §API Documentation Strategy | Phase 3 `/info` task | Covered |
| CC-AUTH-001 | Require auth header for mutating endpoints | Manual `curl` without token returns 401 | Design §Request Flow with Authentication | Phase 4 auth middleware task | Covered |
| CC-AUTH-002 | Validate token via Postgres table | Integration/unit tests hitting DB | Design §Authentication & Postgres Integration | Phase 4 migrations & connector task | Covered |
| CC-AUTH-003 | Provide local seed script | Run `bun run seed:local` to generate token | Design §Authentication & Postgres Integration | Phase 4 seed script task | Covered |
| FR-001 | Core cipher utilities | Unit tests, used by endpoints | Design §Cipher Logic Module | Phase 2 utilities task | Covered |
| FR-002 | Route modules per endpoint | Manual inspection of `api/src/routes`; integration tests | Design §Routing & Request Lifecycle | Phases 2 & 3 route tasks | Covered |
| FR-003 | Shared validation middleware | Tests verifying error responses | Design §Routing & Request Lifecycle | Phase 2 route task; Phase 5 error handler task | Covered |
| FR-004 | Structured logging | Inspect logs during `curl` call | Design §Logging & Observability | Phase 1 logging task | Covered |
| FR-005 | Bun scripts `dev`, `test`, `build`, `seed:local` | Run scripts end-to-end | Design §Build & Deployment Preparation | Partially in tasks (dev/test, seed). **Need explicit task for `bun build` script** | Add dedicated task to configure and verify build script |
| FR-006 | Auth middleware protecting routes | `curl` with/without token; integration tests | Design §Request Flow with Authentication | Phase 4 auth middleware task | Covered |
| TR-001 | Strict TypeScript | `bun test` compile step fails on implicit any | Design §Implementation Phase 1 | Phase 1 setup task | Covered |
| TR-002 | Bundle server via `bun build` | Run `bun build` to produce `dist` artifacts | Design §Build & Deployment Preparation | **No explicit task** | Add Phase 1/5 task ensuring bundle validated |
| TR-003 | Default port 3000 with override | Start server with default & custom `PORT` | Design §Configuration & Environment Management | Phase 1 config task | Include validation step for PORT override |
| TR-004 | Automated tests + ≥90% coverage | Review coverage report after tests | Design §Testing Strategy | Phase 2 utilities task; Ongoing quality gate | Covered |
| TR-005 | Provision local Postgres | Run Docker compose, connect | Design §Authentication & Postgres Integration | Phase 1 provisioning task | Covered |
| TR-006 | DB migrations & seed tooling | Execute `bun run migrate` / `seed:local` | Design §Authentication & Postgres Integration | Phase 4 migrations/seed tasks | Covered |
| TR-007 | Document environment variables | README + `.env.example` instructions | Design §Configuration & Environment Management; §API Documentation Strategy | Phase 1 config task; Phase 2 README task | Ensure README documents new vars as they are added |
| NFR-001 | Response <100 ms for 1k-char payload | Performance benchmark run | Design §Testing Strategy | Phase 3 performance benchmark | Confirm benchmark includes payload-size scenario |
| NFR-002 | Handle 50 concurrent requests | Load test scenario with concurrency 50 | Design §Testing Strategy | Phase 3 performance benchmark | Expand benchmark task to include concurrency measurement |
| NFR-003 | Error responses provide `code`, `message` | Manual invalid request + integration test | Design §Routing & Request Lifecycle; §Logging & Observability | Phase 5 error handler task | Covered |
| NFR-004 | Auth adds ≤10 ms overhead | Performance benchmark comparing authed vs unauthenticated requests | Design §Testing Strategy; §Request Flow with Authentication | **No task capturing measurement** | Add validation within performance benchmarks to record auth overhead |
