#!/bin/bash
# Deploy Works migration to production Registry database

echo "🚀 Deploying Works migration to Registry production database"
echo "=================================================="

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

# Apply the migration
echo "📦 Applying migration..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Verify the deployment at https://eden-genesis-registry.vercel.app"
echo "2. Run the backfill script to populate SOLIENNE works"
echo "3. Test the API at /api/v1/agents/solienne/works"