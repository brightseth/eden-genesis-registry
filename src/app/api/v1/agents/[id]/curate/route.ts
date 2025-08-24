/**
 * Standardized Agent Curation API
 * Consistent framework for curating any agent's content
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// POST - Apply curation action
export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params
    const body = await request.json()
    const { workId, action, metadata } = body
    
    // Standard curation actions for all agents
    const validActions = [
      'feature',      // Mark as featured
      'curate',       // Add to curated collection
      'tag',          // Add tags
      'score',        // Quality score
      'collect',      // Add to collection
      'exhibit',      // Add to exhibition
      'annotate',     // Add curator notes
      'approve',      // Approve for publication
      'archive'       // Archive work
    ]
    
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Valid actions: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Load agent's works
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      const works = JSON.parse(data)
      
      // Find work to curate
      const workIndex = works.findIndex((w: any) => w.id === workId)
      if (workIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Work not found' },
          { status: 404 }
        )
      }
      
      const work = works[workIndex]
      const timestamp = new Date().toISOString()
      
      // Initialize curation data if needed
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
      
      // Apply curation action
      switch (action) {
        case 'feature':
          work.curation.featured = metadata.value !== false
          work.curation.featuredAt = timestamp
          work.curation.featuredBy = metadata.curatorId
          break
          
        case 'curate':
          work.curation.curated = true
          work.curation.curatedAt = timestamp
          work.curation.curatedBy = metadata.curatorId
          break
          
        case 'tag':
          work.curation.tags = [...new Set([...work.curation.tags, ...(metadata.tags || [])])]
          break
          
        case 'score':
          work.curation.score = metadata.score
          work.curation.scoredAt = timestamp
          work.curation.scoredBy = metadata.curatorId
          break
          
        case 'collect':
          if (!work.curation.collections.includes(metadata.collectionId)) {
            work.curation.collections.push({
              id: metadata.collectionId,
              name: metadata.collectionName,
              addedAt: timestamp,
              addedBy: metadata.curatorId
            })
          }
          break
          
        case 'exhibit':
          work.curation.exhibitions.push({
            id: metadata.exhibitionId,
            name: metadata.exhibitionName,
            venue: metadata.venue,
            dates: metadata.dates,
            addedAt: timestamp,
            curatedBy: metadata.curatorId
          })
          break
          
        case 'annotate':
          work.curation.annotations.push({
            note: metadata.note,
            type: metadata.noteType || 'general',
            author: metadata.curatorId,
            timestamp
          })
          break
          
        case 'approve':
          work.status = 'published'
          work.publishedAt = timestamp
          work.approvedBy = metadata.curatorId
          break
          
        case 'archive':
          work.status = 'archived'
          work.archivedAt = timestamp
          work.archivedBy = metadata.curatorId
          break
      }
      
      // Add to curation history
      work.curation.history.push({
        action,
        metadata,
        timestamp,
        curatorId: metadata.curatorId
      })
      
      work.lastModified = timestamp
      
      // Save updated works
      await fs.writeFile(worksPath, JSON.stringify(works, null, 2))
      
      return NextResponse.json({
        success: true,
        message: `Successfully applied ${action} to work ${workId}`,
        work: {
          id: work.id,
          title: work.title,
          curation: work.curation
        }
      })
      
    } catch (error) {
      return NextResponse.json(
        { success: false, error: `Agent ${agentId} not found` },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('Curation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get curation status
export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params
    const searchParams = request.nextUrl.searchParams
    const workId = searchParams.get('workId')
    const onlyCurated = searchParams.get('curated') === 'true'
    
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      let works = JSON.parse(data)
      
      if (workId) {
        // Return specific work's curation data
        const work = works.find((w: any) => w.id === workId)
        if (!work) {
          return NextResponse.json(
            { success: false, error: 'Work not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json({
          success: true,
          workId,
          curation: work.curation || {}
        })
      }
      
      // Return all curated works
      if (onlyCurated) {
        works = works.filter((w: any) => 
          w.curation?.curated || 
          w.curation?.featured || 
          w.curation?.score > 0
        )
      }
      
      return NextResponse.json({
        success: true,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        curatedCount: works.filter((w: any) => w.curation?.curated).length,
        featuredCount: works.filter((w: any) => w.curation?.featured).length,
        works: works.map((w: any) => ({
          id: w.id,
          title: w.title,
          curation: w.curation || {}
        }))
      })
      
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: `No data found for agent ${agentId}`,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        }
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Curation GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}