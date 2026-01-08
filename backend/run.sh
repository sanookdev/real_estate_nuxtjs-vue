#!/bin/bash
set -e

echo "Starting backend entrypoint script..."

# Wait for MySQL
echo "Waiting for MySQL at $DB_HOST:3306..."
./wait-for-it.sh $DB_HOST:3306 -t 60

echo "MySQL is available."

# Run database setup (Create tables)
echo "Running database setup..."
node setupDb.js

# Run seed (Allow failure for duplicates)
echo "Seeding database..."
node setupDb.js --seed || echo "Seeding failed (likely duplicates), skipping..."

echo "Starting server..."
exec node server.js
