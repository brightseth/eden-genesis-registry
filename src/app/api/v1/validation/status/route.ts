/**
 * Validation Status API
 * Registry Guardian: Monitor schema validation health and configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { getValidationStatus, validateSystemHealth } from '@/lib/validation-gates'
import { handleCors } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/v1/validation/status - Check validation system status
export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const status = getValidationStatus()
    const health = validateSystemHealth()

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      validation: {
        collections: status,
        health: health
      },
      environment: {
        registryValidationDefault: process.env.REGISTRY_VALIDATION_DEFAULT || 'enforce',
        emergencyBypass: process.env.REGISTRY_EMERGENCY_BYPASS === 'true',
        globalDisable: process.env.REGISTRY_VALIDATION_DISABLE === 'true'
      }
    })
  } catch (error) {
    console.error('Validation status check failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve validation status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}