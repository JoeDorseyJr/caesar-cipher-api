# Project Structure Rules

All application code belongs in `api/`. Keep request handlers in `api/src/routes` (one file per endpoint such as `encrypt.ts`) and shared cipher helpers in `api/src/utils/caesar.ts`. `api/src/app.ts` should wire routes, while `api/src/server.ts` owns server bootstrap and port binding. Store example payloads or fixtures under `api/fixtures` so they do not pollute runtime modules.

## Core Structure
- **`api/src/routes/`**: One file per endpoint (`encrypt.ts`, `decrypt.ts`, `encode.ts`, `rot13.ts`, `bruteforce.ts`, `autoDecrypt.ts`, `health.ts`, `info.ts`)
- **`api/src/utils/caesar.ts`**: Pure cipher utilities (shift, encrypt, decrypt, bruteForce, autoDecrypt)
- **`api/src/app.ts`**: Hono app setup and route mounting
- **`api/src/server.ts`**: Server bootstrap and port binding
- **`api/src/config.ts`**: Typed config using Zod for `PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.
- **`api/db/migrations/`**: Postgres migration SQL files
- **Fixtures**: Store test payloads in `api/fixtures/`, not in runtime modules
