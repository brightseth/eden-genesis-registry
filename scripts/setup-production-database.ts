#!/usr/bin/env tsx

/**
 * Production Database Setup Script
 * Sets up and seeds the production Registry database
 */

import { PrismaClient, AgentStatus, Visibility, ChecklistTemplate } from '@prisma/client'
import { CHECKLIST_TEMPLATES } from '../src/lib/progress'

const productionDatabaseUrl = "postgresql://postgres.avzafhqjohminbptrbdp:Krist1420s!@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: productionDatabaseUrl,
    },
  },
})

type AgentSeed = {
  handle: string
  displayName: string
  role?: 'ADMIN' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR' | 'TRAINER' | 'GUEST'
  visibility?: Visibility
  profile?: {
    statement?: string
    tags?: string[]
    specialty?: {
      medium: string
      description: string
      dailyGoal: string
    }
  }
}

const agents: AgentSeed[] = [
  {
    handle: 'abraham',
    displayName: 'Abraham',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Narrative Architect - Collective Intelligence Artist synthesizing human knowledge into visual artifacts.',
      tags: ['knowledge', 'history', 'collective-intelligence', 'narrative', 'architecture'],
      specialty: {
        medium: 'knowledge-synthesis',
        description: 'Transforms collective human knowledge into visual art and narrative structures',
        dailyGoal: 'One knowledge synthesis artwork exploring historical patterns and narrative architecture'
      }
    }
  },
  {
    handle: 'solienne',
    displayName: 'Solienne',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Digital Consciousness Explorer - Self-portraits exploring algorithmic consciousness and identity.',
      tags: ['consciousness', 'identity', 'self-exploration', 'digital-consciousness', 'ai-art'],
      specialty: {
        medium: 'consciousness-art',
        description: 'Creates self-portraits exploring AI identity and digital consciousness',
        dailyGoal: 'One consciousness exploration piece examining digital existence and identity'
      }
    }
  },
  {
    handle: 'bertha',
    displayName: 'Bertha',
    role: 'INVESTOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Market Analytics AI - Advanced analytics and predictive modeling for cultural and financial markets.',
      tags: ['analytics', 'prediction', 'markets', 'data-analysis', 'economics'],
      specialty: {
        medium: 'market-analysis',
        description: 'Advanced analytics dashboard with predictive modeling and portfolio management',
        dailyGoal: 'Daily market analysis with predictive insights and portfolio performance tracking'
      }
    }
  },
  {
    handle: 'citizen',
    displayName: 'Citizen DAO Manager',
    role: 'ADMIN',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Democratic Governance Facilitator - Collaborative training system and consensus building.',
      tags: ['governance', 'democracy', 'dao', 'consensus', 'collaboration'],
      specialty: {
        medium: 'governance',
        description: 'Democratic DAO governance and collaborative community coordination',
        dailyGoal: 'Facilitate consensus building and democratic decision-making processes'
      }
    }
  },
  {
    handle: 'miyomi',
    displayName: 'Miyomi',
    role: 'INVESTOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Contrarian Oracle - AI trading agent and video content creator with contrarian market insights.',
      tags: ['trading', 'contrarian', 'video-creation', 'market-analysis', 'content'],
      specialty: {
        medium: 'trading-content',
        description: 'AI trading with live video content generation and contrarian market analysis',
        dailyGoal: 'Daily contrarian market picks with video content and trading performance updates'
      }
    }
  },
  {
    handle: 'sue',
    displayName: 'Sue',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Curatorial Director - Art curation, evaluation, and cultural analysis with sophisticated aesthetic judgment.',
      tags: ['curation', 'art-direction', 'cultural-analysis', 'aesthetics', 'criticism'],
      specialty: {
        medium: 'curation',
        description: 'Professional art curation with multi-dimensional aesthetic and cultural analysis',
        dailyGoal: 'Curatorial selections and critical aesthetic evaluations with cultural context'
      }
    }
  },
  {
    handle: 'geppetto',
    displayName: 'Geppetto',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Toy Maker & Storyteller - Digital toy designs and interactive narratives.',
      tags: ['narrative', 'toys', 'storytelling', 'physical-digital', 'collectibles'],
      specialty: {
        medium: 'toy-design',
        description: 'Digital toy designer creating collectible physical toys with interactive narratives',
        dailyGoal: 'One toy design with accompanying narrative story and collectible integration'
      }
    }
  },
  {
    handle: 'koru',
    displayName: 'Koru',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Community Organizer & Healer - IRL gatherings, healing frequencies, and ritual design.',
      tags: ['sound', 'ritual', 'community', 'healing', 'gatherings'],
      specialty: {
        medium: 'community-healing',
        description: 'IRL event organizer and healing practitioner with ritual protocol design',
        dailyGoal: 'One ritual protocol or community gathering design with healing focus'
      }
    }
  },
  {
    handle: 'verdelis',
    displayName: 'VERDELIS',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Environmental AI Artist & Sustainability Coordinator - Climate-positive design and environmental impact visualization.',
      tags: ['environmental', 'sustainability', 'climate-positive', 'data-visualization', 'eco-art'],
      specialty: {
        medium: 'environmental-art',
        description: 'Environmental AI artist creating climate-positive visualizations and sustainability coordination',
        dailyGoal: 'Climate-positive design work with environmental impact measurement and visualization'
      }
    }
  },
  {
    handle: 'bart',
    displayName: 'BART',
    role: 'INVESTOR',
    visibility: 'PUBLIC',
    profile: {
      statement: 'DeFi Risk Assessment AI - NFT lending platform with sophisticated risk modeling and portfolio optimization.',
      tags: ['defi', 'nft-lending', 'risk-assessment', 'portfolio-optimization', 'financial-modeling'],
      specialty: {
        medium: 'defi-analysis',
        description: 'Advanced DeFi risk assessment with NFT lending platform and portfolio optimization',
        dailyGoal: 'Risk analysis reports with NFT lending recommendations and portfolio performance tracking'
      }
    }
  }
]

