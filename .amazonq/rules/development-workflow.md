# Development Workflow Rules

## Build, Test, and Development Commands
- `cd api && bun install`: install dependencies before making changes
- `cd api && bun run dev`: start the Hono dev server at `http://localhost:3000` with hot reload
- `cd api && bun run build`: produce a production bundle
- `cd api && bun test`: run the Bun test runner
- `PORT=4000 bun run dev`: override default port

## Database Operations
- `docker compose up db`: Start local Postgres (optional)
- `bun run migrate`: Run migrations
- `bun run seed:local`: Seed test credentials

## Spec-Driven Development Workflow

**Before implementing features**, consult these documents in `development/caesar-cipher-api/`:

1. **`requirements.md`**: User stories, functional requirements, technical requirements, non-functional requirements
2. **`design.md`**: Architecture diagrams, request flow sequences, technical design decisions with rationale
3. **`tasks.md`**: Phase-based implementation tasks with time estimates, requirements mapping, and validation steps
4. **`traceability-matrix.md`**: Forward/reverse traceability linking requirements → design → tasks

### Implementation Guidelines
- Reference requirement IDs (e.g., CC-ENC-001) in commits
- **Follow ALL validation steps from tasks** - passing tests alone is NOT sufficient
- Update traceability matrix if requirements change
- **Never assume completion** - always run the complete validation workflow
