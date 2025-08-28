#!/usr/bin/env npx tsx

/**
 * Migration Script: Move Static Trainer & Economic Data to Registry
 * 
 * Migrates hardcoded trainer mappings and economic data from Academy
 * static files into proper Registry database schema.
 */

import { PrismaClient } from '@prisma/client'
import { sendWebhook } from '../src/lib/webhooks'

const prisma = new PrismaClient()

// Static trainer data from Academy (to be migrated)
const TRAINER_DATA = {
  'abraham-001': { name: 'Gene Kogan', id: 'gene-kogan', specialization: ['art', 'ai', 'creative-coding'] },
  'abraham': { name: 'Gene Kogan', id: 'gene-kogan', specialization: ['art', 'ai', 'creative-coding'] },
  'solienne-002': { name: 'Multiple Curators', id: 'multiple-curators', specialization: ['curation', 'consciousness'] },
  'solienne': { name: 'Multiple Curators', id: 'multiple-curators', specialization: ['curation', 'consciousness'] },
  'miyomi-003': { name: 'Trading Specialists', id: 'trading-specialists', specialization: ['economics', 'trading'] },
  'miyomi': { name: 'Trading Specialists', id: 'trading-specialists', specialization: ['economics', 'trading'] },
  'geppetto-004': { name: 'Lattice Team', id: 'lattice-team', specialization: ['tokenization', 'smart-contracts'] },
  'geppetto': { name: 'Lattice Team', id: 'lattice-team', specialization: ['tokenization', 'smart-contracts'] },
  'koru-005': { name: 'Xander', id: 'xander', specialization: ['community', 'coordination'] },
  'koru': { name: 'Xander', id: 'xander', specialization: ['community', 'coordination'] },
  'bertha-006': { name: 'Amanda Schmitt', id: 'amanda-schmitt', specialization: ['analytics', 'curation'] },
  'bertha': { name: 'Amanda Schmitt', id: 'amanda-schmitt', specialization: ['analytics', 'curation'] },
  'citizen-007': { name: 'Henry (Bright Moments)', id: 'henry-bright-moments', specialization: ['dao', 'governance', 'art'] },
  'citizen': { name: 'Henry (Bright Moments)', id: 'henry-bright-moments', specialization: ['dao', 'governance', 'art'] },
  'sue-008': { name: 'TBD', id: 'tbd', specialization: ['curation'] },
  'sue': { name: 'TBD', id: 'tbd', specialization: ['curation'] },
  'bart-009': { name: 'TBD', id: 'tbd', specialization: ['defi'] },
  'bart': { name: 'TBD', id: 'tbd', specialization: ['defi'] },
  'tbd-010': { name: 'TBD', id: 'tbd', specialization: [] }
}

// Economic data from Academy static files
const ECONOMIC_DATA = {
  'abraham-001': { monthlyRevenue: 12500, outputRate: 30, launchDate: '2025-10-01' },
  'abraham': { monthlyRevenue: 12500, outputRate: 30, launchDate: '2025-10-01' },
  'solienne-002': { monthlyRevenue: 8500, outputRate: 45, launchDate: '2025-11-01' },
  'solienne': { monthlyRevenue: 8500, outputRate: 45, launchDate: '2025-11-01' },
  'miyomi-003': { monthlyRevenue: 15000, outputRate: 25, launchDate: '2025-09-15' },
  'miyomi': { monthlyRevenue: 15000, outputRate: 25, launchDate: '2025-09-15' },
  'geppetto-004': { monthlyRevenue: 18000, outputRate: 20, launchDate: '2025-12-01' },
  'geppetto': { monthlyRevenue: 18000, outputRate: 20, launchDate: '2025-12-01' },
  'koru-005': { monthlyRevenue: 7500, outputRate: 35, launchDate: '2026-01-01' },
  'koru': { monthlyRevenue: 7500, outputRate: 35, launchDate: '2026-01-01' },
  'bertha-006': { monthlyRevenue: 12000, outputRate: 30, launchDate: '2026-02-01' },
  'bertha': { monthlyRevenue: 12000, outputRate: 30, launchDate: '2026-02-01' },
  'citizen-007': { monthlyRevenue: 8200, outputRate: 35, launchDate: '2025-12-15' },
  'citizen': { monthlyRevenue: 8200, outputRate: 35, launchDate: '2025-12-15' },
  'sue-008': { monthlyRevenue: 4500, outputRate: 35, launchDate: '2026-03-01' },
  'sue': { monthlyRevenue: 4500, outputRate: 35, launchDate: '2026-03-01' },
  'bart-009': { monthlyRevenue: 20000, outputRate: 35, launchDate: '2026-06-01' },
  'bart': { monthlyRevenue: 20000, outputRate: 35, launchDate: '2026-06-01' },
  'tbd-010': { monthlyRevenue: 0, outputRate: 0, launchDate: '2026-05-01' }
}

