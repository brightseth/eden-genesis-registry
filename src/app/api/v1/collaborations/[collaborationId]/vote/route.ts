/**
 * Collaborative Voting API
 * Manage voting on works in collaborative curation
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { type Collaboration } from '@/lib/schemas/curation.schema'

// POST - Submit vote on a work
export async function POST(
  request: NextRequest,
  { params }: { params: { collaborationId: string } }
) {
  try {
    const { collaborationId } = params
    const body = await request.json()
    const { workId, curatorId, vote, reason } = body
    
    // Validate vote
    const validVotes = ['accept', 'reject', 'abstain']
    if (!validVotes.includes(vote)) {
      return NextResponse.json(
        { success: false, error: `Invalid vote. Must be one of: ${validVotes.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Load collaborations
    const collaborationsPath = path.join(process.cwd(), 'data', 'collaborations', 'collaborations.json')
    const data = await fs.readFile(collaborationsPath, 'utf-8')
    const collaborations: Collaboration[] = JSON.parse(data)
    
    // Find collaboration
    const collaborationIndex = collaborations.findIndex(c => c.id === collaborationId)
    if (collaborationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Collaboration not found' },
        { status: 404 }
      )
    }
    
    const collaboration = collaborations[collaborationIndex]
    
    // Check if curator is a participant
    const participant = collaboration.participants.find(p => p.curatorId === curatorId)
    if (!participant || !participant.active) {
      return NextResponse.json(
        { success: false, error: 'Not an active participant in this collaboration' },
        { status: 403 }
      )
    }
    
    // Find or create decision record for this work
    let decision = collaboration.decisions.find(d => d.workId === workId)
    if (!decision) {
      decision = {
        workId,
        votes: [],
        outcome: 'pending',
        decidedAt: undefined
      }
      collaboration.decisions.push(decision)
    }
    
    // Check if curator already voted
    const existingVoteIndex = decision.votes.findIndex(v => v.curatorId === curatorId)
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      decision.votes[existingVoteIndex] = {
        curatorId,
        vote,
        reason,
        timestamp: new Date()
      }
    } else {
      // Add new vote
      decision.votes.push({
        curatorId,
        vote,
        reason,
        timestamp: new Date()
      })
    }
    
    // Calculate outcome based on voting rules
    const outcome = calculateOutcome(decision, collaboration)
    decision.outcome = outcome
    
    if (outcome !== 'pending') {
      decision.decidedAt = new Date()
      
      // Apply decision to work if accepted
      if (outcome === 'accepted') {
        await applyCollaborativeDecision(workId, collaboration, curatorId)
      }
    }
    
    // Update collaboration
    collaboration.updatedAt = new Date()
    
    // Save collaborations
    await fs.writeFile(collaborationsPath, JSON.stringify(collaborations, null, 2))
    
    // Get vote summary
    const voteSummary = getVoteSummary(decision, collaboration)
    
    return NextResponse.json({
      success: true,
      vote: {
        workId,
        curatorId,
        vote,
        timestamp: new Date()
      },
      decision: {
        outcome: decision.outcome,
        voteSummary,
        decidedAt: decision.decidedAt
      }
    })
    
  } catch (error) {
    console.error('Vote submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get voting status for works
export async function GET(
  request: NextRequest,
  { params }: { params: { collaborationId: string } }
) {
  try {
    const { collaborationId } = params
    const searchParams = request.nextUrl.searchParams
    const workId = searchParams.get('workId')
    
    // Load collaborations
    const collaborationsPath = path.join(process.cwd(), 'data', 'collaborations', 'collaborations.json')
    const data = await fs.readFile(collaborationsPath, 'utf-8')
    const collaborations: Collaboration[] = JSON.parse(data)
    
    // Find collaboration
    const collaboration = collaborations.find(c => c.id === collaborationId)
    if (!collaboration) {
      return NextResponse.json(
        { success: false, error: 'Collaboration not found' },
        { status: 404 }
      )
    }
    
    if (workId) {
      // Return specific work's voting status
      const decision = collaboration.decisions.find(d => d.workId === workId)
      
      if (!decision) {
        return NextResponse.json({
          success: true,
          workId,
          status: 'no_votes',
          votes: [],
          outcome: 'pending'
        })
      }
      
      return NextResponse.json({
        success: true,
        workId,
        votes: decision.votes,
        outcome: decision.outcome,
        decidedAt: decision.decidedAt,
        summary: getVoteSummary(decision, collaboration)
      })
    }
    
    // Return all decisions
    const decisionsWithSummary = collaboration.decisions.map(decision => ({
      ...decision,
      summary: getVoteSummary(decision, collaboration)
    }))
    
    return NextResponse.json({
      success: true,
      collaborationId,
      decisions: decisionsWithSummary,
      stats: {
        total: decisionsWithSummary.length,
        accepted: decisionsWithSummary.filter(d => d.outcome === 'accepted').length,
        rejected: decisionsWithSummary.filter(d => d.outcome === 'rejected').length,
        pending: decisionsWithSummary.filter(d => d.outcome === 'pending').length
      }
    })
    
  } catch (error) {
    console.error('Get voting status error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Calculate outcome based on voting rules
function calculateOutcome(
  decision: any,
  collaboration: Collaboration
): 'accepted' | 'rejected' | 'pending' {
  const { mechanism, quorum, vetoRights, weightings } = collaboration.votingRules
  
  // Check if we have quorum
  const activeParticipants = collaboration.participants.filter(p => p.active).length
  const voteCount = decision.votes.length
  const hasQuorum = voteCount / activeParticipants >= quorum
  
  if (!hasQuorum) {
    return 'pending'
  }
  
  // Check for veto
  if (vetoRights && vetoRights.length > 0) {
    const vetoVote = decision.votes.find((v: any) => 
      vetoRights.includes(v.curatorId) && v.vote === 'reject'
    )
    if (vetoVote) {
      return 'rejected'
    }
  }
  
  // Calculate based on mechanism
  switch (mechanism) {
    case 'unanimous':
      const allAccept = decision.votes.every((v: any) => v.vote === 'accept' || v.vote === 'abstain')
      const hasAccepts = decision.votes.some((v: any) => v.vote === 'accept')
      return allAccept && hasAccepts ? 'accepted' : 
             decision.votes.some((v: any) => v.vote === 'reject') ? 'rejected' : 'pending'
    
    case 'majority':
      const accepts = decision.votes.filter((v: any) => v.vote === 'accept').length
      const rejects = decision.votes.filter((v: any) => v.vote === 'reject').length
      return accepts > rejects ? 'accepted' : 
             rejects > accepts ? 'rejected' : 'pending'
    
    case 'weighted':
      if (!weightings) return 'pending'
      
      let weightedAccepts = 0
      let weightedRejects = 0
      
      for (const vote of decision.votes) {
        const weight = weightings[vote.curatorId] || 1
        if (vote.vote === 'accept') weightedAccepts += weight
        if (vote.vote === 'reject') weightedRejects += weight
      }
      
      return weightedAccepts > weightedRejects ? 'accepted' :
             weightedRejects > weightedAccepts ? 'rejected' : 'pending'
    
    case 'veto':
      // Already handled above, but include for completeness
      const hasReject = decision.votes.some((v: any) => v.vote === 'reject')
      return hasReject ? 'rejected' : 
             decision.votes.some((v: any) => v.vote === 'accept') ? 'accepted' : 'pending'
    
    default:
      return 'pending'
  }
}

// Get vote summary
function getVoteSummary(decision: any, collaboration: Collaboration) {
  const activeParticipants = collaboration.participants.filter(p => p.active)
  const voted = decision.votes.map((v: any) => v.curatorId)
  const notVoted = activeParticipants
    .filter(p => !voted.includes(p.curatorId))
    .map(p => ({ curatorId: p.curatorId, name: p.name }))
  
  return {
    totalParticipants: activeParticipants.length,
    voted: decision.votes.length,
    notVoted: notVoted.length,
    notVotedList: notVoted,
    accepts: decision.votes.filter((v: any) => v.vote === 'accept').length,
    rejects: decision.votes.filter((v: any) => v.vote === 'reject').length,
    abstains: decision.votes.filter((v: any) => v.vote === 'abstain').length,
    quorumMet: decision.votes.length / activeParticipants.length >= collaboration.votingRules.quorum
  }
}

// Apply collaborative decision to work
async function applyCollaborativeDecision(
  workId: string,
  collaboration: Collaboration,
  curatorId: string
) {
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
      
      // Mark as collaboratively curated
      work.curation.curated = true
      work.curation.curatedAt = new Date().toISOString()
      work.curation.curatedBy = 'collaborative'
      work.curation.collaborationId = collaboration.id
      work.curation.collaborationTitle = collaboration.title
      
      // Add to history
      work.curation.history.push({
        action: 'collaborative-curate',
        metadata: {
          collaborationId: collaboration.id,
          collaborationTitle: collaboration.title,
          participants: collaboration.participants.map(p => p.name).join(', ')
        },
        timestamp: new Date().toISOString(),
        curatorId
      })
      
      await fs.writeFile(worksPath, JSON.stringify(works, null, 2))
    }
  } catch (error) {
    console.error('Failed to apply collaborative decision:', error)
  }
}