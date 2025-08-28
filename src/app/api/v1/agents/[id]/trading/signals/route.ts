import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/middleware/auth'

// GET /api/v1/agents/{id}/trading/signals
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const where: any = { agentId }
    if (status) {
      where.status = status.toUpperCase()
    }

    const signals = await prisma.tradingSignal.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // ACTIVE signals first
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Convert Decimal fields to numbers for JSON serialization
    const serializedSignals = signals.map(signal => ({
      ...signal,
      confidence: Number(signal.confidence),
      targetPrice: signal.targetPrice ? Number(signal.targetPrice) : null,
      stopLoss: signal.stopLoss ? Number(signal.stopLoss) : null
    }))

    return NextResponse.json({ 
      signals: serializedSignals,
      total: signals.length,
      activeSignals: signals.filter(s => s.status === 'ACTIVE').length,
      filledSignals: signals.filter(s => s.status === 'FILLED').length,
      expiredSignals: signals.filter(s => s.status === 'EXPIRED').length
    })
  } catch (error) {
    console.error('Failed to get trading signals:', error)
    return NextResponse.json(
      { error: 'Failed to get trading signals' },
      { status: 500 }
    )
  }
}

// POST /api/v1/agents/{id}/trading/signals - Create new signal
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
      signal, 
      confidence, 
      reasoning,
      targetPrice,
      stopLoss,
      timeframe,
      performance 
    } = body

    const tradingSignal = await prisma.tradingSignal.create({
      data: {
        agentId,
        symbol: symbol.toUpperCase(),
        signal: signal.toUpperCase(),
        confidence: parseFloat(confidence),
        reasoning: reasoning || null,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        timeframe: timeframe || null,
        status: 'ACTIVE',
        performance: performance || null
      }
    })

    // Serialize for JSON response
    const serializedSignal = {
      ...tradingSignal,
      confidence: Number(tradingSignal.confidence),
      targetPrice: tradingSignal.targetPrice ? Number(tradingSignal.targetPrice) : null,
      stopLoss: tradingSignal.stopLoss ? Number(tradingSignal.stopLoss) : null
    }

    return NextResponse.json(serializedSignal, { status: 201 })
  } catch (error) {
    console.error('Failed to create trading signal:', error)
    return NextResponse.json(
      { error: 'Failed to create trading signal' },
      { status: 500 }
    )
  }
}