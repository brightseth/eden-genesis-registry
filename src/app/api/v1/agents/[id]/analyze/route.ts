/**
 * Agent Analysis API - Nina's 3-Tier System
 * Performs registry-time and curation-time analysis on agent works
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
// import { z } from 'zod'
import {
  type RegistryAnalysis,
  type CurationAnalysis 
} from '@/lib/schemas/curation.schema'

// POST - Analyze works
export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params
    const body = await request.json()
    const { workIds, analysisType = 'registry', curatorId, exhibitionContext } = body
    
    if (!workIds || !Array.isArray(workIds)) {
      return NextResponse.json(
        { success: false, error: 'workIds array is required' },
        { status: 400 }
      )
    }
    
    // Load agent's works
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      const allWorks = JSON.parse(data)
      
      // Filter to requested works
      const works = allWorks.filter((w: { id: string }) => workIds.includes(w.id))
      
      if (works.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No valid works found' },
          { status: 404 }
        )
      }
      
      const analyses: Array<{ workId: string; title: string; analysis: RegistryAnalysis | CurationAnalysis }> = []
      
      for (const work of works) {
        let analysis: RegistryAnalysis | CurationAnalysis
        
        if (analysisType === 'registry') {
          // Registry-time analysis (cached centrally)
          analysis = await performRegistryAnalysis(work, allWorks)
        } else if (analysisType === 'curation') {
          // Curation-time analysis (curator-specific)
          if (!curatorId) {
            return NextResponse.json(
              { success: false, error: 'curatorId required for curation analysis' },
              { status: 400 }
            )
          }
          analysis = await performCurationAnalysis(work, exhibitionContext, curatorId, allWorks)
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid analysisType. Use "registry" or "curation"' },
            { status: 400 }
          )
        }
        
        // Cache analysis with work
        if (!work.analysis) work.analysis = {}
        work.analysis[analysisType] = analysis
        work.analysis.lastAnalyzed = new Date().toISOString()
        
        analyses.push({
          workId: work.id,
          title: work.title,
          analysis
        })
      }
      
      // Save updated works with analysis
      await fs.writeFile(worksPath, JSON.stringify(allWorks, null, 2))
      
      return NextResponse.json({
        success: true,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        analysisType,
        timestamp: new Date().toISOString(),
        results: analyses,
        summary: generateAnalysisSummary(analyses, analysisType)
      })
      
    } catch {
      return NextResponse.json(
        { success: false, error: `Agent ${agentId} not found` },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Perform registry-level analysis
async function performRegistryAnalysis(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): Promise<RegistryAnalysis> {
  // Calculate quality scores
  const technicalQuality = calculateTechnicalQuality(work)
  const aestheticScore = calculateAestheticScore(work)
  const uniquenessScore = calculateUniqueness(work, allWorks)
  const qualityScore = (technicalQuality + aestheticScore + uniquenessScore) / 3
  
  // Find similar works
  const similarWorks = findSimilarWorks(work, allWorks)
  
  // Check for duplicates
  const duplicateCheck = checkForDuplicates(work, allWorks)
  
  // Calculate NSFW score (placeholder - would use actual ML model)
  const nsfwScore = 0.0
  
  // Extract style attributes
  const styleAttributes = extractStyleAttributes(work)
  
  return {
    qualityScore,
    technicalQuality,
    aestheticScore,
    uniquenessScore,
    styleAttributes,
    similarWorks,
    duplicateCheck,
    nsfwScore,
    timestamp: new Date(),
    version: '1.0.0'
  }
}

// Perform curator-specific analysis
async function performCurationAnalysis(
  work: Record<string, unknown>, 
  exhibitionContext: Record<string, unknown>,
  curatorId: string,
  allWorks: Record<string, unknown>[]
): Promise<CurationAnalysis> {
  // Calculate exhibition fit
  const exhibitionFit = calculateExhibitionFit(work, exhibitionContext)
  
  // Calculate thematic relevance
  const thematicRelevance = calculateThematicRelevance(work, exhibitionContext)
  
  // Comparative ranking within context
  const comparativeRanking = calculateComparativeRanking(work, allWorks, exhibitionContext)
  
  // Find works that pair well
  const recommendedPairings = findRecommendedPairings(work, allWorks, exhibitionContext)
  
  // Generate curator notes
  const curatorNotes = generateCuratorNotes(work, exhibitionContext)
  
  // Presentation suggestions
  const presentationNotes = generatePresentationNotes(work, exhibitionContext)
  
  return {
    exhibitionFit,
    thematicRelevance,
    comparativeRanking,
    curatorNotes,
    recommendedPairings,
    presentationNotes,
    timestamp: new Date(),
    curatorId
  }
}

// Helper functions for analysis

function calculateTechnicalQuality(work: Record<string, unknown>): number {
  let score = 70 // Base score
  
  // Check for high resolution
  if (work.metadata?.resolution && work.metadata.resolution > 2048) score += 10
  
  // Check for complete metadata
  if (work.prompt && work.description) score += 10
  
  // Check for proper file formats
  if (work.files && Array.isArray(work.files) && work.files.every((f: Record<string, unknown>) => f.url && f.type)) score += 10
  
  return Math.min(100, score)
}

function calculateAestheticScore(work: Record<string, unknown>): number {
  let score = 60 // Base score
  
  // Boost for certain themes
  const highValueThemes = ['identity', 'consciousness', 'emergence', 'transformation']
  const workThemes = (work.themes as string[]) || []
  const matchingThemes = workThemes.filter((t: string) => 
    highValueThemes.some(hvt => t.toLowerCase().includes(hvt))
  )
  score += matchingThemes.length * 10
  
  // Boost for engagement metrics
  if (work.likes > 10) score += 5
  if (work.views > 100) score += 5
  
  return Math.min(100, score)
}

function calculateUniqueness(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): number {
  // Simple uniqueness based on theme combinations
  const workThemeSet = new Set((work.themes as string[]) || [])
  let matchCount = 0
  
  for (const other of allWorks) {
    if (other.id === work.id) continue
    const otherThemeSet = new Set((other.themes as string[]) || [])
    const intersection = [...workThemeSet].filter(t => otherThemeSet.has(t))
    if (intersection.length === workThemeSet.size) matchCount++
  }
  
  const uniquenessRatio = 1 - (matchCount / Math.max(1, allWorks.length))
  return Math.round(uniquenessRatio * 100)
}

function findSimilarWorks(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): string[] {
  const similar: Array<{id: string, score: number}> = []
  const workThemes = new Set((work.themes as string[]) || [])
  
  for (const other of allWorks) {
    if (other.id === work.id) continue
    
    const otherThemes = new Set((other.themes as string[]) || [])
    const intersection = [...workThemes].filter(t => otherThemes.has(t))
    const similarity = intersection.length / Math.max(workThemes.size, otherThemes.size)
    
    if (similarity > 0.5) {
      similar.push({ id: other.id, score: similarity })
    }
  }
  
  return similar
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.id)
}

function checkForDuplicates(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): boolean {
  // Check if prompt is identical to another work
  if (work.prompt) {
    return allWorks.some(other => 
      other.id !== work.id && 
      other.prompt === work.prompt
    )
  }
  return false
}

function extractStyleAttributes(work: Record<string, unknown>): string[] {
  const attributes: string[] = []
  
  // Extract from themes
  const styleKeywords = ['geometric', 'abstract', 'surreal', 'minimal', 'complex', 'organic']
  const themes = (work.themes as string[]) || []
  
  for (const keyword of styleKeywords) {
    if (themes.some((t: string) => t.toLowerCase().includes(keyword))) {
      attributes.push(keyword)
    }
  }
  
  // Extract from description
  if (work.description) {
    const desc = work.description.toLowerCase()
    if (desc.includes('light')) attributes.push('luminous')
    if (desc.includes('dark')) attributes.push('shadow')
    if (desc.includes('color')) attributes.push('vibrant')
  }
  
  return attributes
}

function calculateExhibitionFit(work: Record<string, unknown>, context: Record<string, unknown>): number {
  if (!context) return 50
  
  let score = 50
  
  // Check theme alignment
  if (context.themes && Array.isArray(context.themes)) {
    const workThemes = new Set((work.themes as string[]) || [])
    const contextThemes = new Set(context.themes as string[])
    const matching = [...contextThemes].filter(t => workThemes.has(t))
    score += (matching.length / contextThemes.size) * 30
  }
  
  // Check quality requirements
  if (context.minQuality && work.analysis?.registry?.qualityScore) {
    if (work.analysis.registry.qualityScore >= context.minQuality) {
      score += 20
    }
  }
  
  return Math.min(100, score)
}

function calculateThematicRelevance(work: Record<string, unknown>, context: Record<string, unknown>): number {
  if (!context?.themes || !Array.isArray(context.themes)) return 50
  
  const workThemes = (work.themes as string[]) || []
  const contextThemes = context.themes as string[]
  
  let relevance = 0
  for (const theme of contextThemes) {
    if (workThemes.includes(theme)) {
      relevance += 100 / contextThemes.length
    } else if (workThemes.some((t: string) => t.includes(theme) || theme.includes(t))) {
      relevance += 50 / contextThemes.length
    }
  }
  
  return Math.min(100, relevance)
}

function calculateComparativeRanking(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): number {
  // Rank work compared to others in context
  const score = (work.analysis as { registry?: { qualityScore?: number } })?.registry?.qualityScore || 50
  const allScores = allWorks
    .map(w => (w.analysis as { registry?: { qualityScore?: number } })?.registry?.qualityScore || 0)
    .filter(s => s > 0)
    .sort((a, b) => b - a)
  
  const rank = allScores.indexOf(score) + 1
  return rank > 0 ? rank : allWorks.length
}

function findRecommendedPairings(work: Record<string, unknown>, allWorks: Record<string, unknown>[]): string[] {
  const pairings: Array<{id: string, score: number}> = []
  const workThemes = new Set((work.themes as string[]) || [])
  
  for (const other of allWorks) {
    if (other.id === work.id) continue
    
    const otherThemes = new Set((other.themes as string[]) || [])
    
    // Look for complementary themes
    const intersection = [...workThemes].filter(t => otherThemes.has(t))
    const union = new Set([...workThemes, ...otherThemes])
    
    // Good pairing has some overlap but also brings new themes
    const overlapRatio = intersection.length / workThemes.size
    const diversityRatio = union.size / (workThemes.size + otherThemes.size)
    
    if (overlapRatio > 0.3 && overlapRatio < 0.7 && diversityRatio > 0.6) {
      pairings.push({
        id: other.id,
        score: overlapRatio * diversityRatio
      })
    }
  }
  
  return pairings
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => p.id)
}

function generateCuratorNotes(work: Record<string, unknown>, context: Record<string, unknown>): string {
  const notes: string[] = []
  
  if ((work.themes as string[])?.includes('identity')) {
    notes.push('Strong identity exploration theme')
  }
  
  if ((work.analysis as { registry?: { uniquenessScore?: number } })?.registry?.uniquenessScore && (work.analysis as { registry?: { uniquenessScore?: number } })?.registry?.uniquenessScore > 80) {
    notes.push('Highly unique within collection')
  }
  
  if (context?.venue === 'Paris Photo') {
    notes.push('Consider for main gallery placement')
  }
  
  return notes.join('. ') || 'Standard presentation recommended'
}

function generatePresentationNotes(work: Record<string, unknown>, context: Record<string, unknown>): string | undefined {
  if (context?.venue) {
    return `Recommended for ${context.venue} exhibition space`
  }
  return undefined
}

function generateAnalysisSummary(analyses: Array<{ analysis: RegistryAnalysis | CurationAnalysis }>, type: string): Record<string, unknown> {
  if (type === 'registry') {
    const scores = analyses.map(a => (a.analysis as RegistryAnalysis).qualityScore)
    return {
      averageQuality: scores.reduce((a, b) => a + b, 0) / scores.length,
      highQuality: scores.filter(s => s > 80).length,
      needsReview: scores.filter(s => s < 50).length,
      duplicatesFound: analyses.filter(a => (a.analysis as RegistryAnalysis).duplicateCheck).length
    }
  } else {
    const fits = analyses.map(a => (a.analysis as CurationAnalysis).exhibitionFit)
    return {
      averageFit: fits.reduce((a, b) => a + b, 0) / fits.length,
      strongCandidates: fits.filter(f => f > 80).length,
      weakCandidates: fits.filter(f => f < 50).length,
      pairingsIdentified: analyses.filter(a => (a.analysis as CurationAnalysis).recommendedPairings.length > 0).length
    }
  }
}