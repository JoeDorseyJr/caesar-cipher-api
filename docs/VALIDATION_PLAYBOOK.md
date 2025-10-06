# Caesar Cipher API - Manual Validation Playbook

This playbook provides step-by-step validation procedures for the Caesar Cipher API.

## Prerequisites

- Bun v1.0+ installed
- PostgreSQL running locally (or via Docker)
- Environment variables configured in `api/.env.local`

## Setup Validation

### 1. Install Dependencies

```bash
cd api
bun install
```

**Expected**: Dependencies install without errors.

### 2. Database Setup

```bash
# Start Postgres (if using Docker)
docker compose up db

# Run migrations
bun run migrate
```

**Expected**: Migration completes successfully, `api_keys` table created.

### 3. Seed Test Credentials

```bash
bun run seed:local
```

**Expected**: Test API key generated with token displayed. **Save this token for testing!**

## Build Validation

### 4. Development Build

```bash
bun run dev
```

**Expected**: Server starts on port 3000 (or PORT from .env.local).

### 5. Production Build

```bash
bun run build
bun run start
```

**Expected**: 
- Build creates `dist/server.js`
- Production server starts successfully

## Endpoint Validation

**Note**: Replace `YOUR_TOKEN` with the token from step 3.

### 6. Health Check (Public)

```bash
curl http://localhost:3000/health
```

**Expected**: `{"status":"ok"}` with 200 status.

### 7. API Info (Public)

```bash
curl http://localhost:3000/info | jq .
```

**Expected**: JSON with name, version, description, and endpoints array.

### 8. Authentication Test

**Without token (should fail):**

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "shift": 3}'
```

**Expected**: `{"code":"UNAUTHORIZED","message":"..."}` with 401 status.

**With valid token (should succeed):**

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello, World!", "shift": 3}'
```

**Expected**: `{"encrypted":"Khoor, Zruog!","shift":3}` with 200 status.

### 9. Encrypt Endpoint

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Attack at dawn", "shift": 5}'
```

**Expected**: `{"encrypted":"Fyyfhp fy ifbs","shift":5}`

### 10. Decrypt Endpoint

```bash
curl -X POST http://localhost:3000/decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Khoor, Zruog!", "shift": 3}'
```

**Expected**: `{"decrypted":"Hello, World!","shift":3}`

### 11. Encode Endpoint (Default Shift)

```bash
curl -X POST http://localhost:3000/encode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Secret message"}'
```

**Expected**: `{"encoded":"Vhfuhw phvvdjh","shift":3}`

### 12. ROT13 Endpoint

```bash
curl -X POST http://localhost:3000/rot13 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello, World!"}'
```

**Expected**: `{"encoded":"Uryyb, Jbeyq!","shift":13}`

### 13. Bruteforce Endpoint

```bash
curl -X POST http://localhost:3000/bruteforce \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Khoor"}' | jq '.possibilities["3"]'
```

**Expected**: `"Hello"` (shift 3 reveals original text)

### 14. Auto-Decrypt Endpoint

```bash
curl -X POST http://localhost:3000/auto-decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj"}'
```

**Expected**: `{"decrypted":"The quick brown fox jumps over the lazy dog","shift":3}`

## Error Handling Validation

### 15. Validation Errors

**Missing required field:**

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "test"}'
```

**Expected**: `{"code":"VALIDATION_ERROR","message":"..."}` with 400 status.

**Invalid shift range:**

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "test", "shift": 26}'
```

**Expected**: `{"code":"VALIDATION_ERROR","message":"..."}` with 400 status.

## Test Suite Validation

### 16. Run All Tests

```bash
bun test
```

**Expected**: All tests pass (73+ tests).

### 17. Run Benchmarks

```bash
bun run benchmark
```

**Expected**:
- `/health` responds <50ms
- Cipher endpoints <100ms for 1KB payloads
- Auth overhead ≤10ms
- 50 concurrent requests handled without errors

## CI Pipeline Validation

### 18. Run Full CI Suite

```bash
bun run ci
```

**Expected**: All checks pass:
- ✅ Linting
- ✅ Build
- ✅ Tests
- ✅ Documentation
- ✅ Migrations

## Documentation Validation

### 19. OpenAPI Spec

```bash
bun run doc:check
```

**Expected**: OpenAPI spec generated at `api/openapi.json`.

**Import into Postman/Swagger:**
1. Open Postman
2. Import → Upload Files → Select `api/openapi.json`
3. Test encrypt endpoint with bearer token

## Performance Validation

### 20. Concurrent Load Test

```bash
# Install autocannon if not available
npm install -g autocannon

# Test health endpoint
autocannon -c 50 -d 10 http://localhost:3000/health
```

**Expected**: 
- Requests/sec > 1000
- No errors
- Latency p99 < 100ms

## Cleanup

### 21. Stop Services

```bash
# Stop dev server (Ctrl+C)
# Stop Postgres (if using Docker)
docker compose down
```

## Validation Checklist

- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Test credentials seeded
- [ ] Dev server starts
- [ ] Production build works
- [ ] Health endpoint responds
- [ ] Info endpoint responds
- [ ] Auth blocks unauthenticated requests
- [ ] Auth allows authenticated requests
- [ ] All cipher endpoints work correctly
- [ ] Error responses include code and message
- [ ] All tests pass
- [ ] Benchmarks meet performance targets
- [ ] CI pipeline passes
- [ ] OpenAPI spec generated
- [ ] Documentation is clear and accurate

## Troubleshooting

### Server won't start
- Check `DATABASE_URL` in `.env.local`
- Verify Postgres is running: `psql -h localhost -U postgres -d caesar_cipher -c "SELECT 1;"`
- Check port availability: `lsof -i :3000`

### Tests failing
- Ensure `.env.local` is loaded: `source api/.env.local && export $(cat api/.env.local | grep -v '^#' | xargs)`
- Clean test data: `psql -h localhost -U postgres -d caesar_cipher -c "DELETE FROM api_keys WHERE name LIKE 'test-%';"`

### Auth not working
- Verify token from seed script
- Check token format: `Authorization: Bearer <token>`
- Confirm `api_keys` table has entries: `psql -h localhost -U postgres -d caesar_cipher -c "SELECT * FROM api_keys;"`

## Success Criteria

All validation steps complete successfully, demonstrating:
- ✅ Functional API with all endpoints working
- ✅ Authentication protecting cipher operations
- ✅ Error handling with structured responses
- ✅ Performance meeting NFR targets
- ✅ Complete test coverage
- ✅ Production-ready build
- ✅ Clear documentation
