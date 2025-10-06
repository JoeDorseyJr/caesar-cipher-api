# Requirements – Caesar Cipher API

## Overview
This project delivers a Bun + Hono HTTP API that performs Caesar cipher transformations with authenticated access. The service must expose endpoints described in `README.md`, handle input validation, enforce authentication backed by Postgres, and return predictable JSON payloads so clients can encrypt, decrypt, and explore shifts programmatically.

## Objectives
- Provide stable REST endpoints for encrypt, decrypt, ROT13, encode (default shift), brute-force, auto-decrypt, and health/info checks.
- Ensure shift logic preserves character case, ignores non-alphabetic characters, and supports the full 0–25 rotation range.
- Enforce authenticated access using a Postgres-backed credential store suitable for local testing.
- Ship production-ready build artifacts and documentation so contributors can run, test, and deploy the API easily.

## Assumptions & Constraints
- Runtime environment uses Bun ≥ 1.0 with TypeScript and Hono.
- Authentication leverages a local Postgres database seeded with test users; no external identity provider is needed.
- Rate limiting is out of scope for this phase.
- All testing and validation focus on local environments; deployment automation is postponed.

## User Stories
### US-01 Encrypt Plaintext
As an API consumer, I want to encrypt plaintext with a chosen shift so that I can securely transmit a message.
- Requirement CC-ENC-001: Provide `POST /encrypt` accepting JSON `{ text: string, shift: number }`. Verification: `bun test` integration spec invoking the endpoint with valid input.
- Requirement CC-ENC-002: Reject missing or non-integer `shift` values with HTTP 400 and error details. Verification: negative test using Hono test client.
- Requirement CC-ENC-003: Respond with `{ encrypted: string, shift: number }` preserving character case and leaving non-letters untouched. Verification: unit test on cipher utility plus integration assertion on response payload.

### US-02 Decrypt Ciphertext
As an API consumer, I want to decrypt ciphertext with a known shift so I can recover the original message.
- Requirement CC-DEC-001: Provide `POST /decrypt` accepting `{ text: string, shift: number }`. Verification: integration test hitting the route.
- Requirement CC-DEC-002: Return `{ decrypted: string, shift: number }` matching the original plaintext when shift is valid. Verification: round-trip unit test in `caesar.spec.ts`.
- Requirement CC-DEC-003: Return HTTP 400 with descriptive error when `shift` is outside 0–25. Verification: integration test asserting status and error message.

### US-03 Quick Encode (Default Shift)
As a developer, I want a quick encode endpoint so that I can use the standard Caesar shift without specifying a value.
- Requirement CC-ENCDEF-001: Provide `POST /encode` defaulting `shift` to 3 when omitted. Verification: integration test confirming response uses shift 3.
- Requirement CC-ENCDEF-002: Allow explicit `shift` override in the payload. Verification: integration test posting `{ text, shift: 5 }` and validating output.

### US-04 ROT13 Helper
As a developer, I need a ROT13 endpoint for interoperability with legacy tools.
- Requirement CC-ROT13-001: Provide `POST /rot13` that always applies shift 13. Verification: integration test asserting response uses shift 13 constant.
- Requirement CC-ROT13-002: Ensure response payload uses key `rot13` with transformed text. Verification: integration test inspecting JSON body.

### US-05 Brute-Force Exploration
As a security tester, I want to view all possible shifts so that I can inspect potential plaintexts.
- Requirement CC-BRUTE-001: Provide `POST /bruteforce` accepting `{ text: string }`. Verification: integration test hitting endpoint with sample input.
- Requirement CC-BRUTE-002: Return JSON with `possibilities` map containing keys `"0"` through `"25"`. Verification: unit test asserting map length and key range.
- Requirement CC-BRUTE-003: Include original text under shift 0 for reference. Verification: integration test comparing value at key `"0"`.

