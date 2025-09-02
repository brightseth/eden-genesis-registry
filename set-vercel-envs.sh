#!/bin/bash
echo "Setting Vercel Build + Runtime environment variables..."

# These need to be in Build env for migrations to run
npx vercel env rm DATABASE_URL production --yes 2>/dev/null || true
npx vercel env rm DIRECT_URL production --yes 2>/dev/null || true  
npx vercel env rm REGISTRY_SERVICE_KEY production --yes 2>/dev/null || true

# Add with both Build and Runtime scopes
echo "postgresql://postgres.avzafhqjohminbptrbdp:Krist1420s%21@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require" | npx vercel env add DATABASE_URL production 2>/dev/null

echo "postgresql://postgres.avzafhqjohminbptrbdp:Krist1420s%21@db.avzafhqjohminbptrbdp.supabase.co:5432/postgres?sslmode=require" | npx vercel env add DIRECT_URL production 2>/dev/null

echo "registry-service-key-2025-eden-solienne-works" | npx vercel env add REGISTRY_SERVICE_KEY production 2>/dev/null

echo "Done! Environment variables set for Build + Runtime"