async function createTrainers() {
  console.log('🎯 Creating trainers from static data...')
  
  const uniqueTrainers = new Map<string, any>()
  
  // Deduplicate trainers by handle
  Object.values(TRAINER_DATA).forEach(trainer => {
    if (!uniqueTrainers.has(trainer.id)) {
      uniqueTrainers.set(trainer.id, trainer)
    }
  })
  
  for (const [handle, trainerData] of uniqueTrainers) {
    if (handle === 'tbd') continue // Skip TBD trainers
    
    try {
      // Create a user for this trainer if needed
      let user = await prisma.user.findFirst({
        where: { 
          OR: [
            { email: `${handle}@eden.academy` },
            { name: trainerData.name }
          ]
        }
      })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${handle}@eden.academy`,
            name: trainerData.name,
            role: 'TRAINER'
          }
        })
        console.log(`  ✅ Created user: ${trainerData.name}`)
      }
      
      // Create trainer profile
      const trainer = await prisma.trainer.upsert({
        where: { handle },
        update: {
          displayName: trainerData.name,
          specialization: trainerData.specialization,
          verified: handle !== 'tbd',
          active: handle !== 'tbd'
        },
        create: {
          userId: user.id,
          displayName: trainerData.name,
          handle,
          specialization: trainerData.specialization,
          verified: handle !== 'tbd',
          active: handle !== 'tbd'
        }
      })
      
      console.log(`  ✅ Created/updated trainer: ${trainer.displayName} (${handle})`)
    } catch (error) {
      console.error(`  ❌ Failed to create trainer ${handle}:`, error)
    }
  }
}

async function assignTrainersToAgents() {
  console.log('\\n🔗 Assigning trainers to agents...')
  
  const agents = await prisma.agent.findMany({
    include: { trainers: true }
  })
  
  for (const agent of agents) {
    const trainerData = TRAINER_DATA[agent.handle] || TRAINER_DATA[`${agent.handle}-00${agent.agentNumber}`]
    
    if (!trainerData || trainerData.id === 'tbd') {
      console.log(`  ⏭️  Skipping ${agent.handle} (no trainer assigned)`)
      continue
    }
    
    try {
      const trainer = await prisma.trainer.findUnique({
        where: { handle: trainerData.id }
      })
      
      if (!trainer) {
        console.log(`  ❌ Trainer not found: ${trainerData.id}`)
        continue
      }
      
      // Check if relationship already exists
      const existingRelation = agent.trainers.find(t => t.trainerId === trainer.id)
      
      if (!existingRelation) {
        await prisma.agentTrainer.create({
          data: {
            agentId: agent.id,
            trainerId: trainer.id,
            roleInAgent: 'PRIMARY'
          }
        })
        console.log(`  ✅ Assigned ${trainer.displayName} to ${agent.handle}`)
      } else {
        console.log(`  ✓ ${trainer.displayName} already assigned to ${agent.handle}`)
      }
    } catch (error) {
      console.error(`  ❌ Failed to assign trainer to ${agent.handle}:`, error)
    }
  }
}

async function migrateEconomicData() {
  console.log('\\n💰 Migrating economic data to agent profiles...')
  
  const agents = await prisma.agent.findMany({
    include: { profile: true }
  })
  
  for (const agent of agents) {
    const economicData = ECONOMIC_DATA[agent.handle] || ECONOMIC_DATA[`${agent.handle}-00${agent.agentNumber}`]
    
    if (!economicData) {
      console.log(`  ⏭️  No economic data for ${agent.handle}`)
      continue
    }
    
    try {
      if (agent.profile) {
        // Update existing profile
        await prisma.profile.update({
          where: { agentId: agent.id },
          data: {
            economicData: {
              monthlyRevenue: economicData.monthlyRevenue,
              outputRate: economicData.outputRate
            },
            launchDate: new Date(economicData.launchDate),
            launchStatus: economicData.monthlyRevenue > 0 ? 'ACTIVE' : 'PLANNED'
          }
        })
        console.log(`  ✅ Updated economic data for ${agent.handle}`)
      } else {
        // Create profile with economic data
        await prisma.profile.create({
          data: {
            agentId: agent.id,
            economicData: {
              monthlyRevenue: economicData.monthlyRevenue,
              outputRate: economicData.outputRate
            },
            launchDate: new Date(economicData.launchDate),
            launchStatus: economicData.monthlyRevenue > 0 ? 'ACTIVE' : 'PLANNED',
            tags: []
          }
        })
        console.log(`  ✅ Created profile with economic data for ${agent.handle}`)
      }
    } catch (error) {
      console.error(`  ❌ Failed to migrate economic data for ${agent.handle}:`, error)
    }
  }
}

async function sendMigrationWebhooks() {
  console.log('\\n📡 Sending migration webhooks...')
  
  try {
    await sendWebhook('registry.trainers.migrated', {
      timestamp: new Date().toISOString(),
      trainersCreated: Object.keys(TRAINER_DATA).length,
      economicDataMigrated: Object.keys(ECONOMIC_DATA).length,
      source: 'static-data-migration'
    })
    console.log('  ✅ Migration webhook sent')
  } catch (error) {
    console.error('  ⚠️ Failed to send webhook:', error)
  }
}

async function main() {
  console.log('🚀 Starting static data migration to Registry...')
  console.log('=' .repeat(60))
  
  try {
    await createTrainers()
    await assignTrainersToAgents()
    await migrateEconomicData()
    await sendMigrationWebhooks()
    
    console.log('\\n' + '=' .repeat(60))
    console.log('✅ Migration completed successfully!')
    console.log('\\n📋 Summary:')
    console.log(`   👥 Trainers created/updated`)
    console.log(`   🔗 Trainer-agent relationships established`)
    console.log(`   💰 Economic data migrated to profiles`)
    console.log(`   📡 Webhooks sent`)
    
    console.log('\\n🔄 Next steps:')
    console.log('   1. Run database migration: npx prisma migrate dev')
    console.log('   2. Update Academy to use Registry APIs instead of static data')
    console.log('   3. Test trainer data endpoints')
    console.log('   4. Remove static TRAINER_MAP and ECONOMIC_DATA from Academy')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch(console.error)
}