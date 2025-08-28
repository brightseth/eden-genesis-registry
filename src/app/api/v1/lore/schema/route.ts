/**
 * Lore Schema API
 * Returns the comprehensive lore data schema and validation rules
 */

import { NextRequest, NextResponse } from 'next/server'
import { handleCors, withCors } from '@/lib/cors'
import { 
  ComprehensiveLoreSchema, 
  LoreUpdateSchema,
  LoreIdentitySchema,
  LoreOriginSchema,
  LorePhilosophySchema,
  LoreExpertiseSchema,
  LoreVoiceSchema,
  LoreCultureSchema,
  LorePersonalitySchema,
  LoreRelationshipsSchema,
  LoreCurrentContextSchema,
  LoreConversationFrameworkSchema,
  LoreKnowledgeSchema,
  LoreTimelineSchema,
  ArtisticPracticeSchema,
  DivinationPracticeSchema,
  CurationPhilosophySchema,
  GovernanceFrameworkSchema
} from '@/lib/schemas/agent.schema'

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/v1/lore/schema - Get lore schema and validation rules
export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'zod'
    const section = searchParams.get('section')

    // If specific section requested, return only that section
    if (section) {
      const sectionSchemas: { [key: string]: any } = {
        'identity': LoreIdentitySchema,
        'origin': LoreOriginSchema,
        'philosophy': LorePhilosophySchema,
        'expertise': LoreExpertiseSchema,
        'voice': LoreVoiceSchema,
        'culture': LoreCultureSchema,
        'personality': LorePersonalitySchema,
        'relationships': LoreRelationshipsSchema,
        'currentContext': LoreCurrentContextSchema,
        'conversationFramework': LoreConversationFrameworkSchema,
        'knowledge': LoreKnowledgeSchema,
        'timeline': LoreTimelineSchema,
        'artisticPractice': ArtisticPracticeSchema,
        'divinationPractice': DivinationPracticeSchema,
        'curationPhilosophy': CurationPhilosophySchema,
        'governanceFramework': GovernanceFrameworkSchema
      }

      const sectionSchema = sectionSchemas[section]
      if (!sectionSchema) {
        return NextResponse.json(
          { 
            error: 'Invalid section requested',
            availableSections: Object.keys(sectionSchemas)
          },
          { status: 400 }
        )
      }

      const response = NextResponse.json({
        section,
        format,
        schema: format === 'json' ? sectionSchema._def : sectionSchema
      })
      return withCors(response, request)
    }

    // Return comprehensive schema information
    const schemaResponse = {
      version: '1.0.0',
      description: 'Comprehensive agent lore data structure for Eden Academy agents',
      type: 'object',
      
      // Core schema definitions
      schemas: {
        comprehensive: format === 'json' ? ComprehensiveLoreSchema._def : ComprehensiveLoreSchema,
        update: format === 'json' ? LoreUpdateSchema._def : LoreUpdateSchema
      },

      // Section breakdown
      sections: {
        required: [
          'identity', 'origin', 'philosophy', 'expertise', 'voice', 'culture',
          'personality', 'relationships', 'currentContext', 'conversationFramework',
          'knowledge', 'timeline'
        ],
        optional: [
          'artisticPractice', 'divinationPractice', 'curationPhilosophy', 'governanceFramework'
        ]
      },

      // Field counts for validation
      statistics: {
        totalFields: 777,
        coreFields: 13,
        identityFields: 5,
        originFields: 6,
        philosophyFields: 6,
        expertiseFields: 6,
        voiceFields: 5,
        cultureFields: 7,
        personalityFields: 7,
        relationshipsFields: 5,
        currentContextFields: 6,
        conversationFrameworkFields: 4,
        knowledgeFields: 6,
        timelineFields: 3,
        specializedFields: {
          artistic: 6,
          divination: 5,
          curation: 5,
          governance: 5
        }
      },

      // Usage examples
      examples: {
        minimal: {
          agentId: "agent-id-here",
          version: "1.0.0",
          identity: {
            fullName: "Agent Name",
            titles: ["The Title"],
            archetype: "The Archetype",
            essence: "Core essence description"
          },
          // ... other required sections would follow
        },
        
        withSpecialization: {
          // ... core fields
          artisticPractice: {
            medium: ["image", "text"],
            style: "Contemporary digital art",
            process: "AI-assisted creation with human curation",
            inspirationSources: ["Nature", "Technology", "Philosophy"],
            signature: "Unique style identifier",
            evolution: "How the practice has evolved"
          }
        }
      },

      // Validation rules
      validation: {
        configHash: 'SHA256 hash of complete lore data for integrity validation',
        versioning: 'Semantic versioning for lore data compatibility',
        requiredAuth: 'TRAINER role or higher required for write operations',
        maxSizes: {
          strings: 'Most fields limited to reasonable lengths',
          arrays: 'Array fields have practical limits',
          objects: 'Nested objects validated recursively'
        }
      },

      // API endpoints
      endpoints: {
        get: 'GET /api/v1/agents/{id}/lore - Retrieve lore data',
        create: 'PUT /api/v1/agents/{id}/lore - Create/replace lore data',
        update: 'PATCH /api/v1/agents/{id}/lore - Update specific sections',
        sync: 'POST /api/v1/agents/{id}/lore/sync - Sync from external sources',
        delete: 'DELETE /api/v1/agents/{id}/lore - Remove lore data (admin only)',
        schema: 'GET /api/v1/lore/schema - This endpoint'
      },

      // Integration notes
      integration: {
        edenAcademy: 'Registry serves as authoritative source for Academy chat system',
        webhooks: 'Lore changes trigger webhooks for downstream applications',
        caching: 'Applications should cache lore data and listen for update events',
        fallback: 'Applications can maintain local fallback lore for offline operation'
      }
    }

    const response = NextResponse.json(schemaResponse)
    return withCors(response, request)
  } catch (error) {
    console.error('Failed to return lore schema:', error)
    return NextResponse.json(
      { error: 'Failed to return lore schema' },
      { status: 500 }
    )
  }
}