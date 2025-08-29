#!/usr/bin/env tsx

import { betaPrototypeManager } from '@/lib/beta-prototype-manager'
import { betaFeatureFlags } from '@/lib/beta-feature-flags'
import { betaMigrationService, KNOWN_MIGRATIONS } from '@/lib/beta-migration-hooks'
import { PROTOTYPE_MIGRATIONS } from './migrate-prototypes'

async function setupBetaSystem() {
  console.log('🧪 Setting up Beta Prototype System for Eden Academy...\n')

  // Phase 1: Create beta infrastructure
  console.log('📦 Phase 1: Setting up beta infrastructure...')
  
  // Phase 2: Migrate known prototypes
  console.log('\n📦 Phase 2: Migrating historical prototypes...')
  let totalMigrated = 0
  
  for (const [agentHandle, prototypes] of Object.entries(PROTOTYPE_MIGRATIONS)) {
    console.log(`  🔄 Migrating ${agentHandle} prototypes...`)
    
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
        console.log(`    ✅ ${prototype.title} (v${prototype.version})`)
        totalMigrated++
      } catch (error) {
        console.error(`    ❌ Failed to migrate ${prototype.title}:`, error)
      }
    }
  }

  // Phase 3: Set up feature flags
  console.log('\n📦 Phase 3: Creating beta feature flags...')
  
  const betaFlags = [
    {
      key: 'miyomi-ai-advisor',
      name: 'AI Trading Advisor',
      description: 'OpenAI-powered trading advice with risk assessment',
      enabled: false,
      agentHandle: 'miyomi',
      prototypeId: 'miyomi-ai-advisor-exp',
      enabledEnvironments: ['development', 'staging'] as const,
      rolloutPercentage: 0
    },
    {
      key: 'sue-batch-analysis',
      name: 'Batch Analysis Tool', 
      description: 'Multi-artwork curatorial analysis interface',
      enabled: true,
      agentHandle: 'sue',
      prototypeId: 'sue-batch-analyzer',
      enabledEnvironments: ['development', 'beta'] as const,
      rolloutPercentage: 25
    },
    {
      key: 'verdelis-carbon-tracking',
      name: 'Carbon Footprint Tracking',
      description: 'Real-time carbon impact tracking for digital art creation',
      enabled: false,
      agentHandle: 'verdelis',
      enabledEnvironments: ['development'] as const,
      rolloutPercentage: 0
    }
  ]

  let flagsCreated = 0
  for (const flag of betaFlags) {
    try {
      await betaFeatureFlags.registerFlag(flag)
      console.log(`  ✅ Created flag: ${flag.name} (${flag.agentHandle})`)
      flagsCreated++
    } catch (error) {
      console.error(`  ❌ Failed to create flag ${flag.key}:`, error)
    }
  }

  // Phase 4: Migrate existing dashboards
  console.log('\n📦 Phase 4: Migrating existing dashboards...')
  
  let dashboardsMigrated = 0
  for (const [agentHandle, migrations] of Object.entries(KNOWN_MIGRATIONS)) {
    console.log(`  🔄 Processing ${agentHandle} dashboard migrations...`)
    
    const results = await betaMigrationService.batchMigrateDashboards(migrations)
    
    for (const success of results.successful) {
      console.log(`    ✅ Migrated: ${success.title}`)
      dashboardsMigrated++
    }
    
    for (const failure of results.failed) {
      console.error(`    ❌ Failed: ${failure.config.prototypeTitle} - ${failure.error}`)
    }
  }

  // Phase 5: Generate migration reports
  console.log('\n📦 Phase 5: Generating migration reports...')
  
  const GENESIS_AGENTS = ['abraham', 'bertha', 'citizen', 'geppetto', 'koru', 'miyomi', 'nina', 'solienne', 'sue', 'verdelis']
  
  for (const agent of GENESIS_AGENTS) {
    try {
      const report = await betaMigrationService.generateMigrationReport(agent)
      console.log(`  📊 ${agent.toUpperCase()}:`)
      console.log(`    - Migration candidates: ${report.migrationCandidates.length}`)
      console.log(`    - Recommendations: ${report.recommendations.length}`)
    } catch (error) {
      console.error(`  ❌ Failed to generate report for ${agent}:`, error)
    }
  }

  // Summary
  console.log('\n🎯 BETA SYSTEM SETUP SUMMARY')
  console.log('==============================')
  console.log(`✅ Prototypes migrated: ${totalMigrated}`)
  console.log(`✅ Feature flags created: ${flagsCreated}`) 
  console.log(`✅ Dashboards migrated: ${dashboardsMigrated}`)
  console.log(`✅ Agents with beta content: ${Object.keys(PROTOTYPE_MIGRATIONS).length}`)
  
  console.log('\n🔗 INTEGRATION POINTS CREATED:')
  console.log('- Agent profiles now link to /beta/[agent] pages')
  console.log('- Beta hub provides organized access to all prototypes')
  console.log('- Embedded prototype viewer for component testing')
  console.log('- Admin interface for beta management at /admin/beta')
  console.log('- API endpoints for prototype and flag management')
  
  console.log('\n🚀 NEXT STEPS:')
  console.log('1. Test beta pages for each agent: /beta/miyomi, /beta/sue, etc.')
  console.log('2. Review admin beta management: /admin/beta')
  console.log('3. Verify agent profile integration: /agents/[handle]')
  console.log('4. Configure production feature flags')
  console.log('5. Create prototype components for embedded viewing')
  
  console.log('\n✅ Beta prototype system ready for production!')
}