### US-06 Auto-Decrypt Support
As an analyst, I want the service to infer the most likely plaintext so I can speed up investigations.
- Requirement CC-AUTO-001: Provide `POST /auto-decrypt` accepting `{ text: string }`. Verification: integration test hitting endpoint.
- Requirement CC-AUTO-002: Run frequency analysis (or similar heuristic) to choose the most probable shift and respond `{ decrypted: string, shift: number }`. Verification: unit test using crafted ciphertext with known solution.
- Requirement CC-AUTO-003: Include `candidates` array with ranked alternatives when certainty is below a configurable threshold. Verification: integration test with ambiguous input verifying fallback data.

### US-07 Health Monitoring
As an operator, I want a health endpoint so that I can monitor uptime.
- Requirement CC-HEALTH-001: Provide `GET /health` returning `{ status: "ok" }` when the service is ready. Verification: integration test triggered during CI.
- Requirement CC-HEALTH-002: Ensure endpoint responds within 50ms under idle load. Verification: performance test using `bun test` benchmark or `autocannon` script.

### US-08 Service Metadata
As a consumer, I need to discover available routes so that I can integrate quickly.
- Requirement CC-INFO-001: Provide `GET /info` returning service metadata including name, version, and endpoint list. Verification: integration test asserting required fields.
- Requirement CC-INFO-002: Source version from package metadata to avoid hardcoding. Verification: unit test reading `package.json` reference.

### US-09 Authenticated Access
As an API integrator, I want to authenticate each request so that only authorized clients can use cipher operations.
- Requirement CC-AUTH-001: Require authentication header (e.g., `Authorization: Bearer <token>`) for all mutating endpoints; unauthenticated requests must return HTTP 401 with JSON error. Verification: integration test hitting `/encrypt` without token.
- Requirement CC-AUTH-002: Validate tokens against a Postgres `users` or `api_keys` table seeded via migration. Verification: unit test exercising auth middleware with seeded data.
- Requirement CC-AUTH-003: Provide a local seed script that initializes the Postgres test database with at least one active credential. Verification: run `bun run seed:local` script in CI pipeline or documented manual step.

## Functional Requirements
- FR-001: Implement core Caesar cipher utilities supporting arbitrary shifts, preserving case, and ignoring non-letter characters.
- FR-002: Expose Hono route modules per endpoint (`encrypt`, `decrypt`, `encode`, `rot13`, `bruteforce`, `auto-decrypt`, `health`, `info`).
- FR-003: Validate request bodies with shared middleware providing consistent error responses.
- FR-004: Log each request with route name, execution time, and status for observability.
- FR-005: Provide Bun scripts for `dev`, `test`, `build`, and `seed:local` workflows referenced in README.
- FR-006: Protect routes behind authentication middleware that checks Postgres-backed credentials.

## Technical Requirements
- TR-001: Use TypeScript with `strict` compiler option enabled; disallow implicit `any`.
- TR-002: Bundle server via `bun build src/server.ts --outdir dist` and ensure imports resolve with relative paths or configured aliases.
- TR-003: Configure project to run on default port 3000 with ability to override via `PORT` environment variable.
- TR-004: Implement automated tests with Bun test runner; maintain ≥90% statement coverage on cipher utilities.
- TR-005: Provision local Postgres using Docker Compose or equivalent; define connection settings in `.env.local` and typed config helpers.
- TR-006: Implement database migration and seed tooling (e.g., `bun run migrate`, `bun run seed:local`) to manage auth tables.
- TR-007: Document environment variables and setup steps in `README.md` whenever new configuration is added.

## Non-Functional Requirements
- NFR-001: Average response time for cipher endpoints must stay under 100ms for payloads up to 1,000 characters.
- NFR-002: Service must handle at least 50 concurrent requests without errors on a single Bun instance.
- NFR-003: Error responses must include stable `code` and `message` fields for client debugging.
- NFR-004: Authentication checks should add no more than 10ms overhead per request under local Postgres conditions.
