#!/bin/bash

# Production Database Setup Script for Eden Genesis Registry
# This script ensures the production database has the correct schema and seed data

echo "🚀 Setting up production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Please configure DATABASE_URL in Vercel environment variables"
    exit 1
fi

echo "✅ DATABASE_URL configured"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database (creates tables if they don't exist)
echo "🗄️ Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed the database with Genesis cohort agents
echo "🌱 Seeding database with Genesis agents..."
npx prisma db seed

# Verify the setup
echo "🔍 Verifying database setup..."
AGENT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"Agent\";")

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
    echo "📊 Production database ready with Genesis cohort"
else
    echo "❌ Database verification failed"
    exit 1
fi

echo "🎯 Production setup complete. Deploy with: npx vercel --prod"