# AI Coding Agent Instructions – Caesar Cipher API

## Project Overview
This is a **spec-driven development** project building a Caesar Cipher API with Bun, Hono, TypeScript, and Postgres authentication. The project follows a rigorous requirements-design-tasks-traceability workflow documented in `development/caesar-cipher-api/`.

## Architecture & Component Boundaries

### Core Structure
- **`api/src/routes/`**: One file per endpoint (`encrypt.ts`, `decrypt.ts`, `encode.ts`, `rot13.ts`, `bruteforce.ts`, `autoDecrypt.ts`, `health.ts`, `info.ts`)
- **`api/src/utils/caesar.ts`**: Pure cipher utilities (shift, encrypt, decrypt, bruteForce, autoDecrypt)
- **`api/src/app.ts`**: Hono app setup and route mounting
- **`api/src/server.ts`**: Server bootstrap and port binding
- **`api/src/config.ts`**: Typed config using Zod for `PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.
- **`api/db/migrations/`**: Postgres migration SQL files
- **Fixtures**: Store test payloads in `api/fixtures/`, not in runtime modules

### Request Flow
1. HTTP request → Hono middleware stack → JSON parser & schema validation
2. Auth middleware validates bearer token against Postgres `api_keys` table (401 if missing/invalid)
3. Route handler calls pure cipher utilities → returns JSON response
4. Structured logging captures route name, execution time, and status

## Critical Developer Workflows

### Setup & Development
```bash
cd api && bun install              # Install dependencies
bun run dev                        # Start dev server at http://localhost:3000
PORT=4000 bun run dev              # Override default port (TR-003)
bun test                           # Run Bun test runner
bun run build                      # Build to dist/ (TR-002)
bun run dist/server.js             # Run production build
```

### Database Operations
```bash
docker compose up db               # Start local Postgres
bun run migrate                    # Run migrations (TR-006)
bun run seed:local                 # Seed test credentials (CC-AUTH-003)
```

### Quality Gates
- **Coverage**: Maintain ≥90% statement coverage on cipher utilities (TR-004)
- **Performance**: Cipher endpoints <100ms for 1KB payloads, /health <50ms, ≥50 concurrent requests (NFR-001, NFR-002)
- **Auth overhead**: ≤10ms per request (NFR-004)

## Project-Specific Conventions

### Naming & Style
- **camelCase**: variables/functions
- **PascalCase**: types/classes
- **kebab-case**: new route files
- **Test files**: Co-locate with `*.spec.ts` suffix (e.g., `caesar.spec.ts`)
- **TypeScript**: Strict mode enabled; no implicit `any` (TR-001)

### Testing Requirements
- **Cipher utilities**: Cover shifts 0–25, case preservation, punctuation handling, empty input
- **API tests**: Use Hono test client to assert status codes and JSON payload shape
- **Auth tests**: Verify 401 for missing/invalid tokens, 200 for valid tokens
- **New features**: Must include tests; all suites must pass before merge

### Error Handling
- All error responses must include `{ code, message }` fields (NFR-003)
- Validation errors return HTTP 400 with descriptive messages
- Auth failures return HTTP 401 with JSON error

### Commit Style
Use Conventional Commits (`feat:`, `fix:`, `chore:`) ≤72 characters. Include context in body when relevant.

## Spec-Driven Development Workflow

**Before implementing features**, consult these documents in `development/caesar-cipher-api/`:

1. **`requirements.md`**: User stories (US-01..US-09), functional requirements (FR-*), technical requirements (TR-*), non-functional requirements (NFR-*)
2. **`design.md`**: Architecture diagrams, request flow sequences, technical design decisions with rationale
3. **`tasks.md`**: Phase-based implementation tasks with time estimates, requirements mapping, and validation steps
4. **`traceability-matrix.md`**: Forward/reverse traceability linking requirements → design → tasks

### Why This Matters
Each requirement has explicit validation criteria (e.g., "`bun test` integration spec", "manual `curl` request"). When implementing:
- Reference requirement IDs (e.g., CC-ENC-001) in commits
- Follow validation steps from tasks to verify completion
- Update traceability matrix if requirements change

## Key Integration Points

### Authentication Flow
- Protected routes: All POST endpoints except those explicitly documented as public
- Public routes: `/health`, `/info`
- Token validation: Postgres lookup via `api_keys` table (see design.md §Request Flow with Authentication)
- Middleware: Injects `ctx.var.user` or throws 401

### Cipher Logic Patterns
- **Pure functions**: Keep `utils/caesar.ts` side-effect free
- **Shift logic**: Always preserve case, ignore non-alphabetic characters, support 0–25 range
- **Auto-decrypt**: Uses frequency analysis with fallback bigram scoring (see design.md §Cipher Logic Module)

## Configuration & Environment

Store secrets in `.env.local` (not tracked). Reference with safe defaults in `server.ts`.

**Required variables** (document new ones in README per TR-007):
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: Authentication secret

## Anti-Patterns to Avoid
- ❌ Adding cipher logic to route handlers (keep pure in `utils/`)
- ❌ Hardcoding version in `/info` (source from `package.json` per CC-INFO-002)
- ❌ Generic test descriptions ("it should work") – reference specific requirements
- ❌ Skipping validation steps in tasks before marking complete
- ❌ Breaking auth overhead budget (measure with benchmarks)

## Quick Reference: Key Files

- **Spec source of truth**: `development/caesar-cipher-api/requirements.md`
- **Architecture decisions**: `development/caesar-cipher-api/design.md`
- **Implementation plan**: `development/caesar-cipher-api/tasks.md`
- **Traceability**: `development/caesar-cipher-api/traceability-matrix.md`
- **Contributing guidelines**: `AGENTS.md`
- **API usage**: `README.md`
