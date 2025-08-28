import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getConsistencyMonitor } from '@/lib/consistency-monitor'
import { withAuth } from '@/middleware/auth'

// GET /api/v1/consistency - Get consistency monitoring status
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  // Only admins can access consistency monitoring
  if (authResult.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }
  
  try {
    const monitor = getConsistencyMonitor(prisma)
    const status = await monitor.getStatus()
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Failed to get consistency status:', error)
    return NextResponse.json(
      { error: 'Failed to get consistency status' },
      { status: 500 }
    )
  }
}

// POST /api/v1/consistency/run - Run consistency checks
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  // Only admins can run consistency checks
  if (authResult.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json().catch(() => ({}))
    const { checkName } = body
    
    const monitor = getConsistencyMonitor(prisma)
    
    let result
    if (checkName) {
      // Run specific check
      result = await monitor.runCheck(checkName)
    } else {
      // Run all checks
      result = await monitor.runAllChecks()
    }
    
    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Failed to run consistency checks:', error)
    return NextResponse.json(
      { error: 'Failed to run consistency checks' },
      { status: 500 }
    )
  }
}