/**
 * Standardized Agent Statistics API
 * Analytics and metrics for any agent's content
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'all' // all, day, week, month, year
    
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      const works = JSON.parse(data)
      
      // Calculate date range for period
      let startDate = new Date(0) // Beginning of time
      const endDate = new Date()
      
      switch (period) {
        case 'day':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
          break
        case 'week':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'year':
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          break
      }
      
      // Filter works by period
      const periodWorks = period === 'all' 
        ? works 
        : works.filter((w: any) => new Date(w.createdAt) >= startDate)
      
      // Calculate statistics
      const stats = {
        // Content metrics
        total: periodWorks.length,
        byType: periodWorks.reduce((acc: any, w: any) => {
          acc[w.type] = (acc[w.type] || 0) + 1
          return acc
        }, {}),
        byMedium: periodWorks.reduce((acc: any, w: any) => {
          acc[w.medium] = (acc[w.medium] || 0) + 1
          return acc
        }, {}),
        byStatus: periodWorks.reduce((acc: any, w: any) => {
          acc[w.status] = (acc[w.status] || 0) + 1
          return acc
        }, {}),
        
        // Curation metrics
        featured: periodWorks.filter((w: any) => w.curation?.featured).length,
        curated: periodWorks.filter((w: any) => w.curation?.curated).length,
        averageScore: periodWorks
          .filter((w: any) => w.curation?.score)
          .reduce((sum: number, w: any, _, arr: any[]) => 
            sum + w.curation.score / arr.length, 0),
        
        // Engagement metrics
        totalViews: periodWorks.reduce((sum: number, w: any) => sum + (w.views || 0), 0),
        totalLikes: periodWorks.reduce((sum: number, w: any) => sum + (w.likes || 0), 0),
        totalShares: periodWorks.reduce((sum: number, w: any) => sum + (w.shares || 0), 0),
        
        // Theme analysis
        topThemes: Object.entries(
          periodWorks
            .flatMap((w: any) => w.themes || [])
            .reduce((acc: any, theme: string) => {
              acc[theme] = (acc[theme] || 0) + 1
              return acc
            }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([theme, count]) => ({ theme, count })),
        
        // Time series data
        dailyActivity: period !== 'all' ? getDailyActivity(periodWorks, startDate, endDate) : null,
        
        // Practice metrics
        consecutiveDays: calculateConsecutiveDays(works),
        lastActiveDate: works.length > 0 
          ? works.sort((a: any, b: any) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0].createdAt
          : null
      }
      
      return NextResponse.json({
        success: true,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        stats,
        links: {
          works: `/api/v1/agents/${agentId}/works`,
          curate: `/api/v1/agents/${agentId}/curate`
        }
      })
      
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: `No data found for agent ${agentId}`,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        stats: {
          total: 0,
          featured: 0,
          curated: 0
        }
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate daily activity
function getDailyActivity(works: any[], startDate: Date, endDate: Date) {
  const dayMap: Record<string, number> = {}
  
  // Initialize all days to 0
  const current = new Date(startDate)
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    dayMap[dateStr] = 0
    current.setDate(current.getDate() + 1)
  }
  
  // Count works per day
  works.forEach(work => {
    const dateStr = new Date(work.createdAt).toISOString().split('T')[0]
    if (dayMap[dateStr] !== undefined) {
      dayMap[dateStr]++
    }
  })
  
  return Object.entries(dayMap).map(([date, count]) => ({ date, count }))
}

// Helper function to calculate consecutive practice days
function calculateConsecutiveDays(works: any[]): number {
  if (works.length === 0) return 0
  
  const sortedWorks = works
    .sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  
  const today = new Date().toISOString().split('T')[0]
  const lastWorkDate = new Date(sortedWorks[0].createdAt).toISOString().split('T')[0]
  
  // If last work isn't today or yesterday, streak is broken
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(lastWorkDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysDiff > 1) return 0
  
  // Count consecutive days
  let consecutive = 1
  let currentDate = new Date(sortedWorks[0].createdAt)
  
  for (let i = 1; i < sortedWorks.length; i++) {
    const workDate = new Date(sortedWorks[i].createdAt)
    const diff = Math.floor(
      (currentDate.getTime() - workDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (diff === 1) {
      consecutive++
      currentDate = workDate
    } else if (diff > 1) {
      break
    }
  }
  
  return consecutive
}