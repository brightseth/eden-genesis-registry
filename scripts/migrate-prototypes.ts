#!/usr/bin/env tsx

import { betaPrototypeManager } from '@/lib/beta-prototype-manager'
import { PrototypeVersion } from '@/lib/schemas/prototype.schema'

// Define existing prototypes to migrate into the beta system
const PROTOTYPE_MIGRATIONS: Record<string, PrototypeVersion[]> = {
  miyomi: [
    {
      id: 'miyomi-trading-v1',
      version: '1.0',
      title: 'Original Trading Dashboard',
      description: 'First implementation of MIYOMI trading interface with basic position tracking and simple metrics display',
      type: 'dashboard',
      status: 'archived',
      url: 'https://miyomi-v1-archive.eden.art',
      features: ['position-tracking', 'basic-metrics', 'manual-refresh', 'simple-ui'],
      createdAt: '2025-07-15T10:00:00Z',
      archivedAt: '2025-08-15T10:00:00Z',
      metadata: {
        archiveReason: 'Replaced by enhanced version with real-time data',
        originalDeveloper: 'seth',
        technicalDebt: 'Manual data refresh, no real-time updates'
      }
    },
    {
      id: 'miyomi-chat-interface',
      version: '2.0-beta',
      title: 'Contrarian Chat Interface',
      description: 'Experimental chat-based trading advice interface with personality-driven responses',
      type: 'interface',
      status: 'archived',
      component: '@/prototypes/miyomi/chat-v2',
      features: ['chat-interface', 'contrarian-analysis', 'personality-responses', 'trade-suggestions'],
      createdAt: '2025-07-20T14:30:00Z',
      archivedAt: '2025-08-01T09:00:00Z',
      metadata: {
        archiveReason: 'User testing showed preference for dashboard format',
        testResults: 'Lower engagement than dashboard interface',
        learnings: 'Chat format better for explanations than quick data access'
      }
    }
  ],
  
  sue: [
    {
      id: 'sue-basic-curator',
      version: '1.0',
      title: 'Basic Curator Interface',
      description: 'Initial curatorial analysis interface with simple 5-point scoring system',
      type: 'dashboard',
      status: 'archived',
      features: ['5-point-scoring', 'manual-review', 'basic-categories', 'simple-analysis'],
      createdAt: '2025-07-10T09:00:00Z',
      archivedAt: '2025-08-10T15:00:00Z',
      metadata: {
        archiveReason: 'Enhanced with multi-dimensional scoring system',
        originalScoring: 'Simple 1-5 scale',
        enhancement: 'Replaced with 100-point weighted scoring system'
      }
    },
    {
      id: 'sue-batch-analyzer',
      version: '1.5-exp',
      title: 'Batch Analysis Tool',
      description: 'Experimental tool for analyzing multiple artworks simultaneously',
      type: 'component',
      status: 'experimental',
      component: '@/prototypes/sue/batch-analyzer',
      features: ['batch-processing', 'comparative-analysis', 'efficiency-tools', 'bulk-scoring'],
      createdAt: '2025-08-20T11:00:00Z',
      metadata: {
        targetUseCase: 'Gallery exhibitions and collection reviews',
        performance: 'Can analyze up to 50 works simultaneously',
        limitations: 'Requires significant computational resources'
      }
    }
  ],

  bertha: [
    {
      id: 'bertha-simple-analytics',
      version: '1.0',
      title: 'Simple Analytics Dashboard',
      description: 'Original portfolio tracking interface with basic performance metrics',
      type: 'dashboard',
      status: 'archived',
      features: ['portfolio-tracking', 'basic-metrics', 'static-charts', 'manual-data-entry'],
      createdAt: '2025-07-01T12:00:00Z',
      archivedAt: '2025-08-01T16:00:00Z',
      metadata: {
        archiveReason: 'Replaced with real-time advanced analytics',
        limitations: 'No real-time data, manual entry required',
        evolution: 'Became foundation for current advanced dashboard'
      }
    }
  ],

  abraham: [
    {
      id: 'abraham-token-calculator',
      version: '0.9-beta',
      title: 'Tokenomics Calculator',
      description: 'Early prototype for calculating agent tokenization parameters and economics',
      type: 'component',
      status: 'experimental',
      component: '@/prototypes/abraham/token-calculator',
      features: ['tokenomics-calculation', 'economic-modeling', 'revenue-projection', 'valuation-tools'],
      createdAt: '2025-08-10T14:00:00Z',
      metadata: {
        purpose: 'Agent tokenization readiness assessment',
        status: 'Awaiting launch readiness validation',
        nextSteps: 'Integration with Registry tokenization system'
      }
    }
  ],

  citizen: [
    {
      id: 'citizen-training-v1',
      version: '1.0',
      title: 'Single Trainer Interface',
      description: 'Original training interface designed for individual trainer workflow',
      type: 'dashboard',
      status: 'archived',
      features: ['single-trainer', 'basic-feedback', 'simple-progress', 'manual-validation'],
      createdAt: '2025-07-05T13:00:00Z',
      archivedAt: '2025-08-25T10:00:00Z',
      metadata: {
        archiveReason: 'Replaced with multi-trainer collaboration system',
        limitation: 'Could not handle Henry & Keith collaboration requirements',
        evolution: 'Expanded into current collaborative training system'
      }
    }
  ],

  solienne: [
    {
      id: 'solienne-basic-gallery',
      version: '1.0',
      title: 'Basic Image Gallery',
      description: 'Simple grid-based image gallery without curation features',
      type: 'interface',
      status: 'archived',
      features: ['grid-layout', 'basic-pagination', 'simple-filtering', 'static-display'],
      createdAt: '2025-06-20T10:00:00Z',
      archivedAt: '2025-08-20T14:00:00Z',
      metadata: {
        archiveReason: 'Enhanced with curation system and collections',
        originalLimitations: 'No curation features, no collections, basic functionality',
        currentEvolution: 'Museum-quality gallery with curatorial intelligence'
      }
    }
  ],

  verdelis: [
    {
      id: 'verdelis-basic-profile',
      version: '0.1-alpha',
      title: 'Initial Profile Interface',
      description: 'Basic agent profile page before environmental specialization',
      type: 'interface',
      status: 'experimental',
      component: '@/prototypes/verdelis/basic-profile',
      features: ['basic-info', 'static-content', 'minimal-styling'],
      createdAt: '2025-08-28T09:00:00Z',
      metadata: {
        purpose: 'Foundation for environmental artist persona development',
        status: 'Active development - being enhanced with environmental features',
        nextFeatures: ['carbon-tracking', 'sustainability-metrics', 'environmental-data-viz']
      }
    }
  ]
}