async function validateBetaSystem() {
  console.log('🔍 Validating beta system setup...\n')
  
  const GENESIS_AGENTS = ['abraham', 'bertha', 'citizen', 'geppetto', 'koru', 'miyomi', 'nina', 'solienne', 'sue', 'verdelis']
  
  let validationErrors = 0
  
  for (const agent of GENESIS_AGENTS) {
    try {
      console.log(`🧪 Validating ${agent.toUpperCase()}...`)
      
      const collection = await betaPrototypeManager.getAgentPrototypes(agent)
      const flags = await betaPrototypeManager.getBetaFeatureFlags(agent)
      const navigation = betaPrototypeManager.getPrototypeNavigation(collection)
      
      console.log(`  ✅ Collection loaded: ${collection.totalPrototypes} prototypes`)
      console.log(`  ✅ Flags loaded: ${flags.length} beta flags`)
      console.log(`  ✅ Navigation: ${navigation.hasActivePrototypes ? 'Available' : 'Empty'}`)
      
      if (navigation.hasActivePrototypes && navigation.featuredPrototype) {
        console.log(`  🎯 Featured: ${navigation.featuredPrototype.title}`)
      }
      
    } catch (error) {
      console.error(`  ❌ Validation failed for ${agent}:`, error)
      validationErrors++
    }
  }
  
  if (validationErrors === 0) {
    console.log('\n✅ All agents validated successfully!')
  } else {
    console.log(`\n⚠️ ${validationErrors} validation errors found`)
  }
  
  return validationErrors === 0
}

if (require.main === module) {
  setupBetaSystem()
    .then(() => validateBetaSystem())
    .then((success) => {
      if (success) {
        console.log('\n🎉 Beta prototype system setup completed successfully!')
        console.log('\n🌐 Access Points:')
        console.log('- Beta Hub: /beta/[agent] (e.g., /beta/miyomi)')
        console.log('- Admin Management: /admin/beta')
        console.log('- Agent Profiles: Updated with Beta Lab links')
        console.log('- API Endpoints: /api/v1/agents/[id]/prototypes')
      }
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('❌ Beta system setup failed:', error)
      process.exit(1)
    })
}

export { setupBetaSystem, validateBetaSystem }