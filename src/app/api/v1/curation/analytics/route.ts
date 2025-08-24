/**
 * Curator Analytics API
 * Track and analyze curator performance and patterns
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { 
  CuratorAnalyticsSchema, 
  type CuratorAnalytics,
  type CurationSession 
} from '@/lib/schemas/curation.schema'

// GET - Get curator analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const curatorId = searchParams.get('curatorId')
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'year' | 'all' || 'all'
    
    if (!curatorId) {
      return NextResponse.json(
        { success: false, error: 'curatorId is required' },
        { status: 400 }
      )
    }
    
    // Load curation sessions
    const sessionsPath = path.join(process.cwd(), 'data', 'curation', 'sessions.json')
    let sessions: CurationSession[] = []
    
    try {
      const sessionsData = await fs.readFile(sessionsPath, 'utf-8')
      sessions = JSON.parse(sessionsData)
    } catch {
      // No sessions yet
    }
    
    // Filter sessions by curator and period
    const startDate = getStartDate(period)
    const curatorSessions = sessions.filter(s => 
      (s.curatorId === curatorId || 
       s.collaborators.some(c => c.curatorId === curatorId)) &&
      new Date(s.startedAt) >= startDate
    )
    
    // Calculate analytics
    const analytics = await calculateCuratorAnalytics(curatorId, curatorSessions, period)
    
    return NextResponse.json({
      success: true,
      analytics,
      meta: {
        curatorId,
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString()
        },
        sessionsAnalyzed: curatorSessions.length
      }
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Calculate comprehensive curator analytics
async function calculateCuratorAnalytics(
  curatorId: string,
  sessions: CurationSession[],
  period: 'day' | 'week' | 'month' | 'year' | 'all'
): Promise<CuratorAnalytics> {
  
  // Activity metrics
  const allDecisions = sessions.flatMap(s => s.decisions)
  const curatorDecisions = allDecisions.filter(d => d.curatorId === curatorId)
  
  const totalReviews = curatorDecisions.length
  const totalDecisions = curatorDecisions.filter(d => d.decision !== 'skip').length
  const acceptanceRate = totalDecisions > 0 
    ? (curatorDecisions.filter(d => d.decision === 'accept').length / totalDecisions) * 100
    : 0
  
  const averageReviewTime = curatorDecisions.length > 0
    ? curatorDecisions.reduce((sum, d) => sum + (d.timeSpent || 0), 0) / curatorDecisions.length / 1000
    : 0
  
  // Peak activity hours
  const hourCounts: Record<number, number> = {}
  curatorDecisions.forEach(d => {
    const hour = new Date(d.timestamp).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  const peakHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour))
  
  // Quality metrics
  const acceptedWorks = await getWorksFromDecisions(
    curatorDecisions.filter(d => d.decision === 'accept')
  )
  const rejectedWorks = await getWorksFromDecisions(
    curatorDecisions.filter(d => d.decision === 'reject')
  )
  
  const averageQualityAccepted = calculateAverageQuality(acceptedWorks)
  const averageQualityRejected = calculateAverageQuality(rejectedWorks)
  
  // Consistency score
  const consistencyScore = calculateConsistency(curatorDecisions, acceptedWorks)
  
  // Disagreement rate in collaborations
  const disagreementRate = await calculateDisagreementRate(curatorId, sessions)
  
  // Preference patterns
  const preferences = await analyzePreferences(curatorDecisions, acceptedWorks)
  
  // Performance metrics
  const performance = await calculatePerformance(curatorId, sessions, curatorDecisions)
  
  // Generate insights
  const insights = generateInsights(
    {
      totalReviews,
      acceptanceRate,
      averageReviewTime,
      averageQualityAccepted,
      averageQualityRejected,
      consistencyScore
    }
  )
  
  return {
    curatorId,
    period,
    activity: {
      totalReviews,
      totalDecisions,
      acceptanceRate,
      averageReviewTime,
      peakHours,
      sessionsCompleted: sessions.filter(s => s.status === 'completed').length
    },
    quality: {
      averageQualityAccepted,
      averageQualityRejected,
      consistencyScore,
      disagreementRate
    },
    preferences,
    performance,
    insights,
    generatedAt: new Date()
  }
}

// Get start date for period
function getStartDate(period: 'day' | 'week' | 'month' | 'year' | 'all'): Date {
  const now = new Date()
  
  switch (period) {
    case 'day':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    case 'all':
    default:
      return new Date(0)
  }
}

// Get works from decisions
async function getWorksFromDecisions(decisions: any[]): Promise<any[]> {
  const works = []
  
  for (const decision of decisions) {
    const agentId = decision.workId.split('_')[0]
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      const allWorks = JSON.parse(data)
      const work = allWorks.find((w: any) => w.id === decision.workId)
      if (work) works.push(work)
    } catch {
      // Work not found
    }
  }
  
  return works
}

// Calculate average quality score
function calculateAverageQuality(works: any[]): number {
  if (works.length === 0) return 0
  
  const scores = works
    .map(w => w.analysis?.registry?.qualityScore)
    .filter(s => s !== undefined)
  
  if (scores.length === 0) return 0
  
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

// Calculate consistency score
function calculateConsistency(decisions: any[], works: any[]): number {
  if (decisions.length < 10) return 50 // Not enough data
  
  // Group decisions by similar quality scores
  const qualityBuckets: Record<string, string[]> = {}
  
  for (const work of works) {
    const quality = work.analysis?.registry?.qualityScore
    if (quality !== undefined) {
      const bucket = Math.floor(quality / 10) * 10
      const decision = decisions.find(d => d.workId === work.id)
      if (decision) {
        if (!qualityBuckets[bucket]) qualityBuckets[bucket] = []
        qualityBuckets[bucket].push(decision.decision)
      }
    }
  }
  
  // Calculate consistency within each bucket
  let totalConsistency = 0
  let bucketCount = 0
  
  for (const bucket in qualityBuckets) {
    const decisions = qualityBuckets[bucket]
    if (decisions.length >= 2) {
      const accepts = decisions.filter(d => d === 'accept').length
      const consistency = Math.max(accepts, decisions.length - accepts) / decisions.length
      totalConsistency += consistency
      bucketCount++
    }
  }
  
  return bucketCount > 0 ? (totalConsistency / bucketCount) * 100 : 50
}

// Calculate disagreement rate in collaborations
async function calculateDisagreementRate(curatorId: string, sessions: CurationSession[]): Promise<number> {
  // Load collaborations
  const collaborationsPath = path.join(process.cwd(), 'data', 'collaborations', 'collaborations.json')
  
  try {
    const data = await fs.readFile(collaborationsPath, 'utf-8')
    const collaborations = JSON.parse(data)
    
    // Find collaborations where curator participated
    const curatorCollaborations = collaborations.filter((c: any) =>
      c.participants.some((p: any) => p.curatorId === curatorId)
    )
    
    if (curatorCollaborations.length === 0) return 0
    
    let totalVotes = 0
    let disagreements = 0
    
    for (const collab of curatorCollaborations) {
      for (const decision of collab.decisions) {
        const curatorVote = decision.votes.find((v: any) => v.curatorId === curatorId)
        if (curatorVote) {
          totalVotes++
          // Check if curator's vote differs from outcome
          if (
            (curatorVote.vote === 'accept' && decision.outcome === 'rejected') ||
            (curatorVote.vote === 'reject' && decision.outcome === 'accepted')
          ) {
            disagreements++
          }
        }
      }
    }
    
    return totalVotes > 0 ? (disagreements / totalVotes) * 100 : 0
  } catch {
    return 0
  }
}

// Analyze curator preferences
async function analyzePreferences(decisions: any[], works: any[]) {
  const themeAcceptance: Record<string, { accepted: number, rejected: number }> = {}
  const agentAcceptance: Record<string, { accepted: number, rejected: number }> = {}
  
  for (const decision of decisions) {
    const work = works.find(w => w.id === decision.workId)
    if (!work) continue
    
    // Track theme preferences
    for (const theme of (work.themes || [])) {
      if (!themeAcceptance[theme]) {
        themeAcceptance[theme] = { accepted: 0, rejected: 0 }
      }
      if (decision.decision === 'accept') {
        themeAcceptance[theme].accepted++
      } else if (decision.decision === 'reject') {
        themeAcceptance[theme].rejected++
      }
    }
    
    // Track agent preferences
    const agentId = decision.workId.split('_')[0]
    if (!agentAcceptance[agentId]) {
      agentAcceptance[agentId] = { accepted: 0, rejected: 0 }
    }
    if (decision.decision === 'accept') {
      agentAcceptance[agentId].accepted++
    } else if (decision.decision === 'reject') {
      agentAcceptance[agentId].rejected++
    }
  }
  
  // Calculate acceptance rates
  const favoredThemes = Object.entries(themeAcceptance)
    .map(([theme, stats]) => ({
      theme,
      acceptanceRate: stats.accepted / (stats.accepted + stats.rejected) * 100
    }))
    .filter(t => (stats => stats.accepted + stats.rejected >= 3)(themeAcceptance[t.theme]))
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate)
    .slice(0, 5)
  
  const favoredAgents = Object.entries(agentAcceptance)
    .map(([agentId, stats]) => ({
      agentId,
      acceptanceRate: stats.accepted / (stats.accepted + stats.rejected) * 100
    }))
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate)
  
  // Extract style preferences
  const favoredStyles = works
    .filter(w => decisions.find(d => d.workId === w.id && d.decision === 'accept'))
    .flatMap(w => w.analysis?.registry?.styleAttributes || [])
    .reduce((acc: string[], style: string) => {
      if (!acc.includes(style)) acc.push(style)
      return acc
    }, [])
    .slice(0, 5)
  
  // Calculate bias indicators
  const biasIndicators: Record<string, number> = {}
  
  // Time-of-day bias
  const morningDecisions = decisions.filter(d => {
    const hour = new Date(d.timestamp).getHours()
    return hour >= 6 && hour < 12
  })
  const eveningDecisions = decisions.filter(d => {
    const hour = new Date(d.timestamp).getHours()
    return hour >= 18 && hour < 24
  })
  
  if (morningDecisions.length > 5 && eveningDecisions.length > 5) {
    const morningAcceptRate = morningDecisions.filter(d => d.decision === 'accept').length / morningDecisions.length
    const eveningAcceptRate = eveningDecisions.filter(d => d.decision === 'accept').length / eveningDecisions.length
    biasIndicators.timeOfDay = Math.abs(morningAcceptRate - eveningAcceptRate) * 100
  }
  
  return {
    favoredThemes,
    favoredStyles,
    favoredAgents,
    biasIndicators
  }
}

// Calculate performance metrics
async function calculatePerformance(
  curatorId: string,
  sessions: CurationSession[],
  decisions: any[]
): Promise<any> {
  // Exhibition success (placeholder - would track actual exhibition metrics)
  const exhibitionSuccess = 75
  
  // Peer agreement (placeholder - would compare with other curators)
  const peerAgreement = 80
  
  // Fatigue indicator - acceptance rate over time in session
  let fatigueIndicator = 0
  
  for (const session of sessions) {
    const sessionDecisions = session.decisions.filter(d => d.curatorId === curatorId)
    if (sessionDecisions.length >= 20) {
      const firstHalf = sessionDecisions.slice(0, sessionDecisions.length / 2)
      const secondHalf = sessionDecisions.slice(sessionDecisions.length / 2)
      
      const firstHalfAcceptRate = firstHalf.filter(d => d.decision === 'accept').length / firstHalf.length
      const secondHalfAcceptRate = secondHalf.filter(d => d.decision === 'accept').length / secondHalf.length
      
      fatigueIndicator = Math.max(fatigueIndicator, Math.abs(firstHalfAcceptRate - secondHalfAcceptRate) * 100)
    }
  }
  
  // Optimal batch size - based on decision time patterns
  const batchSizes = sessions.map(s => s.decisions.filter(d => d.curatorId === curatorId).length)
  const optimalBatchSize = batchSizes.length > 0 
    ? Math.round(batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length)
    : 20
  
  // Optimal session length
  const sessionLengths = sessions.map(s => s.totalReviewTime / 60000) // Convert to minutes
  const optimalSessionLength = sessionLengths.length > 0
    ? Math.round(sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length)
    : 30
  
  return {
    exhibitionSuccess,
    peerAgreement,
    fatigueIndicator,
    optimalBatchSize,
    optimalSessionLength
  }
}

// Generate insights
function generateInsights(metrics: any): any[] {
  const insights = []
  
  // Acceptance rate insights
  if (metrics.acceptanceRate < 20) {
    insights.push({
      type: 'acceptance_rate',
      message: 'Your acceptance rate is very selective. Consider if criteria might be too strict.',
      severity: 'suggestion',
      timestamp: new Date()
    })
  } else if (metrics.acceptanceRate > 80) {
    insights.push({
      type: 'acceptance_rate',
      message: 'High acceptance rate detected. Ensure quality standards are maintained.',
      severity: 'suggestion',
      timestamp: new Date()
    })
  }
  
  // Review time insights
  if (metrics.averageReviewTime < 5) {
    insights.push({
      type: 'review_time',
      message: 'Very quick review times. Consider spending more time evaluating each work.',
      severity: 'warning',
      timestamp: new Date()
    })
  } else if (metrics.averageReviewTime > 60) {
    insights.push({
      type: 'review_time',
      message: 'Long review times detected. Consider setting time limits to improve efficiency.',
      severity: 'info',
      timestamp: new Date()
    })
  }
  
  // Quality insights
  if (metrics.averageQualityAccepted < metrics.averageQualityRejected) {
    insights.push({
      type: 'quality_inversion',
      message: 'Accepting lower quality works than rejecting. Review your criteria.',
      severity: 'warning',
      timestamp: new Date()
    })
  }
  
  // Consistency insights
  if (metrics.consistencyScore < 60) {
    insights.push({
      type: 'consistency',
      message: 'Inconsistent decision patterns detected. Consider documenting your criteria.',
      severity: 'suggestion',
      timestamp: new Date()
    })
  }
  
  // Activity insights
  if (metrics.totalReviews > 100) {
    insights.push({
      type: 'high_activity',
      message: 'High curation activity! Take breaks to maintain decision quality.',
      severity: 'info',
      timestamp: new Date()
    })
  }
  
  return insights
}