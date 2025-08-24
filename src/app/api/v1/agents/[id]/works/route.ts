/**
 * Standardized Agent Works API
 * Consistent framework for accessing any agent's generated content
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const searchParams = request.nextUrl.searchParams
    
    // Standard query parameters for all agents
    const contentType = searchParams.get('type') || 'all' // works, writings, audio, video
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const format = searchParams.get('format') || 'full' // full, minimal, ids
    
    // Content filters
    const status = searchParams.get('status') // published, draft, curated
    const featured = searchParams.get('featured')
    const theme = searchParams.get('theme')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    
    // Load agent's works from Registry
    const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    
    try {
      const data = await fs.readFile(worksPath, 'utf-8')
      let works = JSON.parse(data)
      
      // Apply standard filters
      if (contentType !== 'all') {
        works = works.filter((w: any) => w.medium === contentType)
      }
      
      if (status) {
        works = works.filter((w: any) => w.status === status)
      }
      
      if (featured !== null) {
        works = works.filter((w: any) => w.featured === (featured === 'true'))
      }
      
      if (theme) {
        works = works.filter((w: any) => w.themes?.includes(theme))
      }
      
      if (dateFrom) {
        works = works.filter((w: any) => new Date(w.createdAt) >= new Date(dateFrom))
      }
      
      if (dateTo) {
        works = works.filter((w: any) => new Date(w.createdAt) <= new Date(dateTo))
      }
      
      if (search) {
        const searchLower = search.toLowerCase()
        works = works.filter((w: any) => 
          w.title?.toLowerCase().includes(searchLower) ||
          w.description?.toLowerCase().includes(searchLower) ||
          w.prompt?.toLowerCase().includes(searchLower)
        )
      }
      
      // Sort
      works.sort((a: any, b: any) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        const order = sortOrder === 'asc' ? 1 : -1
        
        if (aVal < bVal) return -order
        if (aVal > bVal) return order
        return 0
      })
      
      // Pagination
      const total = works.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedWorks = works.slice(startIndex, endIndex)
      
      // Format response based on requested format
      let formattedWorks = paginatedWorks
      
      if (format === 'minimal') {
        formattedWorks = paginatedWorks.map((w: any) => ({
          id: w.id,
          title: w.title,
          type: w.type,
          medium: w.medium,
          thumbnail: w.files?.[0]?.url,
          createdAt: w.createdAt
        }))
      } else if (format === 'ids') {
        formattedWorks = paginatedWorks.map((w: any) => w.id)
      }
      
      // Standard API response structure
      return NextResponse.json({
        success: true,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        data: formattedWorks,
        meta: {
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: endIndex < total,
            hasPrev: page > 1
          },
          filters: {
            contentType,
            status,
            featured,
            theme,
            dateFrom,
            dateTo,
            search
          },
          sort: {
            by: sortBy,
            order: sortOrder
          }
        },
        links: {
          self: `/api/v1/agents/${agentId}/works?page=${page}`,
          next: endIndex < total ? `/api/v1/agents/${agentId}/works?page=${page + 1}` : null,
          prev: page > 1 ? `/api/v1/agents/${agentId}/works?page=${page - 1}` : null,
          curate: `/api/v1/agents/${agentId}/curate`,
          stats: `/api/v1/agents/${agentId}/stats`
        }
      })
      
    } catch (error) {
      // Agent not found or no works yet
      return NextResponse.json({
        success: false,
        error: `No works found for agent ${agentId}`,
        agent: {
          id: agentId,
          handle: agentId.split('-')[0]
        },
        data: [],
        meta: {
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Agent works API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}