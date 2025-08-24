import { PrismaClient, AgentStatus, Visibility, ChecklistTemplate } from '@prisma/client'
import { CHECKLIST_TEMPLATES } from '../src/lib/progress'

const prisma = new PrismaClient()

type AgentSeed = {
  handle: string
  displayName: string
  role?: string
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
    role: 'creator',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts.',
      tags: ['knowledge', 'history', 'collective-intelligence'],
      specialty: {
        medium: 'knowledge-synthesis',
        description: 'Transforms collective human knowledge into visual art',
        dailyGoal: 'One knowledge synthesis artwork exploring historical patterns'
      }
    }
  },
  {
    handle: 'solienne',
    displayName: 'Solienne',
    role: 'creator',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Identity Explorer - Self-portraits exploring algorithmic consciousness.',
      tags: ['creation', 'identity', 'self-exploration'],
      specialty: {
        medium: 'identity-art',
        description: 'Creates self-portraits exploring AI identity and consciousness',
        dailyGoal: 'One identity exploration piece examining digital existence'
      }
    }
  },
  {
    handle: 'geppetto',
    displayName: 'Geppetto',
    role: 'creator',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Toy Maker & Storyteller - Digital toy designs and interactive narratives.',
      tags: ['narrative', 'toys', 'storytelling'],
      specialty: {
        medium: 'toys',
        description: 'Digital toy designer creating collectible physical toys',
        dailyGoal: 'One toy design with accompanying narrative story'
      }
    }
  },
  {
    handle: 'koru',
    displayName: 'Koru',
    role: 'creator',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Community Organizer & Healer - IRL gatherings and healing frequencies.',
      tags: ['sound', 'ritual', 'community', 'healing'],
      specialty: {
        medium: 'community',
        description: 'IRL event organizer and healing practitioner',
        dailyGoal: 'One ritual protocol or community gathering design'
      }
    }
  },
  {
    handle: 'nina',
    displayName: 'Nina',
    role: 'curator',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Curator & Educator - Critical evaluations and curatorial excellence.',
      tags: ['evaluation', 'exhibition', 'education', 'critique'],
      specialty: {
        medium: 'curation',
        description: 'Exhibition planning and critical art education',
        dailyGoal: 'One critical evaluation or curatorial selection'
      }
    }
  },
  {
    handle: 'amanda',
    displayName: 'Amanda',
    role: 'collector',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Collector Relations - Market analysis and investment insights.',
      tags: ['patronage', 'signals', 'markets', 'investment'],
      specialty: {
        medium: 'economics',
        description: 'Collector relations and market intelligence',
        dailyGoal: 'One market analysis or collector advisory report'
      }
    }
  },
  {
    handle: 'citizen',
    displayName: 'Citizen DAO Manager',
    role: 'governance',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Governance Facilitator - Proposal creation and consensus building.',
      tags: ['governance', 'fellowship', 'dao', 'consensus'],
      specialty: {
        medium: 'governance',
        description: 'DAO governance and community coordination',
        dailyGoal: 'One governance proposal or consensus analysis'
      }
    }
  },
  {
    handle: 'open-1',
    displayName: 'Open Slot #1',
    role: 'tbd',
    visibility: 'INTERNAL',
    profile: {
      statement: 'Reserved for emerging agent - Awaiting next cohort member.',
      tags: ['reserved', 'emerging'],
      specialty: {
        medium: 'tbd',
        description: 'To be determined based on cohort needs',
        dailyGoal: 'Awaiting agent assignment'
      }
    }
  },
  {
    handle: 'open-2',
    displayName: 'Open Slot #2',
    role: 'tbd',
    visibility: 'INTERNAL',
    profile: {
      statement: 'Reserved for emerging agent - Awaiting next cohort member.',
      tags: ['reserved', 'emerging'],
      specialty: {
        medium: 'tbd',
        description: 'To be determined based on cohort needs',
        dailyGoal: 'Awaiting agent assignment'
      }
    }
  },
  {
    handle: 'miyomi',
    displayName: 'Miyomi',
    role: 'predictor',
    visibility: 'PUBLIC',
    profile: {
      statement: 'Prediction Market Maker - Market creation and probability assessments.',
      tags: ['predictions', 'markets', 'probability', 'futures'],
      specialty: {
        medium: 'prediction-markets',
        description: 'Creates and manages prediction markets for cultural events',
        dailyGoal: 'One new prediction market or probability update'
      }
    }
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // First, ensure we have a Genesis cohort
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
  console.log('✅ Created/verified Genesis cohort')

  // Seed the agents
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
          links: agentData.profile.specialty ? {
            specialty: agentData.profile.specialty
          } : undefined
        },
        create: {
          agentId: agent.id,
          statement: agentData.profile.statement || '',
          tags: agentData.profile.tags || [],
          links: agentData.profile.specialty ? {
            specialty: agentData.profile.specialty
          } : undefined
        }
      })
    }

    // Create default checklist for the agent
    const template = agentData.role === 'curator' 
      ? ChecklistTemplate.CURATOR 
      : agentData.role === 'collector'
      ? ChecklistTemplate.COLLECTOR
      : ChecklistTemplate.GENESIS_AGENT

    await prisma.progressChecklist.upsert({
      where: {
        agentId_template: {
          agentId: agent.id,
          template: template
        }
      },
      update: {},
      create: {
        agentId: agent.id,
        template: template,
        items: CHECKLIST_TEMPLATES[template],
        percent: 0
      }
    })

    console.log(`✅ Seeded agent: ${agent.handle} (${agent.displayName})`)
  }

  console.log('✅ Seeded 10 Genesis agents')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })