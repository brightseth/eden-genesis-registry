import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/v1/dashboard/progress
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cohortSlug = searchParams.get('cohort')
  
  try {
    let where: any = {}
    
    if (cohortSlug) {
      const cohort = await prisma.cohort.findUnique({
        where: { slug: cohortSlug }
      })
      if (cohort) {
        where = { cohortId: cohort.id }
      }
    }
    
    const agents = await prisma.agent.findMany({
      where,
      include: {
        checklists: true,
        profile: true,
        personas: true,
        artifacts: true,
        creations: true,
        trainers: {
          include: {
            trainer: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    const summary = {
      totalAgents: agents.length,
      byStatus: {
        invited: agents.filter(a => a.status === 'INVITED').length,
        applying: agents.filter(a => a.status === 'APPLYING').length,
        onboarding: agents.filter(a => a.status === 'ONBOARDING').length,
        active: agents.filter(a => a.status === 'ACTIVE').length,
        graduated: agents.filter(a => a.status === 'GRADUATED').length,
        archived: agents.filter(a => a.status === 'ARCHIVED').length
      },
      averageProgress: agents.reduce((acc, agent) => {
        const checklist = agent.checklists[0]
        return acc + (checklist?.percent || 0)
      }, 0) / agents.length,
      agents: agents.map(agent => ({
        id: agent.id,
        handle: agent.handle,
        displayName: agent.displayName,
        status: agent.status,
        progress: agent.checklists[0]?.percent || 0,
        hasProfile: !!agent.profile,
        hasPersona: agent.personas.length > 0,
        hasArtifacts: agent.artifacts.length > 0,
        creationCount: agent.creations.length,
        trainers: agent.trainers.map(t => ({
          name: t.trainer.user.name,
          email: t.trainer.user.email,
          role: t.roleInAgent
        }))
      }))
    }
    
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Failed to get progress summary:', error)
    return NextResponse.json(
      { error: 'Failed to get progress summary' },
      { status: 500 }
    )
  }
}