#!/bin/bash

# CI validation script
# Runs all checks required for continuous integration

set -e

echo "🔍 Running CI checks..."
echo ""

# 1. Linting
echo "📝 Running linter..."
bun run lint
echo "✅ Linting passed"
echo ""

# 2. Build
echo "🔨 Building application..."
bun run build
echo "✅ Build passed"
echo ""

# 3. Tests
echo "🧪 Running tests..."
bun test
echo "✅ Tests passed"
echo ""

# 4. Documentation
echo "📚 Checking documentation..."
bun run doc:check
echo "✅ Documentation passed"
echo ""

# 5. Database migrations (dry run)
echo "🗄️  Validating migrations..."
if [ -d "db/migrations" ]; then
  echo "✅ Migrations directory exists"
else
  echo "❌ Migrations directory not found"
  exit 1
fi
echo ""

echo "✨ All CI checks passed!"
