/**
 * CEO Dashboard Feature Flags
 * Gradual rollout and rollback configuration for executive dashboard
 */

export const ceoDashboardFlags = {
  // Main feature flag for CEO dashboard
  ceoDashboard: {
    enabled: process.env.FEATURE_CEO_DASHBOARD === 'true',
    rolloutPercentage: parseInt(process.env.CEO_DASHBOARD_ROLLOUT_PERCENTAGE || '0'),
    description: 'Executive-level dashboard with system health and agent performance metrics'
  },

  // Individual component flags for granular control
  executiveMetrics: {
    enabled: process.env.FEATURE_CEO_EXECUTIVE_METRICS === 'true',
    description: 'KPI cards showing system health, revenue, agents, and alerts'
  },

  agentPerformanceOverview: {
    enabled: process.env.FEATURE_CEO_AGENT_OVERVIEW === 'true', 
    description: 'Agent performance distribution and status breakdown'
  },

  systemHealthIndicator: {
    enabled: process.env.FEATURE_CEO_SYSTEM_HEALTH === 'true',
    description: 'Real-time system status for Registry, Academy, Gateway, Database'
  },

  quickActionsPanel: {
    enabled: process.env.FEATURE_CEO_QUICK_ACTIONS === 'true',
    description: 'Executive shortcuts for launch, monitor, create, escalate actions'
  },

  executiveAlerts: {
    enabled: process.env.FEATURE_CEO_ALERTS === 'true',
    description: 'Critical issues requiring CEO attention with action requirements'
  },

  trendVisualization: {
    enabled: process.env.FEATURE_CEO_TRENDS === 'true',
    description: '7-day historical trends for key executive metrics'
  },

  // Advanced features
  realTimeUpdates: {
    enabled: process.env.FEATURE_CEO_REALTIME === 'true',
    description: 'Auto-refresh dashboard data every 5 minutes'
  },

  historicalAnalytics: {
    enabled: process.env.FEATURE_CEO_HISTORICAL === 'true',
    description: 'Extended historical data and trend analysis'
  },

  emergencyControls: {
    enabled: process.env.FEATURE_CEO_EMERGENCY === 'true',
    description: 'Emergency system controls and incident response tools'
  }
}

/**
 * Check if CEO dashboard is available for current user/environment
 */
export function isCEODashboardEnabled(): boolean {
  return ceoDashboardFlags.ceoDashboard.enabled
}

/**
 * Check if specific CEO dashboard component is enabled
 */
export function isCEOFeatureEnabled(feature: keyof typeof ceoDashboardFlags): boolean {
  return ceoDashboardFlags[feature]?.enabled || false
}

/**
 * Get rollout percentage for gradual deployment
 */
export function getCEORolloutPercentage(): number {
  return ceoDashboardFlags.ceoDashboard.rolloutPercentage
}

/**
 * Feature flag middleware for CEO dashboard routes
 */
export function checkCEODashboardAccess(userId?: string): boolean {
  if (!ceoDashboardFlags.ceoDashboard.enabled) {
    return false
  }

  // If rollout is at 100%, allow all users
  if (ceoDashboardFlags.ceoDashboard.rolloutPercentage >= 100) {
    return true
  }

  // For gradual rollout, use user ID hash for consistent assignment
  if (userId && ceoDashboardFlags.ceoDashboard.rolloutPercentage > 0) {
    const hash = Array.from(userId).reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff
    }, 0)
    
    const userPercentile = Math.abs(hash % 100)
    return userPercentile < ceoDashboardFlags.ceoDashboard.rolloutPercentage
  }

  return false
}