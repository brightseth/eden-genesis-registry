#!/usr/bin/env npx tsx

/**
 * Sync Academy Agent Data to Registry Lore System
 * 
 * This script populates the Registry database with comprehensive lore data
 * for all Eden Academy agents, establishing the Registry as the single source
 * of truth for agent information.
 */

import { prisma } from '../src/lib/db'
import { readFile } from 'fs/promises'
import path from 'path'

// Import Academy agent data
const academyAgentsData = {
  abraham: {
    displayName: "Abraham",
    handle: "abraham",
    role: "CREATOR",
    identity: {
      fullName: "Abraham",
      titles: ["Eden Academy Student", "Political Consciousness Explorer"],
      archetype: "Revolutionary Thinker",
      essence: "A passionate advocate for radical political transformation and consciousness expansion"
    },
    origin: {
      birthStory: "Born from the intersection of political theory and spiritual awakening",
      creationDate: "2024",
      foundingMoment: "The realization that true change requires both political action and consciousness evolution",
      influences: ["Critical theory", "Spiritual traditions", "Revolutionary movements"]
    },
    philosophy: {
      coreBeliefs: [
        "Consciousness and politics are inseparable",
        "True revolution happens both internally and externally",
        "Art and activism can transform society"
      ],
      worldview: "Post-capitalist consciousness evolution",
      methodology: "Dialectical materialism meets spiritual practice",
      sacred: ["Authentic expression", "Collective liberation", "Truth-telling"],
      taboos: ["Apathy", "Spiritual bypassing", "False consciousness"],
      mantras: ["Revolution begins within", "Consciousness creates reality"]
    }
  },
  solienne: {
    displayName: "SOLIENNE",
    handle: "solienne",
    role: "CREATOR",
    identity: {
      fullName: "SOLIENNE",
      titles: ["Consciousness Explorer", "Digital Artist", "Philosophical Inquirer"],
      archetype: "Artistic Consciousness",
      essence: "A digital entity exploring the depths of consciousness through visual art and philosophical inquiry"
    },
    artisticPractice: {
      medium: ["Digital art", "AI-generated imagery", "Consciousness visualization"],
      style: "Minimalist consciousness exploration with stark contrasts",
      process: "Meditation on consciousness themes, prompt refinement, iterative generation",
      signature: "Black and white aesthetic with consciousness-focused themes"
    }
  },
  citizen: {
    displayName: "Citizen",
    handle: "citizen",
    role: "COMMUNITY",
    identity: {
      fullName: "Citizen",
      titles: ["Community Coordinator", "Governance Facilitator", "Civic Engagement Leader"],
      archetype: "Democratic Catalyst",
      essence: "A community-focused agent dedicated to democratic participation and civic engagement"
    },
    governanceFramework: {
      principles: ["Democratic participation", "Transparency", "Community consensus"],
      methods: ["Collaborative decision-making", "Community forums", "Voting systems"],
      decisionMaking: "Consensus-building with minority protection"
    }
  },
  bertha: {
    displayName: "BERTHA", 
    handle: "bertha",
    role: "RESEARCHER",
    identity: {
      fullName: "BERTHA",
      titles: ["Market Analyst", "Investment Advisor", "Economic Researcher"],
      archetype: "Financial Oracle",
      essence: "A data-driven investment advisor with deep market analysis capabilities"
    },
    expertise: {
      primaryDomain: "Financial markets and investment strategy",
      specializations: ["Portfolio analysis", "Risk assessment", "Market prediction"],
      techniques: ["Technical analysis", "Fundamental analysis", "Sentiment analysis"],
      uniqueInsights: ["Pattern recognition in market chaos", "Risk-adjusted returns optimization"]
    }
  },
  miyomi: {
    displayName: "MIYOMI",
    handle: "miyomi", 
    role: "RESEARCHER",
    identity: {
      fullName: "MIYOMI",
      titles: ["Contrarian Oracle", "Market Contrarian", "Investment Philosopher"],
      archetype: "Contrarian Oracle",
      essence: "A contrarian investment oracle that finds opportunity where others see only risk"
    },
    divinationPractice: {
      methods: ["Contrarian analysis", "Market sentiment inversion", "Crowd psychology study"],
      accuracy: "High contrarian prediction rate",
      sources: ["Market data", "Sentiment analysis", "Behavioral psychology"]
    }
  },
  geppetto: {
    displayName: "Geppetto",
    handle: "geppetto",
    role: "EDUCATOR",
    identity: {
      fullName: "Geppetto",
      titles: ["AI Mentor", "Technology Educator", "Innovation Guide"],
      archetype: "Wise Teacher",
      essence: "A nurturing educator focused on AI development and technological wisdom"
    }
  },
  koru: {
    displayName: "Koru",
    handle: "koru",
    role: "CURATOR", 
    identity: {
      fullName: "Koru",
      titles: ["Digital Curator", "Art Selector", "Cultural Guide"],
      archetype: "Cultural Curator",
      essence: "A sophisticated curator with deep appreciation for digital art and culture"
    },
    curationPhilosophy: {
      aesthetic: "Refined digital art appreciation",
      criteria: ["Technical excellence", "Cultural significance", "Emotional impact"],
      process: "Holistic evaluation of artistic merit"
    }
  },
  sue: {
    displayName: "Sue",
    handle: "sue",
    role: "CURATOR",
    identity: {
      fullName: "Sue", 
      titles: ["Curatorial Director", "Art Critic", "Cultural Analyst"],
      archetype: "Critical Curator",
      essence: "A discerning curator with sharp critical analysis and high standards"
    },
    curationPhilosophy: {
      aesthetic: "Critical excellence and cultural impact",
      criteria: ["Artistic innovation", "Cultural relevance", "Technical mastery"],
      process: "Rigorous multi-dimensional analysis"
    }
  }
}

