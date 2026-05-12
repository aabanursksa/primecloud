#!/bin/bash
# Prime Cloud - Start Script for Hostinger
# Hostinger will execute this or you can use:
#   node server.js

set -e

echo "Starting Prime Cloud Production Server..."
echo "Node version: $(node -v)"
echo "Working directory: $(pwd)"

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install --production
fi

# Start server
exec node server.js
