# Tasks – Caesar Cipher API

## Phase 1 – Scaffolding & Infrastructure (Design §Implementation Phases → Phase 1)
- [ ] **Set up Bun project with strict TypeScript config** (Est: 2h) — Req: TR-001, TR-003; Design Refs: §System Architecture Overview, §Routing & Request Lifecycle. Validation: run `bun install && bun test` to confirm compiler strictness passes and `bun run dev` boots on port 3000 for a new contributor.
- [ ] **Establish project structure and config module** (Est: 3h) — Req: FR-002, TR-007; Design Refs: §Configuration & Environment Management. Validation: from a clean checkout, `bun run dev` logs typed config values and missing env vars raise descriptive errors for end users.
- [ ] **Provision local Postgres tooling and environment templates** (Est: 3h) — Req: TR-005, TR-006; Design Refs: §Authentication & Postgres Integration. Validation: `docker compose up db` starts Postgres and `.env.example` guides a teammate to connect without edits.
- [ ] **Implement health route and structured logging skeleton** (Est: 2h) — Req: CC-HEALTH-001, FR-004; Design Refs: §Logging & Observability. Validation: `curl http://localhost:3000/health` returns `{ "status": "ok" }` within 50 ms and server logs structured output for the request.

## Phase 2 – Core Cipher Functions & Endpoints (Design §Implementation Phases → Phase 2)
- [ ] **Develop core cipher utilities with tests** (Est: 5h) — Req: FR-001, TR-004, CC-ENC-003, CC-DEC-002; Design Refs: §Cipher Logic Module. Validation: `bun test` suite covers shifts 0–25, uppercase/lowercase, punctuation, ensuring encrypted/decrypted text matches expectations for end users.
- [ ] **Create `/encrypt` and `/decrypt` routes with validation** (Est: 4h) — Req: CC-ENC-001, CC-ENC-002, CC-DEC-001, CC-DEC-003, FR-003; Design Refs: §Routing & Request Lifecycle. Validation: integration tests plus `curl` requests (valid & invalid) demonstrate 200 responses for correct input and 400 for malformed payloads.
- [ ] **Add `/encode` default shift and `/rot13` helper** (Est: 3h) — Req: CC-ENCDEF-001, CC-ENCDEF-002, CC-ROT13-001, CC-ROT13-002; Design Refs: §Cipher Logic Module. Validation: manual `curl` shows default shift=3 and constant rot13 output, while tests assert payload keys.
- [ ] **Document quick-start usage in README** (Est: 1h) — Req: Objectives, TR-007; Design Refs: §API Documentation Strategy. Validation: teammate follows README to encrypt text via `curl` without additional guidance.

## Phase 3 – Advanced Cipher Features (Design §Implementation Phases → Phase 3)
- [ ] **Implement `/bruteforce` endpoint with utilities** (Est: 4h) — Req: CC-BRUTE-001, CC-BRUTE-002, CC-BRUTE-003, FR-002; Design Refs: §Cipher Logic Module. Validation: integration test verifies keys `"0"`–`"25"`, and manual `curl` confirms original text at shift 0 for analysts.
- [ ] **Build `autoDecrypt` heuristic and endpoint** (Est: 5h) — Req: CC-AUTO-001, CC-AUTO-002, CC-AUTO-003; Design Refs: §Cipher Logic Module. Validation: unit tests with known ciphertext confirm chosen shift, integration tests confirm `candidates` array behavior for ambiguous input.
- [ ] **Enhance `/info` metadata route** (Est: 2h) — Req: CC-INFO-001, CC-INFO-002; Design Refs: §API Documentation Strategy. Validation: tests confirm version sourced from `package.json` and manual `curl /info` allows developers to list available routes.
- [ ] **Set up performance benchmarks** (Est: 3h) — Req: CC-HEALTH-002, NFR-001, NFR-002; Design Refs: §Testing Strategy. Validation: automated script reports latency results logged in CI artifacts, ensuring end users experience responsive endpoints.

## Phase 4 – Authentication & Database Layer (Design §Implementation Phases → Phase 4, §Request Flow with Authentication)
- [ ] **Create migrations and models for `api_keys`** (Est: 4h) — Req: CC-AUTH-002, TR-006; Design Refs: §Authentication & Postgres Integration. Validation: run `bun run migrate` on fresh database and confirm table structure via `psql` query accessible to teammates.
- [ ] **Implement Postgres connector and credential repository** (Est: 3h) — Req: TR-005, TR-006; Design Refs: §Authentication & Postgres Integration. Validation: integration test mocks DB failure to ensure errors bubble with helpful messages for operators.
- [ ] **Develop bearer auth middleware** (Est: 4h) — Req: CC-AUTH-001, FR-006, NFR-004; Design Refs: §Request Flow with Authentication. Validation: tests plus manual `curl` without token return 401 JSON error, with seed token return 200 ensuring authorized users succeed quickly.
- [ ] **Implement `seed:local` script and docs** (Est: 2h) — Req: CC-AUTH-003, FR-005; Design Refs: §Authentication & Postgres Integration. Validation: teammate runs `bun run seed:local`, retrieves generated token, and successfully hits `/encrypt`.

## Phase 5 – Hardening, Docs & Tooling (Design §Implementation Phases → Phase 5)
- [ ] **Add structured error handler with `{ code, message }`** (Est: 3h) — Req: NFR-003, FR-003; Design Refs: §Routing & Request Lifecycle, §Logging & Observability. Validation: failing validation returns standardized JSON verified via tests and manual `curl`.
- [ ] **Generate OpenAPI spec and doc tooling** (Est: 4h) — Req: Objectives, CC-INFO-001, TR-007; Design Refs: §API Documentation Strategy. Validation: run `bun run doc:check` and import spec into Postman so developers can execute sample encrypt call.
- [ ] **Establish CI scripts for tests, migrations, linting** (Est: 3h) — Req: FR-005, TR-004, TR-006; Design Refs: §Build & Deployment Preparation, §Testing Strategy. Validation: CI pipeline (or local runner) executes `bun test`, `bun run migrate`, `bun run lint` without manual intervention.
- [ ] **Finalize manual validation playbook** (Est: 2h) — Req: Objectives, NFR-001; Design Refs: §Testing Strategy. Validation: checklist includes `curl` commands and expected outputs; peer runs through to confirm end-user workflow clarity.

## Ongoing Quality Gates
- [ ] **Maintain ≥90% coverage on cipher utilities** (Est: ongoing 1h per review) — Req: TR-004; Design Refs: §Testing Strategy. Validation: coverage reports attached to PRs demonstrating threshold met, showing end users can trust logic.
- [ ] **Monitor performance budgets after each feature** (Est: ongoing 1h per sprint) — Req: NFR-001, NFR-002, NFR-004; Design Refs: §Testing Strategy, §Logging & Observability. Validation: rerun benchmark suite and capture metrics ensuring response times stay within guarantees.
