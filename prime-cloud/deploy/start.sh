#!/bin/bash
# Prime Cloud Deployment - Start Script
# Usage: ./start.sh

# Load .env
set -a
source .env
set +a

# Install dependencies if needed
npm install

# Start server
node server.js
