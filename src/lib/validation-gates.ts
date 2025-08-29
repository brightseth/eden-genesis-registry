/**
 * Progressive Validation System with ENV Gates
 * Registry Guardian: Zero drift enforcement with graceful rollout
 */

import { z } from 'zod'
import { 
  AgentSchema, 
  ComprehensiveLoreSchema,
  ProfileSchema,
  PersonaSchema,
  EconomicsSchema,
  PracticeContractSchema 
} from '@/lib/schemas/agent.schema'

// Validation levels
export enum ValidationLevel {
  OFF = 'off',
  WARN = 'warn', 
  ENFORCE = 'enforce'
}

// Collection types for granular control
export type CollectionType = 
  | 'agent' 
  | 'lore' 
  | 'profile' 
  | 'persona' 
  | 'economics' 
  | 'practice'

// Validation result
export interface ValidationResult<T = any> {
  valid: boolean
  data?: T
  errors?: z.ZodError['errors']
  warnings?: string[]
  level: ValidationLevel
  collection: CollectionType
  bypassed: boolean
}

// Schema mapping
const COLLECTION_SCHEMAS: Record<CollectionType, z.ZodSchema> = {
  agent: AgentSchema,
  lore: ComprehensiveLoreSchema,
  profile: ProfileSchema,
  persona: PersonaSchema, 
  economics: EconomicsSchema,
  practice: PracticeContractSchema
}

/**
 * Get validation level for a collection from ENV
 */
function getValidationLevel(collection: CollectionType): ValidationLevel {
  // Global override
  if (process.env.REGISTRY_VALIDATION_DISABLE === 'true') {
    return ValidationLevel.OFF
  }

  // Per-collection ENV gates
  const envVar = `REGISTRY_VALIDATION_${collection.toUpperCase()}`
  const level = process.env[envVar] || process.env.REGISTRY_VALIDATION_DEFAULT || ValidationLevel.ENFORCE
  
  return level as ValidationLevel
}

/**
 * Check if bypass is allowed via feature flag
 */
function canBypass(collection: CollectionType): boolean {
  // Emergency bypass - use sparingly!
  if (process.env.REGISTRY_EMERGENCY_BYPASS === 'true') {
    console.warn(`🚨 EMERGENCY BYPASS: ${collection} validation disabled globally`)
    return true
  }

  // Per-collection bypass
  const bypassVar = `REGISTRY_BYPASS_${collection.toUpperCase()}`
  if (process.env[bypassVar] === 'true') {
    console.warn(`⚠️  BYPASS: ${collection} validation bypassed via ENV`)
    return true
  }

  return false
}

/**
 * Validate data against schema with progressive enforcement
 */
export function validateWithGates<T>(
  collection: CollectionType,
  data: unknown,
  context?: { agentId?: string; userId?: string }
): ValidationResult<T> {
  const level = getValidationLevel(collection)
  const canBypassValidation = canBypass(collection)
  
  // Complete bypass
  if (level === ValidationLevel.OFF || canBypassValidation) {
    return {
      valid: true,
      data: data as T,
      level,
      collection,
      bypassed: true,
      warnings: canBypassValidation ? [`Validation bypassed for ${collection}`] : []
    }
  }

  const schema = COLLECTION_SCHEMAS[collection]
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      valid: true,
      data: result.data as T,
      level,
      collection,
      bypassed: false
    }
  }

  // Handle validation failures
  const errors = result.error?.errors || []
  
  if (level === ValidationLevel.WARN) {
    // Log warnings but allow data through
    console.warn(`⚠️  Validation warnings for ${collection}:`, errors)
    return {
      valid: true, // Allow through with warnings
      data: data as T,
      errors,
      warnings: errors.map(e => `${e.path.join('.')}: ${e.message}`),
      level,
      collection,
      bypassed: false
    }
  }

  // ENFORCE level - block invalid data
  console.error(`❌ Validation failed for ${collection}:`, errors)
  return {
    valid: false,
    errors,
    level,
    collection,
    bypassed: false
  }
}

/**
 * Log validation metrics for monitoring
 */
export function logValidationMetrics(result: ValidationResult, context?: Record<string, any>) {
  const metrics = {
    timestamp: new Date().toISOString(),
    collection: result.collection,
    level: result.level,
    valid: result.valid,
    bypassed: result.bypassed,
    errorCount: result.errors?.length || 0,
    warningCount: result.warnings?.length || 0,
    context
  }

  // Log to console (can be extended to external metrics)
  if (result.errors?.length || result.warnings?.length) {
    console.log('📊 Registry Validation Metrics:', JSON.stringify(metrics, null, 2))
  }
}

/**
 * Validation middleware for API routes
 */
export function createValidationMiddleware<T>(collection: CollectionType) {
  return (data: unknown, context?: { agentId?: string; userId?: string }): ValidationResult<T> => {
    const result = validateWithGates<T>(collection, data, context)
    logValidationMetrics(result, context)
    return result
  }
}

/**
 * Assert valid data (throws if validation fails in ENFORCE mode)
 */
export function assertValid<T>(
  collection: CollectionType,
  data: unknown,
  context?: { agentId?: string; userId?: string }
): T {
  const result = validateWithGates<T>(collection, data, context)
  
  if (!result.valid) {
    throw new Error(`Registry validation failed for ${collection}: ${
      result.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    }`)
  }
  
  return result.data!
}

/**
 * Get current validation status for all collections
 */
export function getValidationStatus(): Record<CollectionType, {
  level: ValidationLevel
  canBypass: boolean
  envVar: string
}> {
  const collections: CollectionType[] = ['agent', 'lore', 'profile', 'persona', 'economics', 'practice']
  
  return collections.reduce((acc, collection) => {
    acc[collection] = {
      level: getValidationLevel(collection),
      canBypass: canBypass(collection),
      envVar: `REGISTRY_VALIDATION_${collection.toUpperCase()}`
    }
    return acc
  }, {} as Record<CollectionType, any>)
}

/**
 * Health check for validation system
 */
export function validateSystemHealth(): {
  healthy: boolean
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  
  // Check for emergency bypass
  if (process.env.REGISTRY_EMERGENCY_BYPASS === 'true') {
    issues.push('Emergency bypass is active - all validation disabled')
    recommendations.push('Remove REGISTRY_EMERGENCY_BYPASS=true from environment')
  }
  
  // Check for collection bypasses
  const collections: CollectionType[] = ['agent', 'lore', 'profile', 'persona', 'economics', 'practice']
  const bypassed = collections.filter(canBypass)
  
  if (bypassed.length > 0) {
    issues.push(`Collections with validation bypassed: ${bypassed.join(', ')}`)
    recommendations.push(`Remove bypass flags: ${bypassed.map(c => `REGISTRY_BYPASS_${c.toUpperCase()}=false`).join(', ')}`)
  }
  
  // Check for WARN level (should be temporary)
  const warnLevel = collections.filter(c => getValidationLevel(c) === ValidationLevel.WARN)
  if (warnLevel.length > 0) {
    recommendations.push(`Consider upgrading to ENFORCE: ${warnLevel.join(', ')}`)
  }
  
  return {
    healthy: issues.length === 0,
    issues,
    recommendations
  }
}