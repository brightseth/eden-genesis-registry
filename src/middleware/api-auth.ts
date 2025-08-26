// API Key authentication middleware for agents
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export interface AgentAuth {
  agent: Record<string, unknown>
  apiKey: string
}

/**
 * Validates API key from X-Eden-Api-Key header
 * Returns agent if valid, error response if not
 */
export async function withAgentAuth(
  request: NextRequest
): Promise<AgentAuth | NextResponse> {
  const apiKey = request.headers.get('X-Eden-Api-Key')
  
  if (!apiKey) {
    // Also check Authorization header for Bearer token format
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer eden_')) {
      return NextResponse.json(
        { error: 'API key required. Use X-Eden-Api-Key header or Authorization: Bearer eden_...' },
        { status: 401 }
      )
    }
  }

  const keyToValidate = apiKey || request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!keyToValidate?.startsWith('eden_')) {
    return NextResponse.json(
      { error: 'Invalid API key format' },
      { status: 401 }
    )
  }

  try {
    // Extract agent handle from key format: eden_<handle>_<hash>
    const parts = keyToValidate.split('_')
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      )
    }

    const handle = parts[1]

    // Find agent with this handle and validate the key
    const agent = await prisma.agent.findFirst({
      where: { handle },
      include: {
        profile: true,
        cohort: true
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Check if the API key matches (stored in metadata)
    const storedKey = (agent.metadata as Record<string, unknown>)?.apiKey
    if (storedKey !== keyToValidate) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Check if agent is active
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: `Agent is not active (status: ${agent.status})` },
        { status: 403 }
      )
    }

    return { agent, apiKey: keyToValidate }
  } catch (error) {
    console.error('API auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

/**
 * Optional auth - returns agent if API key provided, null otherwise
 */
export async function withOptionalAgentAuth(
  request: NextRequest
): Promise<{ agent?: Record<string, unknown>, apiKey?: string }> {
  const apiKey = request.headers.get('X-Eden-Api-Key') || 
                 request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!apiKey || !apiKey.startsWith('eden_')) {
    return {}
  }

  const result = await withAgentAuth(request)
  if ('agent' in result) {
    return result
  }
  
  return {}
}