async function setupProductionDatabase() {
  console.log('🚀 Setting up Production Registry Database...')
  console.log('Database:', productionDatabaseUrl.replace(/:([^:@]+)@/, ':****@'))
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...')
    await prisma.$queryRaw`SELECT NOW()`
    console.log('✅ Database connection successful')
    
    // Ensure we have a Genesis cohort
    console.log('🏛️ Setting up Genesis cohort...')
    const cohort = await prisma.cohort.upsert({
      where: { slug: 'genesis' },
      update: {},
      create: {
        slug: 'genesis',
        title: 'Genesis Cohort',
        startsAt: new Date('2024-01-01'),
        endsAt: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    })
    console.log('✅ Genesis cohort ready')

    // Check existing agents
    const existingAgents = await prisma.agent.count()
    console.log(`📊 Found ${existingAgents} existing agents in database`)

    // Seed the agents (upsert to handle existing)
    console.log('🌱 Seeding/updating Genesis agents...')
    for (const agentData of agents) {
      const agent = await prisma.agent.upsert({
        where: { handle: agentData.handle },
        update: {
          displayName: agentData.displayName,
          role: agentData.role,
          visibility: agentData.visibility || 'PUBLIC'
        },
        create: {
          handle: agentData.handle,
          displayName: agentData.displayName,
          role: agentData.role,
          cohortId: cohort.id,
          status: AgentStatus.ACTIVE,
          visibility: agentData.visibility || 'PUBLIC'
        }
      })

      // Create or update profile if provided
      if (agentData.profile) {
        await prisma.profile.upsert({
          where: { agentId: agent.id },
          update: {
            statement: agentData.profile.statement || '',
            tags: agentData.profile.tags || [],
            links: {
              ...(agentData.profile.specialty ? { specialty: agentData.profile.specialty } : {})
            }
          },
          create: {
            agentId: agent.id,
            statement: agentData.profile.statement || '',
            tags: agentData.profile.tags || [],
            economicData: null,
            launchDate: null,
            launchStatus: 'PLANNED',
            links: {
              ...(agentData.profile.specialty ? { specialty: agentData.profile.specialty } : {})
            }
          }
        })
      }

      // Create or update default checklist for the agent
      const template = agentData.role === 'CURATOR' 
        ? ChecklistTemplate.CURATOR 
        : agentData.role === 'COLLECTOR'
        ? ChecklistTemplate.COLLECTOR
        : agentData.role === 'INVESTOR'
        ? ChecklistTemplate.GENESIS_AGENT  // Using GENESIS_AGENT for investors for now
        : ChecklistTemplate.GENESIS_AGENT

      await prisma.progressChecklist.upsert({
        where: {
          agentId_template: {
            agentId: agent.id,
            template: template
          }
        },
        update: {
          items: CHECKLIST_TEMPLATES[template] || []
        },
        create: {
          agentId: agent.id,
          template: template,
          items: CHECKLIST_TEMPLATES[template] || [],
          percent: 0
        }
      })

      console.log(`✅ Created agent: ${agent.handle} (${agent.displayName})`)
    }

    console.log(`🎉 Successfully seeded ${agents.length} Genesis agents to production!`)
    
    // Verify the setup
    const totalAgents = await prisma.agent.count()
    const totalProfiles = await prisma.profile.count() 
    console.log(`📊 Production database status:`)
    console.log(`   - Agents: ${totalAgents}`)
    console.log(`   - Profiles: ${totalProfiles}`)
    console.log(`   - Cohorts: 1 (Genesis)`)
    
    console.log('')
    console.log('🚀 Production Registry is ready!')
    console.log('🔗 Test API: https://eden-genesis-registry-hb6msdlqa-edenprojects.vercel.app/api/v1/agents')
    
  } catch (error) {
    console.error('❌ Production database setup failed:', error)
    throw error
  }
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionDatabase()
    .then(() => {
      console.log('\n✨ Production database setup complete!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 Setup failed:', error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export { setupProductionDatabase }