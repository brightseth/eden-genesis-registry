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
    
    // Extract title from frontmatter or first heading
    let title = frontMatter.title || slug.replace(/-/g, ' ')
    if (!frontMatter.title && markdownContent) {
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
      if (titleMatch) title = titleMatch[1]
    }
    
    // Extract summary from frontmatter or first paragraph
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

function getAllDocuments(): DocumentMeta[] {
  const docsPath = getDocsPath()
  const documents: DocumentMeta[] = []
  
  const categories = [
    { name: 'adr', path: 'adr' },
    { name: 'api', path: '.' },
    { name: 'technical', path: '.' },
    { name: 'integration', path: '.' }
  ]
  
  for (const category of categories) {
    const categoryPath = join(docsPath, category.path)
    
    try {
      if (!statSync(categoryPath).isDirectory()) continue
      
      const files = readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))
      
      for (const file of files) {
        const filePath = join(categoryPath, file)
        const doc = parseMarkdownFile(filePath, category.name)
        if (doc) documents.push(doc)
      }
    } catch (error) {
      // Directory might not exist, skip
      continue
    }
  }
  
  return documents.sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )
}

// GET /api/v1/docs
export async function GET(request: NextRequest) {
  try {
    const documents = getAllDocuments()
    
    // Group by category for summary
    const categories = [
      { name: 'Architecture Decision Records', slug: 'adr', count: 0 },
      { name: 'API Documentation', slug: 'api', count: 0 },
      { name: 'Technical Specifications', slug: 'technical', count: 0 },
      { name: 'Integration Guides', slug: 'integration', count: 0 }
    ]
    
    documents.forEach(doc => {
      const category = categories.find(cat => cat.slug === doc.category)
      if (category) category.count++
    })
    
    return NextResponse.json({
      categories: categories.filter(cat => cat.count > 0),
      documents: documents.slice(0, 10), // Latest 10 documents
      total: documents.length
    })
    
  } catch (error) {
    console.error('Error fetching documentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documentation' },
      { status: 500 }
    )
  }
}