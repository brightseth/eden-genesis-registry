import { PrototypeVersion } from '@/lib/schemas/prototype.schema'
import { betaPrototypeManager } from '@/lib/beta-prototype-manager'

/**
 * Migration hooks for moving existing dashboards and interfaces to beta system
 */

export interface DashboardMigrationConfig {
  agentHandle: string
  currentPath: string
  prototypeTitle: string
  prototypeDescription: string
  version: string
  features: string[]
  migrationReason: string
  replacementPath?: string
}

export class BetaMigrationService {
  
  /**
   * Migrate an existing dashboard to beta archive
   */
  async migrateDashboardToBeta(config: DashboardMigrationConfig): Promise<PrototypeVersion> {
    const prototype: Omit<PrototypeVersion, 'id' | 'createdAt'> = {
      version: config.version,
      title: config.prototypeTitle,
      description: config.prototypeDescription,
      type: 'dashboard',
      status: 'archived',
      url: config.currentPath,
      features: config.features,
      archivedAt: new Date().toISOString(),
      metadata: {
        migrationReason: config.migrationReason,
        originalPath: config.currentPath,
        replacementPath: config.replacementPath,
        migratedBy: 'system',
        migrationDate: new Date().toISOString(),
        category: 'dashboard-migration'
      }
    }

    return await betaPrototypeManager.registerPrototype(config.agentHandle, prototype)
  }

  /**
   * Create beta experiment from current development work
   */
  async createExperimentFromCurrent(
    agentHandle: string, 
    title: string, 
    description: string,
    componentPath?: string,
    features: string[] = []
  ): Promise<PrototypeVersion> {
    const experiment: Omit<PrototypeVersion, 'id' | 'createdAt'> = {
      version: `${Date.now()}-exp`,
      title,
      description,
      type: componentPath ? 'component' : 'interface',
      status: 'experimental',
      component: componentPath,
      features,
      metadata: {
        createdFrom: 'current-development',
        experimentalPhase: 'alpha',
        stabilityLevel: 'unstable',
        reviewRequired: true
      }
    }

    return await betaPrototypeManager.registerPrototype(agentHandle, experiment)
  }

  /**
   * Batch migrate multiple dashboards for an agent
   */
  async batchMigrateDashboards(configs: DashboardMigrationConfig[]): Promise<{
    successful: PrototypeVersion[]
    failed: { config: DashboardMigrationConfig, error: string }[]
  }> {
    const results = {
      successful: [] as PrototypeVersion[],
      failed: [] as { config: DashboardMigrationConfig, error: string }[]
    }

    for (const config of configs) {
      try {
        const prototype = await this.migrateDashboardToBeta(config)
        results.successful.push(prototype)
      } catch (error) {
        results.failed.push({
          config,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  /**
   * Generate migration report for an agent's current interfaces
   */
  async generateMigrationReport(agentHandle: string): Promise<{
    dashboardsFound: string[]
    sitesFound: string[]
    componentsFound: string[]
    migrationCandidates: DashboardMigrationConfig[]
    recommendations: string[]
  }> {
    // Scan for existing interfaces that should be migrated
    const report = {
      dashboardsFound: [`/dashboard/${agentHandle}`],
      sitesFound: [`/sites/${agentHandle}`],
      componentsFound: [],
      migrationCandidates: [] as DashboardMigrationConfig[],
      recommendations: []
    }

    // Check if agent has existing dashboard that should be archived
    const existingDashboard = `/dashboard/${agentHandle}`
    
    // Generate migration candidate based on agent
    const migrationCandidate: DashboardMigrationConfig = {
      agentHandle,
      currentPath: existingDashboard,
      prototypeTitle: `${agentHandle.toUpperCase()} Original Dashboard`,
      prototypeDescription: `Original trainer dashboard before enhanced features integration`,
      version: '1.0',
      features: ['basic-metrics', 'trainer-interface', 'simple-navigation'],
      migrationReason: 'Replaced with enhanced production dashboard',
      replacementPath: `/dashboard/${agentHandle}` // Same path, but enhanced version
    }

    report.migrationCandidates.push(migrationCandidate)
    
    report.recommendations = [
      `Archive current ${agentHandle} dashboard as prototype reference`,
      `Create beta environment for experimental ${agentHandle} features`,
      `Set up feature flags for gradual rollout of new capabilities`,
      `Preserve trainer interface history for development insights`
    ]

    return report
  }

  /**
   * Auto-discover prototype components in the codebase
   */
  async discoverPrototypeComponents(agentHandle: string): Promise<string[]> {
    // In production, this would scan the filesystem
    // For now, return known prototype components
    const knownComponents = {
      miyomi: ['chat-interface', 'ai-advisor', 'legacy-trading'],
      sue: ['batch-analyzer', 'ai-enhanced-curation', 'simple-curator'],
      abraham: ['tokenomics-calculator', 'launch-tracker'],
      citizen: ['single-trainer-interface', 'basic-governance'],
      verdelis: ['basic-profile', 'carbon-tracker'],
      solienne: ['simple-gallery', 'consciousness-generator'],
      bertha: ['legacy-analytics', 'simple-portfolio'],
      geppetto: ['basic-storyteller', 'narrative-builder'],
      koru: ['wisdom-interface', 'meditation-tracker'],
      nina: ['basic-social', 'influence-tracker']
    }

    return knownComponents[agentHandle as keyof typeof knownComponents] || []
  }
}

export const betaMigrationService = new BetaMigrationService()

/**
 * Predefined migration configurations for known prototypes
 */
export const KNOWN_MIGRATIONS: Record<string, DashboardMigrationConfig[]> = {
  citizen: [
    {
      agentHandle: 'citizen',
      currentPath: '/dashboard/citizen',
      prototypeTitle: 'Single Trainer Interface',
      prototypeDescription: 'Original training interface designed for individual trainer workflow before Henry & Keith collaboration requirements',
      version: '1.0',
      features: ['single-trainer', 'basic-feedback', 'simple-progress', 'manual-validation'],
      migrationReason: 'Replaced with multi-trainer collaboration system to support Henry & Keith partnership',
      replacementPath: '/dashboard/citizen'
    }
  ],
  miyomi: [
    {
      agentHandle: 'miyomi',
      currentPath: '/dashboard/miyomi-v1',
      prototypeTitle: 'Original Trading Dashboard',
      prototypeDescription: 'First implementation with basic position tracking and manual data refresh',
      version: '1.0',
      features: ['position-tracking', 'basic-metrics', 'manual-refresh'],
      migrationReason: 'Enhanced with real-time data and advanced analytics',
      replacementPath: '/sites/miyomi'
    }
  ],
  sue: [
    {
      agentHandle: 'sue',
      currentPath: '/dashboard/sue-v1',
      prototypeTitle: 'Basic Curator Interface',
      prototypeDescription: 'Initial curatorial analysis with simple 5-point scoring system',
      version: '1.0', 
      features: ['5-point-scoring', 'manual-review', 'basic-categories'],
      migrationReason: 'Enhanced with multi-dimensional 100-point scoring system',
      replacementPath: '/dashboard/sue'
    }
  ]
}