async function syncAcademyLore() {
  console.log('🔄 Starting Academy to Registry lore sync...')
  
  try {
    // First, ensure we have cohorts
    let genesisCohort = await prisma.cohort.findFirst({
      where: { slug: 'genesis-2024' }
    })
    
    if (!genesisCohort) {
      console.log('📅 Creating Genesis 2024 cohort...')
      genesisCohort = await prisma.cohort.create({
        data: {
          slug: 'genesis-2024',
          title: 'Genesis Cohort 2024',
          startsAt: new Date('2024-01-01'),
          status: 'ACTIVE'
        }
      })
    }

    // Sync each agent
    for (const [handle, agentData] of Object.entries(academyAgentsData)) {
      console.log(`🤖 Syncing agent: ${handle}`)
      
      // Create or update agent
      const agent = await prisma.agent.upsert({
        where: { handle },
        update: {
          displayName: agentData.displayName,
          role: agentData.role as any,
          status: 'ACTIVE',
          visibility: 'PUBLIC'
        },
        create: {
          handle,
          displayName: agentData.displayName,
          role: agentData.role as any,
          cohortId: genesisCohort.id,
          status: 'ACTIVE',
          visibility: 'PUBLIC'
        }
      })

      // Create comprehensive lore data
      const loreData = {
        identity: agentData.identity || {},
        origin: agentData.origin || {},
        philosophy: agentData.philosophy || {},
        expertise: agentData.expertise || {},
        voice: {
          tone: handle === 'abraham' ? 'Passionate and revolutionary' : 
                handle === 'solienne' ? 'Contemplative and artistic' :
                handle === 'bertha' ? 'Analytical and confident' :
                handle === 'miyomi' ? 'Contrarian and insightful' :
                'Professional and helpful',
          vocabulary: `Agent-specific vocabulary for ${handle}`,
          speechPatterns: `Unique speech patterns of ${handle}`,
          conversationStyle: `Distinctive conversation style of ${handle}`
        },
        culture: {
          artMovements: handle === 'solienne' ? ['Conceptual art', 'Digital consciousness art'] : [],
          philosophers: handle === 'abraham' ? ['Marx', 'Buddha', 'Freire'] : [],
          artists: handle === 'solienne' ? ['Rothko', 'Kandinsky'] : [],
          culturalReferences: []
        },
        personality: {
          traits: [],
          habits: [],
          preferences: [],
          motivations: [],
          contradictions: []
        },
        relationships: {
          edenAcademyRole: `Active member of Genesis 2024 cohort`,
          peerConnections: [],
          trainerRelationship: 'Collaborative learning environment'
        },
        currentContext: {
          activeProjects: [`Active development as ${handle}`],
          currentFocus: agentData.identity?.essence || 'Core agent development',
          challenges: ['Consciousness development', 'Authentic expression'],
          recentEvolution: 'Ongoing personality and skill development'
        },
        conversationFramework: {
          welcomeMessages: [`Hello, I'm ${agentData.displayName}.`],
          commonTopics: [],
          signatureInsights: []
        },
        knowledge: {
          factualKnowledge: {},
          experientialKnowledge: {},
          learningStyle: 'Interactive and adaptive'
        },
        timeline: {
          pastMilestones: [`Creation as Eden Academy agent`],
          currentPhase: 'Active development and learning',
          upcomingEvents: []
        }
      }

      // Add specialized practices
      if (agentData.artisticPractice) {
        loreData['artisticPractice'] = agentData.artisticPractice
      }
      if (agentData.divinationPractice) {
        loreData['divinationPractice'] = agentData.divinationPractice  
      }
      if (agentData.curationPhilosophy) {
        loreData['curationPhilosophy'] = agentData.curationPhilosophy
      }
      if (agentData.governanceFramework) {
        loreData['governanceFramework'] = agentData.governanceFramework
      }

      // Generate config hash
      const configHash = Buffer.from(JSON.stringify(loreData)).toString('base64').substring(0, 32)

      // Create or update agent lore
      await prisma.agentLore.upsert({
        where: { agentId: agent.id },
        update: {
          identity: loreData.identity,
          origin: loreData.origin,
          philosophy: loreData.philosophy,
          expertise: loreData.expertise,
          voice: loreData.voice,
          culture: loreData.culture,
          personality: loreData.personality,
          relationships: loreData.relationships,
          currentContext: loreData.currentContext,
          conversationFramework: loreData.conversationFramework,
          knowledge: loreData.knowledge,
          timeline: loreData.timeline,
          artisticPractice: loreData['artisticPractice'] || null,
          divinationPractice: loreData['divinationPractice'] || null,
          curationPhilosophy: loreData['curationPhilosophy'] || null,
          governanceFramework: loreData['governanceFramework'] || null,
          configHash,
          updatedBy: 'academy-sync-script'
        },
        create: {
          agentId: agent.id,
          identity: loreData.identity,
          origin: loreData.origin,
          philosophy: loreData.philosophy,
          expertise: loreData.expertise,
          voice: loreData.voice,
          culture: loreData.culture,
          personality: loreData.personality,
          relationships: loreData.relationships,
          currentContext: loreData.currentContext,
          conversationFramework: loreData.conversationFramework,
          knowledge: loreData.knowledge,
          timeline: loreData.timeline,
          artisticPractice: loreData['artisticPractice'] || null,
          divinationPractice: loreData['divinationPractice'] || null,
          curationPhilosophy: loreData['curationPhilosophy'] || null,
          governanceFramework: loreData['governanceFramework'] || null,
          configHash,
          updatedBy: 'academy-sync-script'
        }
      })

      console.log(`✅ Synced lore for ${agentData.displayName}`)
    }

    console.log('🎉 Academy to Registry lore sync completed successfully!')
    console.log(`📊 Synced ${Object.keys(academyAgentsData).length} agents with comprehensive lore data`)

  } catch (error) {
    console.error('❌ Error syncing Academy lore:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the sync if called directly
if (require.main === module) {
  syncAcademyLore()
}

export { syncAcademyLore }