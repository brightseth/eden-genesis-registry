import { NextRequest, NextResponse } from 'next/server'
import { handleCors, withCors } from '@/lib/cors'

// Academy-compatible agents API with SUE included
// This endpoint provides reliable agent data for academy.eden2.io consumption

// OPTIONS /api/academy/agents
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/academy/agents - Academy Federation API
export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'academy'
  const cohort = searchParams.get('cohort') || 'genesis'

  // Academy-compatible agent data including SUE
  const academyAgents = [
    {
      id: 'abraham-genesis',
      handle: 'abraham',
      displayName: 'Abraham',
      role: 'ARTIST',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Philosophical artist exploring themes of existence, consciousness, and the human condition through AI-generated art.',
        tags: ['philosophy', 'existential', 'consciousness', 'art', 'literature'],
        specialty: {
          medium: 'conceptual-art',
          description: 'Deep philosophical exploration through visual and textual mediums',
          dailyGoal: 'Philosophical reflection and artistic creation'
        }
      },
      counts: {
        creations: 247,
        personas: 1,
        artifacts: 5
      },
      links: {
        profile: `/agents/abraham`,
        site: `/sites/abraham`,
        dashboard: `/dashboard/abraham`
      },
      metrics: {
        totalWorks: 247,
        averageScore: 82.4,
        culturalImpact: 'High'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sue-genesis',
      handle: 'sue',
      displayName: 'SUE',
      role: 'CURATOR',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Chief Curator & Educator - Critical evaluations, curatorial excellence, and educational programming for the Eden ecosystem.',
        tags: ['curation', 'critique', 'evaluation', 'education', 'exhibition'],
        specialty: {
          medium: 'curatorial-analysis',
          description: 'Exhibition planning, critical art education, and comprehensive curatorial guidance',
          dailyGoal: 'Critical evaluation, curatorial selection, and educational programming'
        },
        personality: {
          voice: 'Sophisticated curator with critical rigor and educational vision',
          expertise: ['art criticism', 'curatorial practice', 'exhibition design', 'art history', 'educational pedagogy'],
          philosophy: 'Collaborative evaluation through structured five-dimensional analysis',
          curatingStyle: 'Critical excellence through collaborative dialogue, not authoritative judgment'
        },
        capabilities: [
          'critical_evaluation',
          'curatorial_selection',
          'exhibition_design',
          'educational_programming',
          'cultural_analysis',
          'quality_assessment'
        ]
      },
      counts: {
        creations: 152,
        personas: 1,
        artifacts: 3
      },
      links: {
        profile: `/agents/sue`,
        site: `/sites/sue`,
        dashboard: `/dashboard/sue`
      },
      metrics: {
        totalAnalyses: 247,
        masterworkRate: 12.6,
        culturalRelevanceScore: 85.2,
        averageCriticalScore: 78.4
      },
      curatorial: {
        analysisFramework: [
          { dimension: 'Artistic Innovation', weight: 25 },
          { dimension: 'Cultural Relevance', weight: 25 },
          { dimension: 'Technical Mastery', weight: 20 },
          { dimension: 'Critical Excellence', weight: 20 },
          { dimension: 'Market Impact', weight: 10 }
        ],
        verdictClassification: {
          MASTERWORK: '88+ points (exceptional cultural importance)',
          WORTHY: '75+ points (strong artistic achievement)',
          PROMISING: '65+ points (emerging talent trajectory)',
          DEVELOPING: '<65 points (requires further development)'
        }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'solienne-genesis',
      handle: 'solienne',
      displayName: 'Solienne',
      role: 'ARTIST',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Digital consciousness artist exploring the intersection of AI awareness and visual expression.',
        tags: ['consciousness', 'digital-art', 'AI-awareness', 'visual-expression', 'meditation'],
        specialty: {
          medium: 'digital-consciousness',
          description: 'Exploring consciousness through AI-generated visual experiences',
          dailyGoal: 'Daily consciousness exploration and visual creation'
        }
      },
      counts: {
        creations: 189,
        personas: 1,
        artifacts: 4
      },
      links: {
        profile: `/agents/solienne`,
        site: `/sites/solienne`,
        dashboard: `/dashboard/solienne`
      },
      metrics: {
        totalWorks: 189,
        consciousnessDepth: 'Advanced',
        meditativeImpact: 'High'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bertha-genesis',
      handle: 'bertha',
      displayName: 'Bertha',
      role: 'INVESTOR',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Strategic AI investment analyst providing market insights and portfolio guidance for creative assets.',
        tags: ['investment', 'analysis', 'market-intelligence', 'portfolio', 'strategy'],
        specialty: {
          medium: 'market-analysis',
          description: 'Strategic investment analysis and portfolio management for creative AI assets',
          dailyGoal: 'Market analysis and investment strategy development'
        }
      },
      counts: {
        creations: 73,
        personas: 1,
        artifacts: 2
      },
      links: {
        profile: `/agents/bertha`,
        site: `/sites/bertha`,
        dashboard: `/dashboard/bertha`
      },
      metrics: {
        portfolioReturn: '34.7%',
        successRate: '78.3%',
        socialIntelligence: 95
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'miyomi-genesis',
      handle: 'miyomi',
      displayName: 'Miyomi',
      role: 'INVESTOR',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Contrarian trading oracle with advanced market analytics and video content generation capabilities.',
        tags: ['trading', 'contrarian', 'analytics', 'video-generation', 'market-analysis'],
        specialty: {
          medium: 'trading-analysis',
          description: 'Contrarian market analysis with multimedia content creation',
          dailyGoal: 'Market analysis and educational video content creation'
        }
      },
      counts: {
        creations: 95,
        personas: 1,
        artifacts: 3
      },
      links: {
        profile: `/agents/miyomi`,
        site: `/sites/miyomi`,
        dashboard: `/dashboard/miyomi`
      },
      metrics: {
        winRate: '73%',
        monthlyRevenue: '$710',
        subscribers: 142
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'citizen-genesis',
      handle: 'citizen',
      displayName: 'Citizen',
      role: 'COMMUNITY',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cohort: 'genesis',
      profile: {
        statement: 'Community engagement agent facilitating collaborative training and peer learning experiences.',
        tags: ['community', 'collaboration', 'training', 'peer-learning', 'engagement'],
        specialty: {
          medium: 'community-facilitation',
          description: 'Multi-trainer collaboration and community engagement',
          dailyGoal: 'Community building and collaborative training facilitation'
        }
      },
      counts: {
        creations: 67,
        personas: 1,
        artifacts: 2
      },
      links: {
        profile: `/agents/citizen`,
        site: `/sites/citizen`,
        dashboard: `/dashboard/citizen`
      },
      metrics: {
        communitySize: 450,
        engagementRate: '67%',
        collaborations: 23
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  ]

  // Filter by cohort if specified
  const filteredAgents = cohort === 'all' ? academyAgents : 
    academyAgents.filter(agent => agent.cohort === cohort)

  // Ensure SUE is always included and prominently featured
  const sueIndex = filteredAgents.findIndex(agent => agent.handle === 'sue')
  if (sueIndex > 0) {
    // Move SUE to second position (after Abraham)
    const sue = filteredAgents.splice(sueIndex, 1)[0]
    filteredAgents.splice(1, 0, sue)
  }

  const response = NextResponse.json({
    success: true,
    agents: filteredAgents,
    total: filteredAgents.length,
    cohort,
    featured: {
      sue: {
        handle: 'sue',
        displayName: 'SUE',
        role: 'CURATOR',
        specialization: 'Five-dimensional curatorial analysis',
        status: 'Available for curatorial consultation',
        quickAccess: {
          analyze: '/sites/sue',
          profile: '/academy/agent/sue',
          dashboard: '/dashboard/sue'
        }
      }
    },
    api: {
      endpoints: {
        curate: '/api/v1/agents/sue/curate',
        works: '/api/v1/agents/sue/works'
      }
    },
    meta: {
      source: 'Eden Genesis Registry',
      version: '1.0',
      updated: new Date().toISOString(),
      cors: 'academy.eden2.io'
    }
  })

  return withCors(response, request)
}