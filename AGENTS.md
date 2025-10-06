# Repository Guidelines

## Project Structure & Module Organization
All application code belongs in `api/`. Keep request handlers in `api/src/routes` (one file per endpoint such as `encrypt.ts`) and shared cipher helpers in `api/src/utils/caesar.ts`. `api/src/app.ts` should wire routes, while `api/src/server.ts` owns server bootstrap and port binding. Store example payloads or fixtures under `api/fixtures` so they do not pollute runtime modules.

## Build, Test, and Development Commands
- `cd api && bun install`: install dependencies before making changes.
- `cd api && bun run dev`: start the Hono dev server at `http://localhost:3000` with hot reload.
- `cd api && bun run build`: produce a production bundle (add `"build": "bun build src/server.ts --outdir dist"` to `package.json` if it is absent).
- `cd api && bun test`: run the Bun test runner; extend the script with flags when you introduce new tooling.

## Coding Style & Naming Conventions
Use TypeScript with strict null checks. Follow camelCase for variables/functions, PascalCase for types/classes, and kebab-case for new route files. Keep side effects inside route handlers and leave helpers in `utils` pure. Format code with `bun fmt` before committing; if you add ESLint or prettier configs, document deviations from their defaults.

## Testing Guidelines
Co-locate specs with the code they cover using the `*.spec.ts` suffix (for example, `api/src/utils/caesar.spec.ts`). Cover shifts across the 0–25 range, case preservation, punctuation handling, and empty input. For API tests, use Hono’s test client or an HTTP harness to assert status codes and JSON payload shape. New features must include tests, and all suites must pass in CI before merge.

## Commit & Pull Request Guidelines
No Git history exists yet, so adopt Conventional Commits (`feat:`, `fix:`, `chore:`) to describe intent in ≤72 characters. Include context or breaking-change notes in the body when relevant. Pull requests should link issues, summarise behavioural changes, and list the commands you ran (e.g., `bun test`). Provide screenshots or `curl` transcripts when an endpoint’s response changes so reviewers can validate behaviour quickly.

## Environment & Configuration Notes
Target Bun ≥1.0. Keep secrets in untracked `.env.local` files and reference them through safe defaults in `server.ts`. Document any new environment variables in `README.md` so contributors can replicate your setup.
