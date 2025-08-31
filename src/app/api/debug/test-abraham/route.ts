import { NextRequest, NextResponse } from 'next/server'
import { RegistryFallbackManager } from '@/lib/registry-fallback'

export async function GET(request: NextRequest) {
  const result = await RegistryFallbackManager.fetchAgent('abraham')
  
  return NextResponse.json({
    success: !!result.data,
    source: result.source,
    error: result.error,
    hasData: !!result.data,
    agentHandle: result.data?.handle,
    agentName: result.data?.displayName,
    agentStatus: result.data?.status,
    profileStatement: result.data?.profile?.statement,
    timestamp: new Date().toISOString()
  })
}