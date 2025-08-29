/**
 * Production Logger
 * Structured logging for CEO dashboard and system monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  component?: string
  userId?: string
  traceId?: string
  metadata?: Record<string, any>
}

class ProductionLogger {
  private component: string
  private traceId: string

  constructor(component: string, traceId?: string) {
    this.component = component
    this.traceId = traceId || this.generateTraceId()
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      component: this.component,
      traceId: this.traceId,
      metadata
    }

    // In development, use console
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'critical' || level === 'error' ? 'error' :
                      level === 'warn' ? 'warn' : 
                      level === 'debug' ? 'debug' : 'log'
      console[logMethod](`[${level.toUpperCase()}] ${this.component}:`, message, metadata || '')
      return
    }

    // In production, send to logging service
    this.sendToLoggingService(entry)
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // In a real production environment, this would send to:
      // - DataDog, Splunk, CloudWatch, etc.
      // - Internal logging API
      // For now, we'll use structured console logging
      console.log(JSON.stringify(entry))

      // Optional: Send critical alerts to monitoring service
      if (entry.level === 'critical') {
        await this.sendCriticalAlert(entry)
      }
    } catch (error) {
      // Fallback to console if logging service fails
      console.error('Logging service failed:', error)
      console.error('Original log entry:', entry)
    }
  }

  private async sendCriticalAlert(entry: LogEntry) {
    // In production, this would trigger:
    // - PagerDuty alerts
    // - Slack notifications
    // - SMS/email to on-call team
    console.error('🚨 CRITICAL ALERT:', entry)
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, metadata)
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata)
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata)
  }

  critical(message: string, metadata?: Record<string, any>) {
    this.log('critical', message, metadata)
  }

  // CEO Dashboard specific logging methods
  dashboardAccess(userId: string, success: boolean) {
    this.info('CEO dashboard access attempt', {
      userId,
      success,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      timestamp: new Date().toISOString()
    })
  }

  dashboardError(error: Error, context?: Record<string, any>) {
    this.error('CEO dashboard error', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }

  performanceMetrics(metrics: Record<string, number>) {
    this.info('Performance metrics recorded', {
      metrics,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Create logger instance for specific component
 */
export function createLogger(component: string, traceId?: string): ProductionLogger {
  return new ProductionLogger(component, traceId)
}

/**
 * CEO Dashboard logger instance
 */
export const ceoDashboardLogger = createLogger('CEODashboard')

/**
 * System health logger instance
 */
export const systemHealthLogger = createLogger('SystemHealth')

/**
 * Agent monitoring logger instance
 */
export const agentMonitoringLogger = createLogger('AgentMonitoring')