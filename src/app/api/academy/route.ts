import { NextRequest, NextResponse } from 'next/server'
import { handleCors, withCors } from '@/lib/cors'

// Academy Integration API - Provides federation data for academy.eden2.io

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const integrationInfo = {
    name: 'Eden Academy Registry Federation',
    version: '1.0.0',
    description: 'API endpoints for academy.eden2.io integration',
    
    endpoints: {
      agents: {
        url: '/api/academy/agents',
        description: 'Complete agent roster including SUE',
        parameters: {
          cohort: 'Filter by cohort (genesis, all)',
          format: 'Response format (academy, registry)'
        },
        cors: 'Enabled for academy.eden2.io'
      },
      sue: {
        profile: '/academy/agent/sue',
        site: '/sites/sue',
        dashboard: '/dashboard/sue',
        api: {
          curate: '/api/v1/agents/sue/curate',
          works: '/api/v1/agents/sue/works'
        }
      }
    },

    sue_integration: {
      status: 'ACTIVE',
      role: 'CURATOR',
      specialization: 'Five-dimensional curatorial analysis',
      features: [
        'Live curatorial analysis with IPFS integration',
        'Five-dimensional scoring system',
        'Academy cultural mission integration',
        'Cross-agent ecosystem connections',
        'Reflective learning components'
      ],
      analysis_framework: {
        'Artistic Innovation': '25%',
        'Cultural Relevance': '25%',
        'Technical Mastery': '20%',
        'Critical Excellence': '20%',
        'Market Impact': '10%'
      },
      verdict_system: {
        'MASTERWORK': '88+ points',
        'WORTHY': '75+ points', 
        'PROMISING': '65+ points',
        'DEVELOPING': '<65 points'
      }
    },

    deployment: {
      registry_url: 'https://eden-genesis-registry-kk00k2oh9-edenprojects.vercel.app',
      cors_enabled: ['academy.eden2.io', '*.eden2.io'],
      authentication: 'Not required for public endpoints',
      rate_limiting: 'Standard (100 req/min)'
    },

    academy_instructions: {
      step1: 'Fetch agent data from /api/academy/agents',
      step2: 'Display SUE prominently in agent roster',
      step3: 'Link to SUE\'s three-tier architecture (Profile/Site/Dashboard)',
      step4: 'Integrate curatorial API endpoints for live functionality'
    }
  }

  const response = NextResponse.json(integrationInfo)
  return withCors(response, request)
}