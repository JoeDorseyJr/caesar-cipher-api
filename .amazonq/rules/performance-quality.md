# Performance & Quality Rules

## Quality Gates
- **Coverage**: Maintain ≥90% statement coverage on cipher utilities
- **Performance**: Cipher endpoints <100ms for 1KB payloads, /health <50ms, ≥50 concurrent requests
- **Auth overhead**: ≤10ms per request

## Error Handling
- All error responses must include `{ code, message }` fields
- Validation errors return HTTP 400 with descriptive messages
- Auth failures return HTTP 401 with JSON error

## Request Flow
1. HTTP request → Hono middleware stack → JSON parser & schema validation
2. Auth middleware validates bearer token against Postgres `api_keys` table (401 if missing/invalid)
3. Route handler calls pure cipher utilities → returns JSON response
4. Structured logging captures route name, execution time, and status

## Cipher Logic Patterns
- **Pure functions**: Keep `utils/caesar.ts` side-effect free
- **Shift logic**: Always preserve case, ignore non-alphabetic characters, support 0–25 range
- **Auto-decrypt**: Uses frequency analysis with fallback bigram scoring
