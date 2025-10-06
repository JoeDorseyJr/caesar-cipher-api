# Coding Style Rules

Use TypeScript with strict null checks. Follow camelCase for variables/functions, PascalCase for types/classes, and kebab-case for new route files. Keep side effects inside route handlers and leave helpers in `utils` pure. Format code with `bun fmt` before committing.

## Naming Conventions
- **camelCase**: variables/functions
- **PascalCase**: types/classes
- **kebab-case**: new route files
- **Test files**: Co-locate with `*.spec.ts` suffix (e.g., `caesar.spec.ts`)
- **TypeScript**: Strict mode enabled; no implicit `any`

## Anti-Patterns to Avoid
- ❌ Adding cipher logic to route handlers (keep pure in `utils/`)
- ❌ Hardcoding version in `/info` (source from `package.json`)
- ❌ Generic test descriptions ("it should work") – reference specific requirements
- ❌ Breaking auth overhead budget (measure with benchmarks)
