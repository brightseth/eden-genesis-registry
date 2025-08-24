/**
 * Collaboration Management API
 * Multi-curator collaborative curation workflows
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ulid } from 'ulid'
import { CollaborationSchema, type Collaboration } from '@/lib/schemas/curation.schema'

// GET - List collaborations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const curatorId = searchParams.get('curatorId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    const collaborationsPath = path.join(process.cwd(), 'data', 'collaborations', 'collaborations.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(collaborationsPath)
    } catch {
      await fs.mkdir(path.dirname(collaborationsPath), { recursive: true })
      await fs.writeFile(collaborationsPath, '[]')
    }
    
    const data = await fs.readFile(collaborationsPath, 'utf-8')
    let collaborations: Collaboration[] = JSON.parse(data)
    
    // Apply filters
    if (curatorId) {
      collaborations = collaborations.filter(c => 
        c.participants.some(p => p.curatorId === curatorId && p.active)
      )
    }
    
    if (type) {
      collaborations = collaborations.filter(c => c.type === type)
    }
    
    if (status) {
      collaborations = collaborations.filter(c => c.status === status)
    }
    
    // Sort by updated date
    collaborations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      collaborations,
      meta: {
        total: collaborations.length,
        active: collaborations.filter(c => c.status === 'active').length,
        completed: collaborations.filter(c => c.status === 'completed').length
      }
    })
    
  } catch (error) {
    console.error('Collaborations GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new collaboration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate voting rules
    if (body.votingRules) {
      const { mechanism, quorum } = body.votingRules
      if (!['unanimous', 'majority', 'weighted', 'veto'].includes(mechanism)) {
        return NextResponse.json(
          { success: false, error: 'Invalid voting mechanism' },
          { status: 400 }
        )
      }
      if (quorum < 0 || quorum > 1) {
        return NextResponse.json(
          { success: false, error: 'Quorum must be between 0 and 1' },
          { status: 400 }
        )
      }
    }
    
    // Create collaboration
    const collaborationData = {
      ...body,
      id: ulid(),
      workspace: body.workspace || { sharedNotes: [] },
      decisions: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const collaboration = CollaborationSchema.parse(collaborationData)
    
    // Load existing collaborations
    const collaborationsPath = path.join(process.cwd(), 'data', 'collaborations', 'collaborations.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(collaborationsPath)
    } catch {
      await fs.mkdir(path.dirname(collaborationsPath), { recursive: true })
      await fs.writeFile(collaborationsPath, '[]')
    }
    
    const data = await fs.readFile(collaborationsPath, 'utf-8')
    const collaborations = JSON.parse(data)
    
    // Add new collaboration
    collaborations.push(collaboration)
    
    // Save collaborations
    await fs.writeFile(collaborationsPath, JSON.stringify(collaborations, null, 2))
    
    return NextResponse.json({
      success: true,
      collaboration,
      message: `Collaboration created with ${collaboration.participants.length} participants`
    })
    
  } catch (error) {
    console.error('Collaboration creation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}