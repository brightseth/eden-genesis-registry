/**
 * Trend Visualization Component
 * HELVETICA-styled mini charts for executive metrics trends
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CEODashboardService } from '@/lib/ceo-dashboard-service'

interface TrendData {
  dates: string[]
  systemHealth: number[]
  activeAgents: number[]
  revenue: number[]
}

interface Props {
  days?: number
  height?: number
}

export function TrendVisualization({ days = 7, height = 60 }: Props) {
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await CEODashboardService.getHistoricalTrends(days)
        setTrendData(data)
      } catch (error) {
        console.error('Failed to load trend data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrends()
  }, [days])

  if (loading || !trendData) {
    return (
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-bold uppercase tracking-wider font-['Helvetica_Neue'] text-sm">
            {days} DAY TRENDS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className={`bg-gray-800 rounded mb-4`} style={{ height: `${height}px` }}></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Simple sparkline component
  const Sparkline = ({ data, color = 'white' }: { data: number[], color?: string }) => {
    if (data.length === 0) return null

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = ((max - value) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="100%" height={height} className="border border-gray-800">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  const trends = [
    {
      title: 'SYSTEM HEALTH',
      data: trendData.systemHealth,
      color: '#10B981', // green-400
      current: trendData.systemHealth[trendData.systemHealth.length - 1],
      suffix: '%'
    },
    {
      title: 'ACTIVE AGENTS',
      data: trendData.activeAgents,
      color: '#60A5FA', // blue-400  
      current: trendData.activeAgents[trendData.activeAgents.length - 1],
      suffix: ''
    },
    {
      title: 'REVENUE',
      data: trendData.revenue,
      color: '#FBBF24', // yellow-400
      current: trendData.revenue[trendData.revenue.length - 1],
      suffix: 'K',
      format: (value: number) => (value / 1000).toFixed(0)
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {trends.map((trend) => (
        <Card key={trend.title} className="bg-black border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-bold uppercase tracking-wider font-['Helvetica_Neue'] text-xs flex items-center justify-between">
              {trend.title}
              <span style={{ color: trend.color }}>
                {trend.format ? trend.format(trend.current) : trend.current}{trend.suffix}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Sparkline data={trend.data} color={trend.color} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}