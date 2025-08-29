import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * GET /api/v1/docs/contracts
 * Serve auto-generated API contracts documentation
 */
export async function GET(request: NextRequest) {
  try {
    // Read the generated contracts.md file
    const contractsPath = join(process.cwd(), 'docs', 'contracts.md')
    const contractsContent = readFileSync(contractsPath, 'utf-8')
    
    // Return as JSON with metadata
    const response = {
      title: 'Eden Registry API Contracts',
      description: 'Auto-generated API documentation from OpenAPI specification',
      format: 'markdown',
      content: contractsContent,
      lastUpdated: new Date().toISOString(),
      source: 'openapi.yaml'
    }
    
    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      }
    })
  } catch (error) {
    console.error('Failed to serve contracts documentation:', error)
    return NextResponse.json(
      { error: 'Failed to load contracts documentation' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/docs/contracts
 * Regenerate contracts documentation from OpenAPI
 */
export async function POST(request: NextRequest) {
  try {
    // Import and run the generation script
    const { generateContractsDoc } = await import('../../../../../scripts/generate-docs-from-openapi')
    const success = generateContractsDoc()
    
    if (success) {
      return NextResponse.json(
        { message: 'Contracts documentation regenerated successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to regenerate contracts documentation' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to regenerate contracts documentation:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate contracts documentation' },
      { status: 500 }
    )
  }
}