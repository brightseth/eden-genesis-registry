/**
 * CEO Dashboard Access Middleware
 * Authentication and feature flag validation for executive interface
 */

import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { isCEODashboardEnabled, checkCEODashboardAccess } from '../../config/ceo-dashboard-flags'

interface JWTPayload {
  userId: string
  role: string
  exp: number
}

export async function ceoDashboardMiddleware(request: NextRequest) {
  // Check if CEO dashboard is globally enabled
  if (!isCEODashboardEnabled()) {
    return NextResponse.json(
      { error: 'CEO Dashboard not available', code: 'FEATURE_DISABLED' },
      { status: 403 }
    )
  }

  // Extract and validate JWT token
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required for CEO dashboard', code: 'AUTH_REQUIRED' },
      { status: 401 }
    )
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }

    const payload = verify(token, secret) as JWTPayload

    // Require ADMIN role for CEO dashboard
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'CEO Dashboard requires ADMIN role', code: 'INSUFFICIENT_ROLE' },
        { status: 403 }
      )
    }

    // Check feature flag rollout for this specific user
    if (!checkCEODashboardAccess(payload.userId)) {
      return NextResponse.json(
        { error: 'CEO Dashboard not available in your rollout group', code: 'ROLLOUT_RESTRICTED' },
        { status: 403 }
      )
    }

    // Add user context to request headers for logging
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.userId)
    response.headers.set('x-user-role', payload.role)
    response.headers.set('x-ceo-dashboard-access', 'granted')

    return response

  } catch (error) {
    console.error('CEO dashboard auth error:', error)
    return NextResponse.json(
      { error: 'Invalid authentication token', code: 'AUTH_INVALID' },
      { status: 401 }
    )
  }
}

/**
 * Middleware for CEO dashboard API routes
 */
export function withCEOAccess(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const accessCheck = await ceoDashboardMiddleware(request)
    
    if (accessCheck.status !== 200) {
      return accessCheck
    }

    // Proceed with the original handler
    return handler(request, context)
  }
}