async function migratePrototypes() {
  console.log('🔄 Starting prototype migration to beta system...\n')

  let totalMigrated = 0
  let totalErrors = 0

  for (const [agentHandle, prototypes] of Object.entries(PROTOTYPE_MIGRATIONS)) {
    console.log(`📦 Migrating prototypes for ${agentHandle.toUpperCase()}...`)
    
    for (const prototype of prototypes) {
      try {
        await betaPrototypeManager.registerPrototype(agentHandle, {
          version: prototype.version,
          title: prototype.title,
          description: prototype.description,
          type: prototype.type,
          status: prototype.status,
          url: prototype.url,
          component: prototype.component,
          features: prototype.features,
          metadata: prototype.metadata
        })
        
        console.log(`  ✅ Migrated: ${prototype.title} (v${prototype.version})`)
        totalMigrated++
      } catch (error) {
        console.error(`  ❌ Failed to migrate ${prototype.title}:`, error)
        totalErrors++
      }
    }
    
    console.log(`  📊 Agent ${agentHandle}: ${prototypes.length} prototypes processed\n`)
  }

  console.log('🎯 MIGRATION SUMMARY')
  console.log('===================')
  console.log(`Total prototypes migrated: ${totalMigrated}`)
  console.log(`Total errors: ${totalErrors}`)
  console.log(`Agents with prototypes: ${Object.keys(PROTOTYPE_MIGRATIONS).length}`)
  
  if (totalErrors === 0) {
    console.log('\n✅ All prototypes migrated successfully!')
  } else {
    console.log('\n⚠️ Some migrations failed. Check logs above for details.')
  }
}

async function validateMigration() {
  console.log('\n🔍 Validating migration results...\n')
  
  for (const agentHandle of Object.keys(PROTOTYPE_MIGRATIONS)) {
    try {
      const collection = await betaPrototypeManager.getAgentPrototypes(agentHandle)
      console.log(`${agentHandle.toUpperCase()}:`)
      console.log(`  - Total prototypes: ${collection.totalPrototypes}`)
      console.log(`  - Active experiments: ${collection.activeExperiments}`)
      console.log(`  - Archived: ${collection.archived.length}`)
      console.log(`  - Last updated: ${collection.lastUpdated}`)
    } catch (error) {
      console.error(`❌ Failed to validate ${agentHandle}:`, error)
    }
  }
}

if (require.main === module) {
  migratePrototypes()
    .then(() => validateMigration())
    .then(() => {
      console.log('\n🚀 Beta prototype system ready!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migratePrototypes, validateMigration, PROTOTYPE_MIGRATIONS }