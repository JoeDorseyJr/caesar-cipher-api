# Environment & Configuration Rules

Target Bun ≥1.0. Keep secrets in untracked `.env.local` files and reference them through safe defaults in `server.ts`. Document any new environment variables in `README.md` so contributors can replicate your setup.

## Required Environment Variables
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: Authentication secret (minimum 10 characters)
- `NODE_ENV`: Application environment (`development`, `production`, or `test`)

## Configuration Guidelines
- Store secrets in `.env.local` (not tracked)
- Reference with safe defaults in `server.ts`
- Document new variables in README.md
- Use Zod for typed configuration validation
