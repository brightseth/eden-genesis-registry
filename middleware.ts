import { NextRequest, NextResponse } from 'next/server'
import { handleCors, withCors } from '@/lib/cors'

// Production security headers
function getSecurityHeaders(request: NextRequest) {
  const headers = new Headers()
  
  // Content Security Policy - restrictive but allows Eden ecosystem
  const nonce = Math.random().toString(36).substring(2, 15)
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "connect-src 'self' https: wss: https://*.vercel.app https://*.eden2.io",
    "frame-src 'self' https://*.vercel.app",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  headers.set('Content-Security-Policy', csp)
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'SAMEORIGIN')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return headers
}

// Simple rate limiting using memory (in production, use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function rateLimit(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  
  // Different limits for different endpoints
  const pathname = new URL(request.url).pathname
  let limit = 60 // default: 60 requests per minute
  
  if (pathname.startsWith('/api/v1/chat')) {
    limit = 10 // Chat endpoints: 10 per minute
  } else if (pathname.startsWith('/api/v1/admin')) {
    limit = 50 // Admin endpoints: 50 per minute
  } else if (pathname.startsWith('/api/v1/webhooks')) {
    limit = 1000 // Webhooks: 1000 per minute
  }
  
  const key = `${ip}:${pathname.split('/')[1]}`
  const record = rateLimitMap.get(key)
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(request)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests from this IP' 
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }
  }
  
  // Create response and apply security headers
  const response = NextResponse.next()
  
  // Apply security headers
  const securityHeaders = getSecurityHeaders(request)
  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value)
  })
  
  // Apply CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    return withCors(response, request)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}