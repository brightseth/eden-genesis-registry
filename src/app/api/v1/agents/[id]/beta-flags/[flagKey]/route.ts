import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Mock beta flags store (same as parent route)
const mockBetaFlags: Record<string, any[]> = {}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; flagKey: string } }
) {
  try {
    // Authenticate request
    const user = await auth(request)
    if (!user || (user.role !== 'trainer' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: agentHandle, flagKey } = params
    const body = await request.json()
    const { enabled, rolloutPercentage } = body

    // Find and update the flag
    if (mockBetaFlags[agentHandle]) {
      const flagIndex = mockBetaFlags[agentHandle].findIndex(f => f.key === flagKey)
      
      if (flagIndex !== -1) {
        mockBetaFlags[agentHandle][flagIndex] = {
          ...mockBetaFlags[agentHandle][flagIndex],
          enabled: enabled !== undefined ? enabled : mockBetaFlags[agentHandle][flagIndex].enabled,
          rolloutPercentage: rolloutPercentage !== undefined ? rolloutPercentage : mockBetaFlags[agentHandle][flagIndex].rolloutPercentage,
        }

        console.log(`Updated beta flag ${flagKey} for ${agentHandle}:`, {
          enabled: mockBetaFlags[agentHandle][flagIndex].enabled,
          rolloutPercentage: mockBetaFlags[agentHandle][flagIndex].rolloutPercentage
        })

        return NextResponse.json({ 
          success: true,
          flag: mockBetaFlags[agentHandle][flagIndex]
        })
      }
    }

    return NextResponse.json(
      { error: 'Feature flag not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Failed to update beta flag:', error)
    return NextResponse.json(
      { error: 'Failed to update feature flag' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; flagKey: string } }
) {
  try {
    // Authenticate request
    const user = await auth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const { id: agentHandle, flagKey } = params

    if (mockBetaFlags[agentHandle]) {
      const flagIndex = mockBetaFlags[agentHandle].findIndex(f => f.key === flagKey)
      
      if (flagIndex !== -1) {
        const deletedFlag = mockBetaFlags[agentHandle].splice(flagIndex, 1)[0]
        
        console.log(`Deleted beta flag ${flagKey} for ${agentHandle}`)

        return NextResponse.json({ 
          success: true,
          deletedFlag
        })
      }
    }

    return NextResponse.json(
      { error: 'Feature flag not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Failed to delete beta flag:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature flag' },
      { status: 500 }
    )
  }
}