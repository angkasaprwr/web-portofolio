#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
npx prisma generate --schema="$ROOT/prisma/schema.prisma"
mkdir -p "$ROOT/server/node_modules/@prisma"
ln -sfn "$ROOT/node_modules/@prisma/client" "$ROOT/server/node_modules/@prisma/client"
ln -sfn "$ROOT/node_modules/.prisma" "$ROOT/server/node_modules/.prisma"
echo "Prisma client linked for server"
