#!/bin/bash

# Eden Academy Consolidated Deployment Script
# Deploy single-app architecture with three-tier routing

set -e

echo "🚀 Eden Academy Consolidated Deployment"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from the project root."
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check for required files
REQUIRED_FILES=(
  "src/app/sites/abraham/page.tsx"
  "src/app/sites/solienne/page.tsx"
  "src/app/dashboard/abraham/page.tsx"
  "src/app/dashboard/solienne/page.tsx"
  "src/lib/registry-client.ts"
  "vercel-consolidated.json"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo ""
  echo "❌ Missing required files. Please ensure all three-tier pages are created."
  exit 1
fi

echo ""
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix build errors before deploying."
  exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for deployment type
echo "🎯 Deployment options:"
echo "  1) Preview deployment (test before production)"
echo "  2) Production deployment"
echo ""
read -p "Choose deployment type (1 or 2): " DEPLOY_TYPE

case $DEPLOY_TYPE in
  1)
    echo "🔍 Creating preview deployment..."
    vercel --local-config vercel-consolidated.json
    ;;
  2)
    echo "🚀 Creating production deployment..."
    vercel --prod --local-config vercel-consolidated.json
    ;;
  *)
    echo "❌ Invalid option. Please choose 1 or 2."
    exit 1
    ;;
esac

DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo ""
  echo "🔍 Running post-deployment verification..."
  echo ""
  
  # Wait a moment for deployment to propagate
  sleep 5
  
  # Run verification script
  if [ -f "scripts/verify-consolidated-deployment.ts" ]; then
    npx tsx scripts/verify-consolidated-deployment.ts
  else
    echo "⚠️  Verification script not found. Manual testing recommended."
  fi
  
  echo ""
  echo "🎉 Consolidated deployment complete!"
  echo ""
  echo "📊 Key Routes to Test:"
  echo "  Tier 1: https://academy.eden2.io/academy/agent/miyomi"
  echo "  Tier 2: https://academy.eden2.io/sites/abraham"
  echo "  Tier 3: https://academy.eden2.io/dashboard/citizen"
  echo "  API:    https://academy.eden2.io/api/v1/agents"
  echo ""
  echo "🔧 Next Steps:"
  echo "  1. Configure domain routing in Vercel dashboard"
  echo "  2. Test all three-tier routes"
  echo "  3. Verify Registry integration"
  
else
  echo ""
  echo "❌ Deployment failed. Check the error messages above."
  exit 1
fi