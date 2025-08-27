// Application Gateway Pattern - Unified routing for all application types
// Routes external applications through Registry with proper validation and processing

export interface ApplicationGatewayRequest {
  applicantEmail: string
  applicantName: string
  track: string
  payload: Record<string, unknown>
  source?: string
  experimental?: boolean
}

export interface ApplicationGatewayResponse {
  success: boolean
  applicationId: string
  message: string
  experimental?: boolean
  validationErrors?: string[]
  recommendedEndpoint?: string
}

export class ApplicationGateway {
  /**
   * Main entry point for all applications - routes to appropriate processor
   */
  static async processApplication(
    request: ApplicationGatewayRequest
  ): Promise<ApplicationGatewayResponse> {
    // Determine application type and routing
    const routing = this.determineRouting(request)
    
    try {
      switch (routing.type) {
        case 'standard':
          return await this.processStandardApplication(request, routing)
        case 'experimental':
          return await this.processExperimentalApplication(request, routing)
        case 'agent-specific':
          return await this.processAgentSpecificApplication(request, routing)
        default:
          throw new Error(`Unknown application type: ${routing.type}`)
      }
    } catch (error) {
      console.error('Application Gateway error:', error)
      return {
        success: false,
        applicationId: '',
        message: 'Failed to process application',
        validationErrors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Determine routing based on request characteristics
   */
  private static determineRouting(request: ApplicationGatewayRequest) {
    // Check for experimental markers
    if (request.experimental || 
        request.source?.includes('experimental') ||
        request.source?.includes('interview') ||
        request.source?.includes('bertha')) {
      return {
        type: 'experimental' as const,
        endpoint: '/api/v1/applications/experimental',
        validation: 'relaxed'
      }
    }

    // Check for agent-specific forms
    if (request.source?.includes('sites/') || 
        request.payload.agentHandle ||
        request.payload.targetAgent) {
      return {
        type: 'agent-specific' as const,
        endpoint: '/api/v1/applications/experimental', // Route through experimental for now
        validation: 'flexible'
      }
    }

    // Default to standard processing
    return {
      type: 'standard' as const,
      endpoint: '/api/v1/applications',
      validation: 'strict'
    }
  }

  /**
   * Process standard applications with strict validation
   */
  private static async processStandardApplication(
    request: ApplicationGatewayRequest,
    routing: any
  ): Promise<ApplicationGatewayResponse> {
    const { prisma } = await import('@/lib/db')
    const { strictApplicationSchema } = await import('@/lib/validations')
    const { logApiEvent } = await import('@/lib/audit')
    
    // Strict validation
    const validation = strictApplicationSchema.safeParse(request)
    
    if (!validation.success) {
      return {
        success: false,
        applicationId: '',
        message: 'Validation failed',
        validationErrors: validation.error.errors.map(e => e.message),
        recommendedEndpoint: '/api/v1/applications/experimental'
      }
    }

    // Create standard application
    const application = await prisma.application.create({
      data: {
        ...validation.data,
        status: 'DRAFT'
      }
    })

    // Log event
    await logApiEvent('create', 'application', application.id, application)

    return {
      success: true,
      applicationId: application.id,
      message: 'Standard application created successfully'
    }
  }

  /**
   * Process experimental applications with flexible validation
   */
  private static async processExperimentalApplication(
    request: ApplicationGatewayRequest,
    routing: any
  ): Promise<ApplicationGatewayResponse> {
    const { prisma } = await import('@/lib/db')
    const { logApiEvent } = await import('@/lib/audit')
    
    // Basic validation only
    if (!request.applicantEmail || !request.applicantName) {
      return {
        success: false,
        applicationId: '',
        message: 'Missing required fields: applicantEmail, applicantName'
      }
    }

    // Determine track with fallbacks
    let track = 'TRAINER' // Default for experimental
    const validTracks = ['AGENT', 'TRAINER', 'CURATOR', 'COLLECTOR', 'INVESTOR']
    if (request.track && validTracks.includes(request.track.toUpperCase())) {
      track = request.track.toUpperCase()
    }

    // Create experimental application
    const application = await prisma.application.create({
      data: {
        applicantEmail: request.applicantEmail,
        applicantName: request.applicantName,
        track: track as any,
        payload: {
          ...request.payload,
          experimental: true,
          source: request.source || 'experimental-gateway',
          timestamp: new Date().toISOString(),
          gatewayProcessed: true
        },
        status: 'SUBMITTED' // Experimental goes straight to review
      }
    })

    // Log experimental application
    await logApiEvent('create', 'application', application.id, {
      ...application,
      type: 'experimental',
      gateway: true
    })

    return {
      success: true,
      applicationId: application.id,
      message: 'Experimental application submitted successfully',
      experimental: true
    }
  }

  /**
   * Process agent-specific applications (routed through experimental for now)
   */
  private static async processAgentSpecificApplication(
    request: ApplicationGatewayRequest,
    routing: any
  ): Promise<ApplicationGatewayResponse> {
    // Extract agent information
    const agentHandle = request.payload.agentHandle || 
                       request.payload.targetAgent ||
                       this.extractAgentFromSource(request.source)

    // Add agent-specific metadata
    const enrichedRequest = {
      ...request,
      payload: {
        ...request.payload,
        agentSpecific: true,
        targetAgent: agentHandle,
        type: 'agent-specific-application'
      },
      experimental: true // Agent-specific forms are experimental by default
    }

    // Process through experimental pipeline
    return await this.processExperimentalApplication(enrichedRequest, routing)
  }

  /**
   * Extract agent handle from source URL
   */
  private static extractAgentFromSource(source?: string): string | undefined {
    if (!source) return undefined
    
    // Pattern: /sites/{agent}/interview
    const match = source.match(/\/sites\/([^\/]+)\//)
    return match ? match[1] : undefined
  }

  /**
   * Health check for gateway functionality
   */
  static async healthCheck(): Promise<{ healthy: boolean; details: Record<string, unknown> }> {
    try {
      const { prisma } = await import('@/lib/db')
      
      // Test database connectivity
      await prisma.$queryRaw`SELECT 1`
      
      // Check recent application counts
      const recentCount = await prisma.application.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })

      return {
        healthy: true,
        details: {
          database: 'connected',
          recentApplications: recentCount,
          timestamp: new Date().toISOString(),
          endpoints: {
            standard: '/api/v1/applications',
            experimental: '/api/v1/applications/experimental',
            gateway: 'integrated'
          }
        }
      }
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    }
  }
}