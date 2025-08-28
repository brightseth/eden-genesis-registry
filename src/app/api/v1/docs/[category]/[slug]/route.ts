import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { sendWebhook, type DocumentationEvent } from '@/lib/webhooks'

interface DocumentContent {
  id: string
  title: string
  slug: string
  category: 'adr' | 'api' | 'technical' | 'integration'
  summary: string
  lastModified: string
  status: 'draft' | 'published' | 'archived'
  content: string
  metadata: Record<string, unknown>
  tableOfContents: Array<{
    level: number
    title: string
    anchor: string
  }>
}

function getDocsPath(): string {
  return join(process.cwd(), 'docs')
}

function generateTableOfContents(content: string): Array<{ level: number; title: string; anchor: string }> {
  const headings = content.match(/^(#{1,6})\s+(.+)$/gm) || []
  
  return headings.map(heading => {
    const match = heading.match(/^(#{1,6})\s+(.+)$/)
    if (!match) return null
    
    const level = match[1].length
    const title = match[2].trim()
    const anchor = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    
    return { level, title, anchor }
  }).filter(Boolean) as Array<{ level: number; title: string; anchor: string }>
}

function getDocumentPath(category: string, slug: string): string | null {
  const docsPath = getDocsPath()
  
  let categoryPath: string
  
  switch (category) {
    case 'adr':
      categoryPath = join(docsPath, 'adr')
      break
    case 'api':
    case 'technical':
    case 'integration':
      categoryPath = docsPath
      break
    default:
      return null
  }
  
  const filePath = join(categoryPath, `${slug}.md`)
  
  try {
    statSync(filePath)
    return filePath
  } catch {
    return null
  }
}

async function parseDocument(filePath: string, category: string, slug: string): Promise<DocumentContent | null> {
  try {
    const fileContent = readFileSync(filePath, 'utf-8')
    const { data: frontMatter, content: markdownContent } = matter(fileContent)
    const stats = statSync(filePath)
    
    let title = frontMatter.title || slug.replace(/-/g, ' ')
    if (!frontMatter.title && markdownContent) {
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
      if (titleMatch) title = titleMatch[1]
    }
    
    let summary = frontMatter.summary || ''
    if (!summary && markdownContent) {
      const summaryMatch = markdownContent.match(/^(?!#)(.+)$/m)
      if (summaryMatch) {
        summary = summaryMatch[1].substring(0, 150) + '...'
      }
    }
    
    const tableOfContents = generateTableOfContents(markdownContent)
    
    return {
      id: `${category}-${slug}`,
      title,
      slug,
      category: category as DocumentContent['category'],
      summary,
      lastModified: stats.mtime.toISOString(),
      status: frontMatter.status || 'published',
      content: markdownContent,
      metadata: {
        ...frontMatter,
        wordCount: markdownContent.split(/\s+/).length,
        readingTime: Math.ceil(markdownContent.split(/\s+/).length / 200) // ~200 words per minute
      },
      tableOfContents
    }
  } catch (error) {
    console.error(`Error parsing document ${filePath}:`, error)
    return null
  }
}

// GET /api/v1/docs/[category]/[slug]
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params
    
    // Validate category
    const validCategories = ['adr', 'api', 'technical', 'integration']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }
    
    const filePath = getDocumentPath(category, slug)
    if (!filePath) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    const document = await parseDocument(filePath, category, slug)
    if (!document) {
      return NextResponse.json(
        { error: 'Failed to parse document' },
        { status: 500 }
      )
    }
    
    // Send webhook for document access analytics
    await sendWebhook(`documentation.${category}.accessed` as DocumentationEvent, {
      documentId: document.id,
      category,
      slug,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown'
    }).catch(error => {
      console.error('Failed to send documentation webhook:', error)
    })
    
    return NextResponse.json(document)
    
  } catch (error) {
    console.error(`Error fetching document ${params.category}/${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}