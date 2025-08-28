#!/usr/bin/env npx tsx

/**
 * Documentation Migration Script
 * Moves Registry-related ADRs from Academy to Registry and creates deprecation notices
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { sendWebhook, DOCUMENTATION_EVENTS } from '../src/lib/webhooks'

interface DocumentMigration {
  academyPath: string
  registryPath: string
  title: string
  deprecated: boolean
}

const REGISTRY_ADRS_TO_MIGRATE: DocumentMigration[] = [
  {
    academyPath: 'docs/adr/019-registry-integration-pattern.md',
    registryPath: 'docs/adr/ADR-019-registry-integration-pattern.md',
    title: 'ADR-019: Registry Integration Pattern',
    deprecated: false
  },
  {
    academyPath: 'docs/adr/022-registry-first-architecture-pattern.md', 
    registryPath: 'docs/adr/ADR-022-registry-first-architecture-pattern.md',
    title: 'ADR-022: Registry-First Architecture Pattern',
    deprecated: false
  }
]

const ACADEMY_DOCS_TO_DEPRECATE = [
  'docs/registry-integration-guide.md',
  'docs/registry-architecture-guide.md'
]

function createDeprecationNotice(title: string, newLocation: string): string {
  return `---
status: DEPRECATED
deprecated_date: ${new Date().toISOString().split('T')[0]}
replacement: ${newLocation}
---

# ⚠️ DEPRECATED: ${title}

This document has been **deprecated** and moved to the Registry documentation system.

## New Location
📚 **Current Documentation**: ${newLocation}

## Why This Changed
As part of ADR-001 (Documentation Consolidation), all Registry architectural documentation now lives in the Registry itself to maintain the Registry as the single source of truth.

## What You Should Do
1. **Update bookmarks** to point to the new Registry documentation API
2. **Use the Registry API** to access current documentation: \`GET /api/v1/docs/adr/\`
3. **Academy integration** will automatically fetch Registry docs via API

## Migration Date
${new Date().toISOString().split('T')[0]}

---

**This file will be removed in a future release. Please update your references.**
`
}

async function migrateDocument(migration: DocumentMigration): Promise<boolean> {
  const academyFullPath = join(process.cwd(), '..', 'eden-academy', migration.academyPath)
  const registryFullPath = join(process.cwd(), migration.registryPath)
  
  console.log(`📄 Migrating: ${migration.title}`)
  console.log(`   From: ${academyFullPath}`)
  console.log(`   To: ${registryFullPath}`)
  
  // Check if Academy document exists
  if (!existsSync(academyFullPath)) {
    console.log(`   ❌ Academy document not found: ${academyFullPath}`)
    return false
  }
  
  try {
    // Read Academy document
    const academyContent = readFileSync(academyFullPath, 'utf-8')
    
    // Add Registry metadata to frontmatter
    const registryContent = `---
title: ${migration.title}
status: active
category: adr
migrated_from: academy
migration_date: ${new Date().toISOString()}
---

${academyContent.replace(/^---[\\s\\S]*?---\\n?/, '')}`
    
    // Write to Registry
    writeFileSync(registryFullPath, registryContent)
    console.log(`   ✅ Document migrated to Registry`)
    
    // Create deprecation notice in Academy
    const deprecationNotice = createDeprecationNotice(
      migration.title,
      `https://registry.eden.art/api/v1/docs/adr/${migration.registryPath.split('/').pop()?.replace('.md', '')}`
    )
    
    writeFileSync(academyFullPath, deprecationNotice)
    console.log(`   ✅ Deprecation notice created in Academy`)
    
    // Send webhook notification
    try {
      await sendWebhook('documentation.adr.migrated', {
        title: migration.title,
        from: 'academy',
        to: 'registry',
        registryPath: migration.registryPath,
        migratedAt: new Date().toISOString()
      })
      console.log(`   ✅ Webhook notification sent`)
    } catch (webhookError) {
      console.log(`   ⚠️  Webhook failed: ${webhookError}`)
    }
    
    return true
  } catch (error) {
    console.error(`   ❌ Migration failed: ${error}`)
    return false
  }
}

async function deprecateDocument(docPath: string): Promise<boolean> {
  const academyFullPath = join(process.cwd(), '..', 'eden-academy', docPath)
  
  console.log(`🗃️  Deprecating: ${docPath}`)
  
  if (!existsSync(academyFullPath)) {
    console.log(`   ❌ Document not found: ${academyFullPath}`)
    return false
  }
  
  try {
    const originalContent = readFileSync(academyFullPath, 'utf-8')
    const title = originalContent.match(/^#\\s+(.+)$/m)?.[1] || docPath.split('/').pop()?.replace('.md', '')
    
    const deprecationNotice = createDeprecationNotice(
      title || 'Registry Documentation',
      'https://registry.eden.art/api/v1/docs/'
    )
    
    // Backup original content
    writeFileSync(academyFullPath + '.backup', originalContent)
    
    // Replace with deprecation notice
    writeFileSync(academyFullPath, deprecationNotice)
    
    console.log(`   ✅ Document deprecated (backup created)`)
    return true
  } catch (error) {
    console.error(`   ❌ Deprecation failed: ${error}`)
    return false
  }
}

async function main() {
  console.log('🚀 Starting Registry Documentation Migration')
  console.log('=' .repeat(50))
  
  let migratedCount = 0
  let deprecatedCount = 0
  
  // Migrate Registry ADRs
  console.log('\\n📋 Migrating Registry ADRs...')
  for (const migration of REGISTRY_ADRS_TO_MIGRATE) {
    const success = await migrateDocument(migration)
    if (success) migratedCount++
  }
  
  // Deprecate other Academy Registry docs
  console.log('\\n🗃️  Deprecating Academy Registry documentation...')
  for (const docPath of ACADEMY_DOCS_TO_DEPRECATE) {
    const success = await deprecateDocument(docPath)
    if (success) deprecatedCount++
  }
  
  // Summary
  console.log('\\n' + '=' .repeat(50))
  console.log('✅ Migration Complete!')
  console.log(`📄 Migrated: ${migratedCount} documents`)
  console.log(`🗃️  Deprecated: ${deprecatedCount} documents`)
  
  if (migratedCount > 0 || deprecatedCount > 0) {
    console.log('\\n🔄 Next Steps:')
    console.log('1. Update Academy to consume Registry docs via API')
    console.log('2. Test Registry documentation API endpoints')
    console.log('3. Notify teams of the documentation consolidation')
    console.log('4. Remove backup files after verification')
  }
}

// Run migration
main().catch(console.error)