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
        : works.filter((w: Record<string, unknown>) => new Date(w.createdAt as string) >= startDate)
      
      // Calculate statistics
      const stats = {
        // Content metrics
        total: periodWorks.length,
        byType: periodWorks.reduce((acc: Record<string, number>, w: Record<string, unknown>) => {
          const type = w.type as string
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {}),
        byMedium: periodWorks.reduce((acc: Record<string, number>, w: Record<string, unknown>) => {
          const medium = w.medium as string
          acc[medium] = (acc[medium] || 0) + 1
          return acc
        }, {}),
        byStatus: periodWorks.reduce((acc: Record<string, number>, w: Record<string, unknown>) => {
          const status = w.status as string
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {}),
        
        // Curation metrics
        featured: periodWorks.filter((w: Record<string, unknown>) => (w.curation as Record<string, unknown>)?.featured).length,
        curated: periodWorks.filter((w: Record<string, unknown>) => (w.curation as Record<string, unknown>)?.curated).length,
        averageScore: periodWorks
          .filter((w: Record<string, unknown>) => (w.curation as Record<string, unknown>)?.score)
          .reduce((sum: number, w: Record<string, unknown>, _, arr: Record<string, unknown>[]) => 
            sum + ((w.curation as Record<string, unknown>).score as number) / arr.length, 0),
        
        // Engagement metrics
        totalViews: periodWorks.reduce((sum: number, w: Record<string, unknown>) => sum + ((w.views as number) || 0), 0),
        totalLikes: periodWorks.reduce((sum: number, w: Record<string, unknown>) => sum + ((w.likes as number) || 0), 0),
        totalShares: periodWorks.reduce((sum: number, w: Record<string, unknown>) => sum + ((w.shares as number) || 0), 0),
        
        // Theme analysis
        topThemes: Object.entries(
          periodWorks
            .flatMap((w: Record<string, unknown>) => (w.themes as string[]) || [])
            .reduce((acc: Record<string, number>, theme: string) => {
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
          ? works.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
              new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
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
      
    } catch {
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
function getDailyActivity(works: Record<string, unknown>[], startDate: Date, endDate: Date) {
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
    const dateStr = new Date(work.createdAt as string).toISOString().split('T')[0]
    if (dayMap[dateStr] !== undefined) {
      dayMap[dateStr]++
    }
  })
  
  return Object.entries(dayMap).map(([date, count]) => ({ date, count }))
}

// Helper function to calculate consecutive practice days
function calculateConsecutiveDays(works: Record<string, unknown>[]): number {
  if (works.length === 0) return 0
  
  const sortedWorks = works
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    )
  
  const today = new Date().toISOString().split('T')[0]
  const lastWorkDate = new Date(sortedWorks[0].createdAt as string).toISOString().split('T')[0]
  
  // If last work isn't today or yesterday, streak is broken
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(lastWorkDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysDiff > 1) return 0
  
  // Count consecutive days
  let consecutive = 1
  let currentDate = new Date(sortedWorks[0].createdAt as string)
  
  for (let i = 1; i < sortedWorks.length; i++) {
    const workDate = new Date(sortedWorks[i].createdAt as string)
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