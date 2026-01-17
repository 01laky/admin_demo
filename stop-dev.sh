#!/bin/bash

# Script to stop Admin Docker containers
# Usage: ./stop-dev.sh

set -e

cd "$(dirname "$0")"

echo "🛑 Stopping Admin containers..."

docker-compose -f docker-compose.dev.yml stop admin-demo-dev 2>/dev/null || true
docker-compose -f docker-compose.dev.yml rm -f admin-demo-dev 2>/dev/null || true

# Also try local docker-compose if exists
if [ -f "docker-compose.yml" ]; then
    docker-compose down 2>/dev/null || true
fi

echo "✅ Admin containers stopped and removed"
