export interface CEODashboardData {
  systemHealth: number
  revenue: RevenueMetrics
  activeAgents: number
  criticalAlerts: number
  agentPerformance: PerformanceDistribution
  trends: TrendData[]
}

export interface RevenueMetrics {
  current: number
  growth: number
  target: number
  currency: string
}

export interface PerformanceDistribution {
  distribution: {
    excellent: number
    good: number
    concerning: number
    critical: number
  }
  percentages: {
    excellent: number
    good: number
    concerning: number
    critical: number
  }
  total: number
}

export interface SystemStatus {
  database: 'online' | 'offline' | 'degraded'
  registry: 'online' | 'offline' | 'degraded'
  agents: 'operational' | 'degraded' | 'offline'
  lastCheck: string
  error?: string
}

export interface ExecutiveAlert {
  id: string
  message: string
  timestamp: Date
  category: 'system' | 'performance' | 'revenue' | 'agent'
  severity: 'critical' | 'warning' | 'info'
}

export interface AlertsData {
  critical: ExecutiveAlert[]
  warning: ExecutiveAlert[]
  info: ExecutiveAlert[]
}

export interface TrendData {
  date: string
  systemHealth: number
  activeAgents: number
  performance: number
}

export interface QuickAction {
  id: string
  label: string
  description: string
  action: () => void
  category: 'launch' | 'monitor' | 'create' | 'escalate'
  enabled: boolean
}