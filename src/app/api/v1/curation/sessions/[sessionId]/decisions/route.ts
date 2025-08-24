/**
 * Curation Decision Tracking API
 * Track and manage curator decisions within sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { type CurationSession } from '@/lib/schemas/curation.schema'

// POST - Record a curation decision
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { workId, decision, curatorId, reason, timeSpent } = body
    
    // Validate decision
    const validDecisions = ['accept', 'reject', 'maybe', 'skip']
    if (!validDecisions.includes(decision)) {
      return NextResponse.json(
        { success: false, error: `Invalid decision. Must be one of: ${validDecisions.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Load sessions
    const sessionsPath = path.join(process.cwd(), 'data', 'curation', 'sessions.json')
    const data = await fs.readFile(sessionsPath, 'utf-8')
    const sessions: CurationSession[] = JSON.parse(data)
    
    // Find session
    const sessionIndex = sessions.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }
    
    const session = sessions[sessionIndex]
    
    // Check if work is in queue
    if (!session.workQueue.includes(workId) && !session.reviewed.includes(workId)) {
      return NextResponse.json(
        { success: false, error: 'Work not in session queue' },
        { status: 400 }
      )
    }
    
    // Record decision
    const decisionRecord = {
      workId,
      decision,
      timestamp: new Date(),
      timeSpent: timeSpent || 0,
      curatorId: curatorId || session.curatorId,
      reason
    }
    
    session.decisions.push(decisionRecord)
    
    // Update work lists
    // Remove from all lists first
    session.workQueue = session.workQueue.filter(id => id !== workId)
    session.accepted = session.accepted.filter(id => id !== workId)
    session.rejected = session.rejected.filter(id => id !== workId)
    session.maybe = session.maybe.filter(id => id !== workId)
    
    // Add to appropriate list
    switch (decision) {
      case 'accept':
        session.accepted.push(workId)
        break
      case 'reject':
        session.rejected.push(workId)
        break
      case 'maybe':
        session.maybe.push(workId)
        break
      case 'skip':
        // Move to end of queue
        session.workQueue.push(workId)
        break
    }
    
    // Mark as reviewed if not skipped
    if (decision !== 'skip' && !session.reviewed.includes(workId)) {
      session.reviewed.push(workId)
    }
    
    // Update session stats
    session.lastActiveAt = new Date()
    session.totalReviewTime += timeSpent || 0
    
    if (session.decisions.length > 0) {
      const totalTime = session.decisions.reduce((sum, d) => sum + (d.timeSpent || 0), 0)
      session.averageDecisionTime = totalTime / session.decisions.length
    }
    
    // Check if session is complete
    if (session.targetCount && session.accepted.length >= session.targetCount) {
      session.status = 'completed'
      session.completedAt = new Date()
    } else if (session.workQueue.length === 0 && session.maybe.length === 0) {
      session.status = 'completed'
      session.completedAt = new Date()
    }
    
    // Update work's curation data if decision is accept
    if (decision === 'accept') {
      await updateWorkCuration(workId, session, curatorId || session.curatorId)
    }
    
    // Save sessions
    await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2))
    
    // Calculate progress
    const progress = {
      reviewed: session.reviewed.length,
      remaining: session.workQueue.length,
      accepted: session.accepted.length,
      rejected: session.rejected.length,
      maybe: session.maybe.length,
      targetProgress: session.targetCount 
        ? `${session.accepted.length}/${session.targetCount}`
        : null
    }
    
    return NextResponse.json({
      success: true,
      decision: decisionRecord,
      sessionStatus: session.status,
      progress,
      nextWorkId: session.workQueue[0] || null
    })
    
  } catch (error) {
    console.error('Decision recording error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get session decisions
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    
    // Load sessions
    const sessionsPath = path.join(process.cwd(), 'data', 'curation', 'sessions.json')
    const data = await fs.readFile(sessionsPath, 'utf-8')
    const sessions: CurationSession[] = JSON.parse(data)
    
    // Find session
    const session = sessions.find(s => s.id === sessionId)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Get detailed work information for decisions
    const decisionsWithWorks = await enrichDecisionsWithWorks(session)
    
    return NextResponse.json({
      success: true,
      sessionId,
      decisions: decisionsWithWorks,
      summary: {
        total: session.decisions.length,
        accepted: session.accepted.length,
        rejected: session.rejected.length,
        maybe: session.maybe.length,
        averageTimePerDecision: session.averageDecisionTime,
        totalTimeSpent: session.totalReviewTime
      }
    })
    
  } catch (error) {
    console.error('Get decisions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper to update work's curation data
async function updateWorkCuration(workId: string, session: CurationSession, curatorId: string) {
  // Extract agent ID from work ID
  const agentId = workId.split('_')[0]
  const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
  
  try {
    const data = await fs.readFile(worksPath, 'utf-8')
    const works = JSON.parse(data)
    
    const work = works.find((w: any) => w.id === workId)
    if (work) {
      if (!work.curation) {
        work.curation = {
          featured: false,
          curated: false,
          score: null,
          tags: [],
          collections: [],
          exhibitions: [],
          annotations: [],
          history: []
        }
      }
      
      // Mark as curated through session
      work.curation.curated = true
      work.curation.curatedAt = new Date().toISOString()
      work.curation.curatedBy = curatorId
      work.curation.sessionId = session.id
      work.curation.sessionTitle = session.title
      
      // Add to history
      work.curation.history.push({
        action: 'session-curate',
        metadata: {
          sessionId: session.id,
          sessionTitle: session.title,
          goal: session.goal
        },
        timestamp: new Date().toISOString(),
        curatorId
      })
      
      await fs.writeFile(worksPath, JSON.stringify(works, null, 2))
    }
  } catch (error) {
    console.error('Failed to update work curation:', error)
  }
}

// Helper to enrich decisions with work details
async function enrichDecisionsWithWorks(session: CurationSession) {
  const enrichedDecisions = []
  
  for (const decision of session.decisions) {
    const agentId = decision.workId.split('_')[0]
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      const works = JSON.parse(data)
      const work = works.find((w: any) => w.id === decision.workId)
      
      enrichedDecisions.push({
        ...decision,
        work: work ? {
          id: work.id,
          title: work.title,
          medium: work.medium,
          themes: work.themes,
          thumbnail: work.files?.[0]?.url
        } : null
      })
    } catch {
      enrichedDecisions.push(decision)
    }
  }
  
  return enrichedDecisions
}