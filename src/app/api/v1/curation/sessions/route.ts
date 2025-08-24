/**
 * Curation Session Management API
 * Session-based workflow for systematic curation
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ulid } from 'ulid'
import { CurationSessionSchema, type CurationSession } from '@/lib/schemas/curation.schema'

// GET - List curation sessions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const curatorId = searchParams.get('curatorId')
    const status = searchParams.get('status')
    const agentId = searchParams.get('agentId')
    
    const sessionsPath = path.join(process.cwd(), 'data', 'curation', 'sessions.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(sessionsPath)
    } catch {
      await fs.mkdir(path.dirname(sessionsPath), { recursive: true })
      await fs.writeFile(sessionsPath, '[]')
    }
    
    const data = await fs.readFile(sessionsPath, 'utf-8')
    let sessions: CurationSession[] = JSON.parse(data)
    
    // Apply filters
    if (curatorId) {
      sessions = sessions.filter(s => 
        s.curatorId === curatorId || 
        s.collaborators.some(c => c.curatorId === curatorId)
      )
    }
    
    if (status) {
      sessions = sessions.filter(s => s.status === status)
    }
    
    if (agentId) {
      // Filter sessions that include works from this agent
      sessions = sessions.filter(s => 
        s.workQueue.some(wId => wId.startsWith(agentId))
      )
    }
    
    // Sort by last active
    sessions.sort((a, b) => 
      new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      sessions,
      meta: {
        total: sessions.length,
        active: sessions.filter(s => s.status === 'active').length,
        completed: sessions.filter(s => s.status === 'completed').length
      }
    })
    
  } catch (error) {
    console.error('Sessions GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new curation session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate session data
    const sessionData = {
      ...body,
      id: ulid(),
      status: 'active',
      workQueue: [],
      reviewed: [],
      accepted: [],
      rejected: [],
      maybe: [],
      startedAt: new Date(),
      lastActiveAt: new Date(),
      totalReviewTime: 0,
      averageDecisionTime: 0,
      decisions: [],
      collaborators: body.collaborators || []
    }
    
    const session = CurationSessionSchema.parse(sessionData)
    
    // Load existing sessions
    const sessionsPath = path.join(process.cwd(), 'data', 'curation', 'sessions.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(sessionsPath)
    } catch {
      await fs.mkdir(path.dirname(sessionsPath), { recursive: true })
      await fs.writeFile(sessionsPath, '[]')
    }
    
    const data = await fs.readFile(sessionsPath, 'utf-8')
    const sessions = JSON.parse(data)
    
    // Populate work queue based on criteria
    if (body.agentId && body.autoPopulate !== false) {
      const works = await getFilteredWorks(body.agentId, session.criteria)
      session.workQueue = works.map((w: any) => w.id)
    }
    
    // Add new session
    sessions.push(session)
    
    // Save sessions
    await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2))
    
    return NextResponse.json({
      success: true,
      session,
      message: `Session created with ${session.workQueue.length} works to review`
    })
    
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper to get filtered works
async function getFilteredWorks(agentId: string, criteria: any) {
  const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
  
  try {
    const data = await fs.readFile(worksPath, 'utf-8')
    let works = JSON.parse(data)
    
    // Apply criteria filters
    if (criteria.themes && criteria.themes.length > 0) {
      works = works.filter((w: any) => 
        w.themes?.some((t: string) => criteria.themes.includes(t))
      )
    }
    
    if (criteria.minQuality) {
      works = works.filter((w: any) => 
        (w.analysis?.registry?.qualityScore || 0) >= criteria.minQuality
      )
    }
    
    if (criteria.mediaTypes && criteria.mediaTypes.length > 0) {
      works = works.filter((w: any) => 
        criteria.mediaTypes.includes(w.medium)
      )
    }
    
    if (criteria.dateRange) {
      if (criteria.dateRange.start) {
        works = works.filter((w: any) => 
          new Date(w.createdAt) >= new Date(criteria.dateRange.start)
        )
      }
      if (criteria.dateRange.end) {
        works = works.filter((w: any) => 
          new Date(w.createdAt) <= new Date(criteria.dateRange.end)
        )
      }
    }
    
    return works
  } catch {
    return []
  }
}