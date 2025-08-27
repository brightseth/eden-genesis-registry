import { NextRequest, NextResponse } from 'next/server'
import { AgentMonitoringSystem } from '@/lib/agent-monitoring'
import { ApplicationGateway } from '@/lib/application-gateway'

// GET /api/v1/monitoring/health
// Combined health check for all Registry systems
export async function GET(request: NextRequest) {
  try {
    // Check all system components
    const [monitoringHealth, gatewayHealth] = await Promise.all([
      AgentMonitoringSystem.healthCheck(),
      ApplicationGateway.healthCheck()
    ])

    const overallHealthy = monitoringHealth.healthy && gatewayHealth.healthy

    return NextResponse.json({
      status: overallHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        agentMonitoring: {
          status: monitoringHealth.healthy ? 'healthy' : 'unhealthy',
          ...monitoringHealth.details
        },
        applicationGateway: {
          status: gatewayHealth.healthy ? 'healthy' : 'unhealthy',
          ...gatewayHealth.details
        }
      },
      registry: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: {
          sequentialNumbering: true,
          flexibleRoles: true,
          experimentalForms: true,
          launchValidation: true,
          performanceMonitoring: true
        }
      }
    }, { status: overallHealthy ? 200 : 503 })
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      registry: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    }, { status: 500 })
  }
}