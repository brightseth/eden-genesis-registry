import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const envInfo = {
    registryBaseUrl: process.env.NEXT_PUBLIC_REGISTRY_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    vercelEnvironment: process.env.VERCEL_ENV,
    hasLocalEnv: !!process.env.DATABASE_URL,
    currentUrl: request.url,
    headers: {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(envInfo)
}