#!/usr/bin/env npx tsx

/**
 * Production Database Setup Script
 * Sets up the eden2-registry Supabase database with schema and initial data
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

async function setupProductionDatabase() {
  console.log('🗄️  Setting up production database (eden2-registry)...\n')
  
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required')
    console.error('   Set it to your Supabase connection string:')
    console.error('   export DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@..."')
    process.exit(1)
  }
  
  console.log('📋 Database URL:', DATABASE_URL.replace(/:([^:@]+)@/, ':***@'))
  
  try {
    console.log('\n1️⃣  Pushing Prisma schema to production database...')
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL }
    })
    
    console.log('\n2️⃣  Generating Prisma client...')
    execSync('npx prisma generate', { 
      stdio: 'inherit'
    })
    
    console.log('\n3️⃣  Testing database connection...')
    const prisma = new PrismaClient({
      datasources: {
        db: { url: DATABASE_URL }
      }
    })
    
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    console.log('\n4️⃣  Checking existing data...')
    const agentCount = await prisma.agent.count()
    const cohortCount = await prisma.cohort.count()
    
    console.log(`   Agents: ${agentCount}`)
    console.log(`   Cohorts: ${cohortCount}`)
    
    if (agentCount === 0) {
      console.log('\n5️⃣  Database is empty, running seed script...')
      execSync('npx prisma db seed', { 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL }
      })
      console.log('✅ Initial data seeded!')
    } else {
      console.log('\n5️⃣  Database already has data, skipping seed.')
    }
    
    console.log('\n🎉 Production database setup complete!')
    console.log('🔗 Test at: https://registry.eden2.io/api/v1/status')
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupProductionDatabase()
}

export default setupProductionDatabase