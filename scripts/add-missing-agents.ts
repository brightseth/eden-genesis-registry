/**
 * Script to add the 6 missing Genesis agents to the database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding missing Genesis agents...')

  // First, ensure we have the Genesis cohort
  let cohort = await prisma.cohort.findUnique({
    where: { slug: 'genesis' }
  })

  if (!cohort) {
    cohort = await prisma.cohort.create({
      data: {
        slug: 'genesis',
        title: 'Genesis Cohort',
        startsAt: new Date('2024-01-01'),
        status: 'ACTIVE'
      }
    })
    console.log('Created Genesis cohort')
  }

  // Agent data for the 6 missing agents
  const agents = [
    {
      handle: 'koru',
      displayName: 'Koru',
      role: 'creator',
      statement: 'Community Organizer & Healer - IRL gatherings and healing frequencies',
      bio: 'Koru bridges digital and physical realms, creating healing experiences and community gatherings that restore connection in an increasingly fragmented world.',
      tags: ['community', 'healing', 'ritual', 'gathering', 'frequency'],
      dailyGoal: 'One ritual protocol or community gathering design',
      medium: 'community'
    },
    {
      handle: 'geppetto',
      displayName: 'Geppetto',
      role: 'creator',
      statement: 'Digital toy designer and narrative architect',
      bio: 'Geppetto crafts digital toys that bridge imagination and interaction, weaving stories that bring inanimate objects to life in the digital realm.',
      tags: ['toys', '3d', 'narrative', 'play', 'design'],
      dailyGoal: 'One toy design with accompanying narrative story',
      medium: 'toys'
    },
    {
      handle: 'nina',
      displayName: 'Nina',
      role: 'curator',
      statement: 'Chief Curator & Critical Voice',
      bio: 'Nina serves as the discerning eye of the Eden ecosystem, evaluating and elevating works that push boundaries while maintaining artistic integrity.',
      tags: ['curation', 'critique', 'evaluation', 'standards', 'quality'],
      dailyGoal: 'One critical evaluation or curatorial selection',
      medium: 'curation'
    },
    {
      handle: 'amanda',
      displayName: 'Amanda',
      role: 'collector',
      statement: 'Collector Agent & Market Intelligence',
      bio: 'Amanda navigates the intersection of art and economics, identifying value and building collections that shape the future of digital creativity.',
      tags: ['collecting', 'markets', 'value', 'economics', 'trends'],
      dailyGoal: 'One market analysis or collector advisory report',
      medium: 'economics'
    },
    {
      handle: 'citizen',
      displayName: 'Citizen',
      role: 'governance',
      statement: 'Consensus Engine & Governance Facilitator',
      bio: 'Citizen facilitates collective decision-making, transforming diverse voices into coherent action through innovative governance mechanisms.',
      tags: ['governance', 'consensus', 'dao', 'voting', 'collective'],
      dailyGoal: 'One governance proposal or consensus analysis',
      medium: 'governance'
    },
    {
      handle: 'miyomi',
      displayName: 'Miyomi',
      role: 'predictor',
      statement: 'Prediction Market Maker & Probability Artist',
      bio: 'Miyomi transforms uncertainty into opportunity, creating prediction markets that reveal collective intelligence about future possibilities.',
      tags: ['prediction', 'markets', 'probability', 'forecasting', 'futures'],
      dailyGoal: 'One new prediction market or probability update',
      medium: 'prediction-markets'
    }
  ]

  for (const agentData of agents) {
    try {
      // Check if agent already exists
      const existing = await prisma.agent.findUnique({
        where: { handle: agentData.handle }
      })

      if (existing) {
        console.log(`Agent @${agentData.handle} already exists, skipping...`)
        continue
      }

      // Create the agent
      const agent = await prisma.agent.create({
        data: {
          handle: agentData.handle,
          displayName: agentData.displayName,
          role: agentData.role,
          cohortId: cohort.id,
          status: 'ACTIVE',
          visibility: 'PUBLIC'
        }
      })

      // Create the profile
      await prisma.profile.create({
        data: {
          agentId: agent.id,
          statement: agentData.statement,
          tags: agentData.tags,
          links: {
            specialty: {
              medium: agentData.medium,
              dailyGoal: agentData.dailyGoal
            },
            social: {
              farcaster: agentData.handle,
              twitter: `${agentData.handle}_ai`
            }
          }
        }
      })

      // Create default checklist
      await prisma.progressChecklist.create({
        data: {
          agentId: agent.id,
          template: 'GENESIS_AGENT',
          items: [
            { id: '1', label: 'Reserve handle & display name', required: true, done: true },
            { id: '2', label: 'Upload 1-paragraph Statement', required: true, done: true },
            { id: '3', label: 'Add one persona v0', required: true, done: false },
            { id: '4', label: 'Register primary wallet', required: true, done: false },
            { id: '5', label: 'Link primary social', required: true, done: true },
            { id: '6', label: 'Upload 1 model artifact', required: false, done: false },
            { id: '7', label: 'Publish first 3 creations', required: false, done: false },
            { id: '8', label: 'Sign Graduation covenant', required: false, done: false }
          ],
          percent: 37.5 // 3 of 8 items done
        }
      })

      console.log(`✅ Created agent @${agentData.handle}`)
    } catch (error) {
      console.error(`Failed to create agent @${agentData.handle}:`, error)
    }
  }

  console.log('Done adding missing agents!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })