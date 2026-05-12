#!/bin/bash
# Prime Cloud - Build Script for Production
# Run this locally or use GitHub Actions (recommended)
# Usage: bash build.sh

set -euo pipefail

echo "=== Prime Cloud Production Build ==="

# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build packages
echo "[1/4] Building shared packages..."
pnpm --filter @prime-cloud/shared-types build 2>/dev/null || true
pnpm --filter @prime-cloud/accounting-engine build 2>/dev/null || true
pnpm --filter @prime-cloud/zatca-sdk build 2>/dev/null || true

# 3. Build NestJS API
echo "[2/4] Building NestJS API..."
pnpm --filter @prime-cloud/api build

# 4. Build Next.js Dashboard
echo "[3/4] Building Next.js Dashboard..."
NEXT_PUBLIC_API_URL="${API_URL:-https://primecloud.sa/api/v1}" pnpm --filter @prime-cloud/dashboard build

# 5. Build POS app
echo "[4/4] Building POS app..."
pnpm --filter @prime-cloud/pos build

# 6. Assemble deploy package
echo "Assembling deploy package..."
rm -rf deploy-temp
mkdir -p deploy-temp/api
mkdir -p deploy-temp/public/dashboard
mkdir -p deploy-temp/public/pos

# Copy API build
cp -r apps/api/dist/* deploy-temp/api/ 2>/dev/null || echo "Warning: API dist not found"
cp apps/api/package.json deploy-temp/api/ 2>/dev/null || true

# Copy Dashboard
if [ -d "apps/dashboard/out" ]; then
  cp -r apps/dashboard/out/* deploy-temp/public/dashboard/
elif [ -d "apps/dashboard/.next/standalone" ]; then
  cp -r apps/dashboard/.next/standalone/* deploy-temp/
fi

# Copy POS
cp -r apps/pos/dist/* deploy-temp/public/pos/ 2>/dev/null || echo "Warning: POS dist not found"

# Copy deploy bootstrap
cp deploy/package.json deploy-temp/
cp deploy/server.js deploy-temp/
cp deploy/start.sh deploy-temp/
chmod +x deploy-temp/start.sh

# Install production dependencies
cd deploy-temp
npm install --production 2>/dev/null || true
cd ..

# Clean up old deploy
rm -rf deploy/public deploy/api deploy/node_modules deploy/package-lock.json

# Move new build to deploy
cp -r deploy-temp/* deploy/
rm -rf deploy-temp

echo ""
echo "=== Build Complete ==="
echo "Deploy folder is ready at: $(pwd)/deploy"
echo "Upload this folder to your Hostinger server."
