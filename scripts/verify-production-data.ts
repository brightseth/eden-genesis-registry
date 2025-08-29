#!/usr/bin/env tsx

/**
 * Verify Production Database Data
 * Checks what agents exist in production database
 */

import { PrismaClient } from '@prisma/client'

const productionDatabaseUrl = "postgresql://postgres.avzafhqjohminbptrbdp:Krist1420s!@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: productionDatabaseUrl,
    },
  },
})

async function verifyProductionData() {
  console.log('🔍 Checking production database data...')
  
  try {
    // Test connection
    const now = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Database connected:', now)
    
    // Check cohorts
    const cohorts = await prisma.cohort.findMany()
    console.log(`📊 Cohorts: ${cohorts.length}`)
    cohorts.forEach(cohort => {
      console.log(`  - ${cohort.slug}: ${cohort.title} (${cohort.status})`)
    })
    
    // Check agents
    const agents = await prisma.agent.findMany({
      include: {
        profile: true,
        cohort: true
      }
    })
    console.log(`👤 Agents: ${agents.length}`)
    agents.forEach(agent => {
      console.log(`  - ${agent.handle}: ${agent.displayName} (${agent.role}, ${agent.status})`)
      if (agent.profile) {
        console.log(`    📝 Profile: "${agent.profile.statement?.substring(0, 50)}..."`)
      }
    })
    
    // Check profiles  
    const profiles = await prisma.profile.findMany()
    console.log(`📋 Profiles: ${profiles.length}`)
    
    // Check progress checklists
    const checklists = await prisma.progressChecklist.findMany()
    console.log(`✅ Checklists: ${checklists.length}`)
    
    console.log('\n🎯 Summary:')
    console.log(`Total records: ${cohorts.length + agents.length + profiles.length + checklists.length}`)
    
    if (agents.length === 0) {
      console.log('⚠️  No agents found in production database!')
      console.log('This explains why the API returns empty results.')
    } else {
      console.log('✅ Data exists - API should be working')
      console.log('If API still returns empty, check environment variables or deployment refresh.')
    }
    
  } catch (error) {
    console.error('❌ Database verification failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyProductionData()