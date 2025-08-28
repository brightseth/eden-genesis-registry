import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Comprehensive input validation and sanitization utilities
 * Prevents XSS, injection attacks, and malformed data
 */

// Common validation schemas
export const schemas = {
  // Agent handle: 3-20 chars, alphanumeric + underscore
  agentHandle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  
  // Email validation
  email: z.string().email('Invalid email address'),
  
  // URL validation (including optional relative paths)
  url: z.string().url('Invalid URL').optional(),
  
  // Text content with length limits
  shortText: z.string().max(100, 'Text too long (max 100 characters)'),
  mediumText: z.string().max(500, 'Text too long (max 500 characters)'),
  longText: z.string().max(5000, 'Text too long (max 5000 characters)'),
  
  // API key format: eden_<handle>_<hash>
  apiKey: z.string()
    .regex(/^eden_[a-zA-Z0-9_]+_[a-zA-Z0-9]{32,}$/, 'Invalid API key format'),
  
  // File upload validation
  imageFile: z.object({
    type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/i, 'Invalid image type'),
    size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
    name: z.string().max(255, 'Filename too long')
  }),
  
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),
  
  // Pagination parameters
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20)
  })
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'iframe']
  })
}

/**
 * Remove potentially dangerous characters from input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate and sanitize query parameters
 */
export function validateQuery<T>(
  query: Record<string, unknown>,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(query)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { 
        success: false, 
        error: firstError ? `${firstError.path.join('.')}: ${firstError.message}` : 'Validation error'
      }
    }
    return { success: false, error: 'Invalid input' }
  }
}

/**
 * Validate and sanitize request body
 */
export function validateBody<T>(
  body: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(body)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      return { success: false, error: errors.join(', ') }
    }
    return { success: false, error: 'Invalid request body' }
  }
}

/**
 * Check for SQL injection patterns
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /('|(\\')|(;)|(\/\*)|(\*\/)|(\-\-)|(\b(ALTER|CREATE|DELETE|DROP|EXEC|EXECUTE|INSERT|MERGE|SELECT|UPDATE|UNION|SCRIPT)\b)/gi
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Check for NoSQL injection patterns  
 */
export function containsNoSqlInjection(input: string): boolean {
  const patterns = [
    /\$where/gi,
    /\$ne/gi,
    /\$in/gi,
    /\$nin/gi,
    /\$gt/gi,
    /\$gte/gi,
    /\$lt/gi,
    /\$lte/gi,
    /\$regex/gi,
    /\$exists/gi
  ]
  
  return patterns.some(pattern => pattern.test(input))
}

/**
 * Comprehensive input security check
 */
export function isInputSafe(input: string): boolean {
  return !containsSqlInjection(input) && 
         !containsNoSqlInjection(input) &&
         !input.includes('<script>') &&
         !input.includes('javascript:')
}

/**
 * Rate limiting key generator
 */
export function generateRateLimitKey(
  identifier: string, 
  action: string = 'general'
): string {
  return `ratelimit:${action}:${identifier}`
}

/**
 * Validate file uploads
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options
  
  if (file.size > maxSize) {
    return { valid: false, error: `File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)` }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type (allowed: ${allowedTypes.join(', ')})` }
  }
  
  return { valid: true }
}

export default {
  schemas,
  sanitizeHtml,
  sanitizeInput,
  validateQuery,
  validateBody,
  containsSqlInjection,
  containsNoSqlInjection,
  isInputSafe,
  generateRateLimitKey,
  validateFileUpload
}