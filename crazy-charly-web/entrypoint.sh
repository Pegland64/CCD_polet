#!/bin/sh
set -e

# Load secrets if they exist
if [ -f /run/secrets/db_password ]; then
  DB_PASSWORD=$(cat /run/secrets/db_password | tr -d '\n\r')
  DB_USER=$(cat /run/secrets/db_user | tr -d '\n\r')
  DB_NAME=$(cat /run/secrets/db_name | tr -d '\n\r')
  
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}?schema=public"
  echo "Using secrets for database connection."
fi

until nc -z db 5432; do
  echo "Waiting for database..."
  sleep 2
done

echo "--- Database is ready! ---"

echo "--- Generating Prisma Client ---"
npx prisma@5 generate

echo "--- Running Prisma DB Push ---"
npx prisma@5 db push --accept-data-loss

echo "--- Running Prisma DB Seed ---"
npx prisma@5 db seed

echo "--- Starting Application ---"
exec "$@"
