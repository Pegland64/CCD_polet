#!/bin/sh
set -e

echo "--- Waiting for database to be ready (db:5432) ---"
while ! nc -z db 5432; do
  echo "Database is not reachable yet - sleeping..."
  sleep 2
done

echo "--- Database is ready! ---"

echo "--- Generating Prisma Client ---"
npx prisma generate

echo "--- Running Prisma DB Push ---"
npx prisma db push --accept-data-loss

echo "--- Running Prisma DB Seed ---"
npx prisma db seed

echo "--- Starting Application ---"
exec "$@"
