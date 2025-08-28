import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/middleware/auth'

// GET /api/v1/agents/{id}/trading/metrics
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'ALL_TIME'
    
    // Get existing metrics or calculate on-the-fly
    let metrics = await prisma.tradingMetrics.findFirst({
      where: { 
        agentId,
        period: period.toUpperCase()
      },
      orderBy: { updatedAt: 'desc' }
    })

    // If no metrics exist, calculate them from positions
    if (!metrics) {
      metrics = await calculateTradingMetrics(agentId, period.toUpperCase())
    }

    if (!metrics) {
      return NextResponse.json({ 
        metrics: null,
        message: 'No trading activity found'
      })
    }

    // Convert Decimal fields to numbers for JSON serialization
    const serializedMetrics = {
      ...metrics,
      winRate: Number(metrics.winRate),
      totalPnl: Number(metrics.totalPnl),
      totalPnlPercent: Number(metrics.totalPnlPercent),
      averageWin: Number(metrics.averageWin),
      averageLoss: Number(metrics.averageLoss),
      profitFactor: Number(metrics.profitFactor),
      sharpeRatio: metrics.sharpeRatio ? Number(metrics.sharpeRatio) : null,
      maxDrawdown: metrics.maxDrawdown ? Number(metrics.maxDrawdown) : null,
      volume: Number(metrics.volume)
    }

    return NextResponse.json({ 
      metrics: serializedMetrics
    })
  } catch (error) {
    console.error('Failed to get trading metrics:', error)
    return NextResponse.json(
      { error: 'Failed to get trading metrics' },
      { status: 500 }
    )
  }
}

// Calculate trading metrics from positions
async function calculateTradingMetrics(agentId: string, period: string) {
  try {
    // Get all closed positions for the agent
    const positions = await prisma.tradingPosition.findMany({
      where: { 
        agentId,
        status: 'CLOSED'
      },
      orderBy: { closedAt: 'asc' }
    })

    if (positions.length === 0) {
      return null
    }

    // Calculate metrics
    const totalTrades = positions.length
    const winningTrades = positions.filter(p => Number(p.pnl) > 0).length
    const losingTrades = positions.filter(p => Number(p.pnl) < 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    const totalPnl = positions.reduce((sum, p) => sum + Number(p.pnl), 0)
    const totalVolume = positions.reduce((sum, p) => sum + (Number(p.entryPrice) * Number(p.quantity)), 0)
    const totalPnlPercent = totalVolume > 0 ? (totalPnl / totalVolume) * 100 : 0

    const winningPositions = positions.filter(p => Number(p.pnl) > 0)
    const losingPositions = positions.filter(p => Number(p.pnl) < 0)

    const averageWin = winningPositions.length > 0 ? 
      winningPositions.reduce((sum, p) => sum + Number(p.pnl), 0) / winningPositions.length : 0
    const averageLoss = losingPositions.length > 0 ? 
      losingPositions.reduce((sum, p) => sum + Number(p.pnl), 0) / losingPositions.length : 0

    const grossProfit = winningPositions.reduce((sum, p) => sum + Number(p.pnl), 0)
    const grossLoss = Math.abs(losingPositions.reduce((sum, p) => sum + Number(p.pnl), 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

    // Calculate max drawdown (simplified)
    let maxDrawdown = 0
    let runningBalance = 0
    let peak = 0
    
    for (const position of positions) {
      runningBalance += Number(position.pnl)
      if (runningBalance > peak) {
        peak = runningBalance
      } else {
        const drawdown = ((peak - runningBalance) / peak) * 100
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown
        }
      }
    }

    // Determine date range
    const startDate = positions[0].openedAt
    const endDate = positions[positions.length - 1].closedAt || new Date()

    // Create or update metrics record
    const metrics = await prisma.tradingMetrics.upsert({
      where: {
        id: `${agentId}-${period}`
      },
      update: {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalPnl,
        totalPnlPercent,
        averageWin,
        averageLoss,
        profitFactor,
        maxDrawdown,
        volume: totalVolume,
        endDate,
        metadata: {
          calculatedAt: new Date().toISOString(),
          positionsAnalyzed: positions.length
        }
      },
      create: {
        id: `${agentId}-${period}`,
        agentId,
        period,
        startDate,
        endDate,
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalPnl,
        totalPnlPercent,
        averageWin,
        averageLoss,
        profitFactor,
        maxDrawdown,
        volume: totalVolume,
        metadata: {
          calculatedAt: new Date().toISOString(),
          positionsAnalyzed: positions.length
        }
      }
    })

    return metrics
  } catch (error) {
    console.error('Failed to calculate trading metrics:', error)
    return null
  }
}

// POST /api/v1/agents/{id}/trading/metrics - Recalculate metrics
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const agentId = params.id
    const body = await request.json()
    const { period = 'ALL_TIME' } = body

    const metrics = await calculateTradingMetrics(agentId, period.toUpperCase())

    if (!metrics) {
      return NextResponse.json(
        { error: 'No trading positions found to calculate metrics' },
        { status: 404 }
      )
    }

    // Serialize for JSON response
    const serializedMetrics = {
      ...metrics,
      winRate: Number(metrics.winRate),
      totalPnl: Number(metrics.totalPnl),
      totalPnlPercent: Number(metrics.totalPnlPercent),
      averageWin: Number(metrics.averageWin),
      averageLoss: Number(metrics.averageLoss),
      profitFactor: Number(metrics.profitFactor),
      sharpeRatio: metrics.sharpeRatio ? Number(metrics.sharpeRatio) : null,
      maxDrawdown: metrics.maxDrawdown ? Number(metrics.maxDrawdown) : null,
      volume: Number(metrics.volume)
    }

    return NextResponse.json(serializedMetrics, { status: 201 })
  } catch (error) {
    console.error('Failed to calculate trading metrics:', error)
    return NextResponse.json(
      { error: 'Failed to calculate trading metrics' },
      { status: 500 }
    )
  }
}