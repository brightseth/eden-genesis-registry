/**
 * Write Gates System
 * Registry Guardian: Enforce role-based write permissions
 */

import { Role } from '@prisma/client'

export enum WriteOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface WriteContext {
  userId: string
  userRole: Role
  agentId?: string
  operation: WriteOperation
  collection: string
}

export interface WriteGateResult {
  allowed: boolean
  reason?: string
  requiredRole?: Role
  additionalChecks?: string[]
}

/**
 * Core write gate enforcement
 */
export function checkWriteGate(
  collection: string,
  operation: WriteOperation,
  context: WriteContext
): WriteGateResult {
  const rules = WRITE_GATE_RULES[collection]
  
  if (!rules) {
    return {
      allowed: false,
      reason: `No write gates defined for collection: ${collection}`
    }
  }

  const rule = rules[operation]
  if (!rule) {
    return {
      allowed: false,
      reason: `No write rule defined for ${operation} on ${collection}`
    }
  }

  return rule(context)
}

/**
 * Assert write permission (throws if denied)
 */
export function assertWritePermission(
  collection: string,
  operation: WriteOperation,
  context: WriteContext
): void {
  const result = checkWriteGate(collection, operation, context)
  
  if (!result.allowed) {
    throw new Error(`Write access denied: ${result.reason}`)
  }
}

/**
 * Write gate rule definitions
 */
type WriteGateRule = (context: WriteContext) => WriteGateResult

const WRITE_GATE_RULES: Record<string, Partial<Record<WriteOperation, WriteGateRule>>> = {
  // LORE: TRAINER+ can write
  lore: {
    [WriteOperation.CREATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Lore creation requires TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },
    
    [WriteOperation.UPDATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Lore updates require TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },
    
    [WriteOperation.DELETE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.ADMIN)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Lore deletion requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // AGENT STATUS: ADMIN only
  agent_status: {
    [WriteOperation.UPDATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Agent status transitions require ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // AGENT: ADMIN for creation/deletion, TRAINER+ for updates
  agent: {
    [WriteOperation.CREATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Agent creation requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    },

    [WriteOperation.UPDATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Agent updates require TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },

    [WriteOperation.DELETE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Agent deletion requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // PROFILE: TRAINER+ can write
  profile: {
    [WriteOperation.CREATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Profile creation requires TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },

    [WriteOperation.UPDATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Profile updates require TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },

    [WriteOperation.DELETE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.ADMIN)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Profile deletion requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // ECONOMICS: ADMIN only
  economics: {
    [WriteOperation.CREATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Economics data creation requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    },

    [WriteOperation.UPDATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Economics data updates require ADMIN role',
        requiredRole: Role.ADMIN
      }
    },

    [WriteOperation.DELETE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Economics data deletion requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // CAPABILITIES: ADMIN only
  capabilities: {
    [WriteOperation.CREATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Capability configuration requires ADMIN role',
        requiredRole: Role.ADMIN
      }
    },

    [WriteOperation.UPDATE]: (context) => {
      if (context.userRole === Role.ADMIN) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Capability updates require ADMIN role',
        requiredRole: Role.ADMIN
      }
    }
  },

  // PERSONA: TRAINER+ can write
  persona: {
    [WriteOperation.CREATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Persona creation requires TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    },

    [WriteOperation.UPDATE]: (context) => {
      if (hasMinimumRole(context.userRole, Role.TRAINER)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'Persona updates require TRAINER role or higher',
        requiredRole: Role.TRAINER
      }
    }
  }
}

/**
 * Check if user role meets minimum requirement
 */
function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    [Role.GUEST]: 0,
    [Role.TRAINER]: 10,
    [Role.COLLECTOR]: 20,
    [Role.INVESTOR]: 20,
    [Role.CURATOR]: 20,
    [Role.ADMIN]: 100
  }

  return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}

/**
 * Get all write gates for a collection
 */
export function getWriteGates(collection: string): {
  collection: string
  operations: Record<WriteOperation, {
    requiredRole: Role
    description: string
  }>
} {
  const rules = WRITE_GATE_RULES[collection]
  if (!rules) {
    throw new Error(`No write gates defined for collection: ${collection}`)
  }

  const operations: Record<WriteOperation, { requiredRole: Role; description: string }> = {} as any

  // Test each operation with minimum role to determine requirements
  Object.values(WriteOperation).forEach(operation => {
    const rule = rules[operation]
    if (rule) {
      // Test with each role to find minimum required
      const roles = [Role.GUEST, Role.TRAINER, Role.COLLECTOR, Role.INVESTOR, Role.CURATOR, Role.ADMIN]
      
      for (const role of roles) {
        const testContext: WriteContext = {
          userId: 'test',
          userRole: role,
          operation,
          collection
        }
        
        const result = rule(testContext)
        if (result.allowed) {
          operations[operation] = {
            requiredRole: role,
            description: `${operation} operations on ${collection}`
          }
          break
        }
      }
    }
  })

  return { collection, operations }
}

/**
 * Get write gate summary for all collections
 */
export function getWriteGatesSummary(): Record<string, ReturnType<typeof getWriteGates>> {
  const collections = Object.keys(WRITE_GATE_RULES)
  
  return collections.reduce((acc, collection) => {
    try {
      acc[collection] = getWriteGates(collection)
    } catch (error) {
      console.warn(`Failed to get write gates for ${collection}:`, error)
    }
    return acc
  }, {} as Record<string, ReturnType<typeof getWriteGates>>)
}