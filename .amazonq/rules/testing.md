# Testing Rules

Co-locate specs with the code they cover using the `*.spec.ts` suffix (for example, `api/src/utils/caesar.spec.ts`). Cover shifts across the 0–25 range, case preservation, punctuation handling, and empty input. For API tests, use Hono's test client or an HTTP harness to assert status codes and JSON payload shape. New features must include tests, and all suites must pass in CI before merge.

## Testing Requirements
- **Cipher utilities**: Cover shifts 0–25, case preservation, punctuation handling, empty input
- **API tests**: Use Hono test client to assert status codes and JSON payload shape
- **Auth tests**: Verify 401 for missing/invalid tokens, 200 for valid tokens
- **New features**: Must include tests; all suites must pass before merge
- **Coverage**: Maintain ≥90% statement coverage on cipher utilities

## Validation Workflow
- **NEVER mark tasks complete without fully validating ALL acceptance criteria**
- Run manual `curl` tests, check server processes, verify end-to-end workflow
- **NEVER make assumptions** - always verify actual behavior before claiming completion
- Passing tests alone is NOT sufficient; must also verify manual curl requests work
- **Verify server processes are running correctly** before testing endpoints (use `lsof -i :PORT` to check)
