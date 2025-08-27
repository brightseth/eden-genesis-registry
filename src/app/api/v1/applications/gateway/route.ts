import { NextRequest, NextResponse } from 'next/server'
import { ApplicationGateway } from '@/lib/application-gateway'
import { handleCors, withCors } from '@/lib/cors'

// OPTIONS /api/v1/applications/gateway
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// POST /api/v1/applications/gateway
// Unified entry point for all application types
export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const body = await request.json()
    
    // Process through Gateway
    const result = await ApplicationGateway.processApplication(body)
    
    if (result.success) {
      const response = NextResponse.json(result, { status: 201 })
      return withCors(response, request)
    } else {
      const response = NextResponse.json(result, { status: 400 })
      return withCors(response, request)
    }
  } catch (error) {
    console.error('Gateway processing error:', error)
    
    const response = NextResponse.json({
      success: false,
      applicationId: '',
      message: 'Gateway processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
    return withCors(response, request)
  }
}

// GET /api/v1/applications/gateway/health
// Health check endpoint for Gateway
export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const health = await ApplicationGateway.healthCheck()
    
    const status = health.healthy ? 200 : 503
    const response = NextResponse.json({
      status: health.healthy ? 'healthy' : 'unhealthy',
      ...health.details,
      gateway: 'application-gateway',
      version: '1.0.0'
    }, { status })
    
    return withCors(response, request)
  } catch (error) {
    console.error('Gateway health check error:', error)
    
    const response = NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      gateway: 'application-gateway',
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
    return withCors(response, request)
  }
}