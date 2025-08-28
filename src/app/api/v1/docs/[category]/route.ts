import { NextRequest, NextResponse } from 'next/server'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

interface DocumentMeta {
  id: string
  title: string
  slug: string
  category: 'adr' | 'api' | 'technical' | 'integration'
  summary: string
  lastModified: string
  status: 'draft' | 'published' | 'archived'
}

function getDocsPath(): string {
  return join(process.cwd(), 'docs')
}

function parseMarkdownFile(filePath: string, category: string): DocumentMeta | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const { data: frontMatter, content: markdownContent } = matter(content)
    const stats = statSync(filePath)
    
    const filename = filePath.split('/').pop() || ''
    const slug = filename.replace('.md', '')
    
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
    
    return {
      id: `${category}-${slug}`,
      title,
      slug,
      category: category as DocumentMeta['category'],
      summary,
      lastModified: stats.mtime.toISOString(),
      status: frontMatter.status || 'published'
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

function getDocumentsByCategory(category: string): DocumentMeta[] {
  const docsPath = getDocsPath()
  const documents: DocumentMeta[] = []
  
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
      return []
  }
  
  try {
    if (!statSync(categoryPath).isDirectory()) return []
    
    const files = readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .filter(file => {
        // For non-adr categories, filter by filename patterns
        if (category !== 'adr') {
          const upperFile = file.toUpperCase()
          switch (category) {
            case 'api':
              return upperFile.includes('API') || upperFile.includes('ENDPOINT')
            case 'technical':
              return upperFile.includes('SPEC') || upperFile.includes('SCHEMA') || upperFile.includes('FRAMEWORK')
            case 'integration':
              return upperFile.includes('INTEGRATION') || upperFile.includes('MIGRATION') || upperFile.includes('GUIDE')
            default:
              return false
          }
        }
        return true
      })
    
    for (const file of files) {
      const filePath = join(categoryPath, file)
      const doc = parseMarkdownFile(filePath, category)
      if (doc) documents.push(doc)
    }
  } catch (error) {
    console.error(`Error reading category ${category}:`, error)
    return []
  }
  
  return documents.sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )
}

// GET /api/v1/docs/[category]
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params
    
    // Validate category
    const validCategories = ['adr', 'api', 'technical', 'integration']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }
    
    const documents = getDocumentsByCategory(category)
    
    return NextResponse.json({
      category,
      documents,
      count: documents.length
    })
    
  } catch (error) {
    console.error(`Error fetching ${params.category} documents:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}