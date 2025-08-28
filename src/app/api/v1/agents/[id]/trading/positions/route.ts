import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/middleware/auth'

// GET /api/v1/agents/{id}/trading/positions
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    
    // Get trading positions for the agent
    const positions = await prisma.tradingPosition.findMany({
      where: { agentId },
      orderBy: [
        { status: 'asc' }, // OPEN positions first
        { openedAt: 'desc' }
      ]
    })

    // Convert Decimal fields to numbers for JSON serialization
    const serializedPositions = positions.map(position => ({
      ...position,
      quantity: Number(position.quantity),
      entryPrice: Number(position.entryPrice),
      currentPrice: position.currentPrice ? Number(position.currentPrice) : null,
      pnl: Number(position.pnl),
      pnlPercent: Number(position.pnlPercent)
    }))

    return NextResponse.json({ 
      positions: serializedPositions,
      total: positions.length,
      openPositions: positions.filter(p => p.status === 'OPEN').length,
      closedPositions: positions.filter(p => p.status === 'CLOSED').length
    })
  } catch (error) {
    console.error('Failed to get trading positions:', error)
    return NextResponse.json(
      { error: 'Failed to get trading positions' },
      { status: 500 }
    )
  }
}

// POST /api/v1/agents/{id}/trading/positions - Create new position
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const agentId = params.id
    const body = await request.json()
    const { 
      symbol, 
      side, 
      quantity, 
      entryPrice, 
      currentPrice,
      metadata 
    } = body

    // Calculate initial P&L
    const pnl = currentPrice ? (currentPrice - entryPrice) * quantity * (side === 'LONG' ? 1 : -1) : 0
    const pnlPercent = entryPrice !== 0 ? (pnl / (entryPrice * quantity)) * 100 : 0

    const position = await prisma.tradingPosition.create({
      data: {
        agentId,
        symbol: symbol.toUpperCase(),
        side: side.toUpperCase(),
        quantity: parseFloat(quantity),
        entryPrice: parseFloat(entryPrice),
        currentPrice: currentPrice ? parseFloat(currentPrice) : null,
        pnl,
        pnlPercent,
        status: 'OPEN',
        metadata: metadata || {}
      }
    })

    // Serialize for JSON response
    const serializedPosition = {
      ...position,
      quantity: Number(position.quantity),
      entryPrice: Number(position.entryPrice),
      currentPrice: position.currentPrice ? Number(position.currentPrice) : null,
      pnl: Number(position.pnl),
      pnlPercent: Number(position.pnlPercent)
    }

    return NextResponse.json(serializedPosition, { status: 201 })
  } catch (error) {
    console.error('Failed to create trading position:', error)
    return NextResponse.json(
      { error: 'Failed to create trading position' },
      { status: 500 }
    )
  }
}