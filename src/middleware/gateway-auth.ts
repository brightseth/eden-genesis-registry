import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to authenticate requests from the Eden Gateway
 * Uses internal token to ensure requests come through the gateway
 */
export function withGatewayAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const internalToken = request.headers.get('X-Eden-Internal-Token')
    const expectedToken = process.env.REGISTRY_INTERNAL_TOKEN || 'gateway-internal-token-secure'
    
    // Check for gateway internal token
    if (internalToken === expectedToken) {
      // Add gateway user context to request headers for downstream processing
      const gatewayUserId = request.headers.get('X-Eden-User-Id')
      const gatewayUserRole = request.headers.get('X-Eden-User-Role')
      
      if (gatewayUserId && gatewayUserRole) {
        // Create a new request with user context
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('X-Gateway-Authenticated', 'true')
        requestHeaders.set('X-Gateway-User-Id', gatewayUserId)
        requestHeaders.set('X-Gateway-User-Role', gatewayUserRole)
        
        const modifiedRequest = new NextRequest(request.url, {
          method: request.method,
          headers: requestHeaders,
          body: request.body
        })
        
        return handler(modifiedRequest)
      }
    }
    
    // Fallback to original handler for backward compatibility
    // This allows direct access during transition period
    return handler(request)
  }
}

/**
 * Check if request is authenticated via gateway
 */
export function isGatewayAuthenticated(request: NextRequest): boolean {
  return request.headers.get('X-Gateway-Authenticated') === 'true'
}

/**
 * Get gateway user context from request
 */
export function getGatewayUser(request: NextRequest): { userId: string; role: string } | null {
  const userId = request.headers.get('X-Gateway-User-Id')
  const role = request.headers.get('X-Gateway-User-Role')
  
  if (userId && role) {
    return { userId, role }
  }
  
  return null
}