import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  // New eden2.io domains (primary)
  'https://registry.eden2.io',
  'https://academy.eden2.io',
  'https://studio.eden2.io',
  'https://curator.eden2.io',
  'https://collector.eden2.io',
  // Legacy domains (maintain during transition)
  'https://eden.art',
  'https://academy.eden.art',
  'https://studio.eden.art',
  'https://curator.eden.art',
  'https://collector.eden.art',
  // Current Vercel deployments (maintain during transition)
  'https://eden-genesis-registry.vercel.app',
  'https://eden-academy-flame.vercel.app',
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
]

export function corsHeaders(origin: string | null) {
  const headers = new Headers()
  
  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Credentials', 'true')
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow any localhost origin
    headers.set('Access-Control-Allow-Origin', origin || '*')
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Eden-Api-Key, X-Eden-Signature, Access-Control-Request-Headers')
  headers.set('Access-Control-Max-Age', '86400') // 24 hours
  headers.set('Vary', 'Origin')
  
  return headers
}

export function handleCors(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin')
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin)
    })
  }
  
  return null
}

export function withCors(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin')
  const corsHeadersObj = corsHeaders(origin)
  
  // Apply CORS headers to the response
  corsHeadersObj.forEach((value, key) => {
    response.headers.set(key, value)
  })
  
  return response
}