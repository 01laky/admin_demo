#!/usr/bin/env bash
# Lint admin_demo — matches CI: types + eslint + prettier.
# Usage: ./lint.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔍 Linting admin_demo (yarn validate)..."
echo ""

yarn validate

echo ""
echo "✅ admin_demo lint passed"
