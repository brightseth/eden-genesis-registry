import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Role } from '@prisma/client'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: Role
  }
}

export async function withAuth(
  request: NextRequest,
  requiredRole?: Role | Role[]
): Promise<{ user: { userId: string; email: string; role: Role } } | NextResponse> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authorization required' },
      { status: 401 }
    )
  }

  try {
    const user = verifyToken(token)
    
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }
    
    return { user }
  } catch {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

export function requireAuth(roles?: Role | Role[]) {
  return async (request: NextRequest) => {
    const result = await withAuth(request, roles)
    if (result instanceof NextResponse) {
      return result
    }
    return result.user
  }
}