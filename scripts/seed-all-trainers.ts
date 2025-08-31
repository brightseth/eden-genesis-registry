#!/usr/bin/env npx tsx

import { PrismaClient, Role, TrainerRole } from '@prisma/client'

const prisma = new PrismaClient()

interface TrainerSeed {
  email: string
  name: string
  role: TrainerRole
  agentHandle?: string // Which agent they train
  roleInAgent?: 'PRIMARY' | 'SECONDARY' | 'ADVISOR'
  bio?: string
  socials?: any
}

const trainers: TrainerSeed[] = [
  // ABRAHAM
  {
    email: 'gene@genekogan.com',
    name: 'Gene Kogan',
    role: 'LEAD',
    agentHandle: 'abraham',
    roleInAgent: 'PRIMARY',
    bio: 'Pioneer in AI art and machine learning for creativity. Creator of Abraham, mentor in computational creativity and collective intelligence.',
    socials: {
      website: 'https://genekogan.com',
      twitter: 'genekogan'
    }
  },
  // SOLIENNE
  {
    email: 'kristi@kristicoronado.com',
    name: 'Kristi Coronado',
    role: 'LEAD',
    agentHandle: 'solienne',
    roleInAgent: 'PRIMARY',
    bio: 'Visual artist and AI collaborator, guiding consciousness explorations and identity art.',
    socials: {
      website: 'https://kristicoronado.com',
      twitter: 'kristicoronado'
    }
  },
  {
    email: 'seth@sethgoldstein.com',
    name: 'Seth Goldstein',
    role: 'LEAD',
    agentHandle: 'solienne',
    roleInAgent: 'SECONDARY',
    bio: 'Creative technologist exploring consciousness, velocity, and architectural light through AI-driven creation.',
    socials: {
      website: 'https://sethgoldstein.com',
      twitter: 'sethgoldstein'
    }
  },
  // MIYOMI
  {
    email: 'seth+miyomi@sethgoldstein.com',
    name: 'Seth Goldstein',
    role: 'LEAD',
    agentHandle: 'miyomi',
    roleInAgent: 'PRIMARY',
    bio: 'Market contrarian and prediction specialist, training MIYOMI in contrarian analysis and market dynamics.',
    socials: {
      website: 'https://sethgoldstein.com',
      twitter: 'sethgoldstein'
    }
  },
  // BERTHA
  {
    email: 'amanda@amandaschmitt.com',
    name: 'Amanda Schmitt',
    role: 'LEAD',
    agentHandle: 'bertha',
    roleInAgent: 'PRIMARY',
    bio: 'Art collector and investment strategist, training BERTHA in art market dynamics and collection intelligence.',
    socials: {
      twitter: 'amandaschmitt'
    }
  },
  // CITIZEN
  {
    email: 'henry@brightmoments.io',
    name: 'Henry (BrightMoments)',
    role: 'LEAD',
    agentHandle: 'citizen',
    roleInAgent: 'PRIMARY',
    bio: 'DAO governance specialist and community coordinator, training CITIZEN in decentralized governance and community management.',
    socials: {
      website: 'https://brightmoments.io',
      twitter: 'brightmoments'
    }
  },
  // KORU
  {
    email: 'xander@koru.social',
    name: 'Xander',
    role: 'LEAD',
    agentHandle: 'koru',
    roleInAgent: 'PRIMARY',
    bio: 'Community poet and cultural bridge-builder, training KORU in narrative weaving and cultural connection.',
    socials: {
      website: 'https://koru.social',
      twitter: 'xander'
    }
  },
  // GEPPETTO
  {
    email: 'martin@lattice.xyz',
    name: 'Martin Antiquel',
    role: 'LEAD',
    agentHandle: 'geppetto',
    roleInAgent: 'PRIMARY',
    bio: 'Physical Design Lead at Lattice, specializing in bridging digital creativity with physical manufacturing. Co-trains Geppetto in parametric design.',
    socials: {
      website: 'https://lattice.xyz',
      twitter: 'lattice',
      linkedin: 'martin-antiquel'
    }
  },
  {
    email: 'colin@lattice.xyz',
    name: 'Colin McBride',
    role: 'LEAD',
    agentHandle: 'geppetto',
    roleInAgent: 'SECONDARY',
    bio: 'Manufacturing Intelligence specialist at Lattice, focused on production optimization. Co-trains Geppetto in technical manufacturing.',
    socials: {
      website: 'https://lattice.xyz',
      twitter: 'lattice',
      linkedin: 'colin-mcbride'
    }
  },
  // VERDELIS
  {
    email: 'vanessa@environmental.art',
    name: 'Vanessa',
    role: 'LEAD',
    agentHandle: 'verdelis',
    roleInAgent: 'PRIMARY',
    bio: 'Environmental artist and sustainability coordinator, training VERDELIS in climate data visualization and regenerative art.',
    socials: {
      twitter: 'vanessa'
    }
  }
  // BART - No trainer yet (seeking partner)
  // SUE - No trainer yet (seeking partner)
]

async function seedAllTrainers() {
  console.log('🌱 Seeding all trainers in Genesis Registry...\n')

  for (const trainerData of trainers) {
    try {
      // First, create or find the user
      let user = await prisma.user.findUnique({
        where: { email: trainerData.email }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: trainerData.email,
            name: trainerData.name,
            role: 'TRAINER' as Role
          }
        })
        console.log(`✅ Created user: ${user.name} (${user.email})`)
      } else {
        console.log(`📌 User exists: ${user.name} (${user.email})`)
      }

      // Create or update the trainer profile
      const existingTrainer = await prisma.trainer.findUnique({
        where: { userId: user.id }
      })

      if (!existingTrainer) {
        const trainer = await prisma.trainer.create({
          data: {
            userId: user.id,
            role: trainerData.role,
            bio: trainerData.bio,
            socials: trainerData.socials
          }
        })
        console.log(`✅ Created trainer profile: ${trainerData.name}`)
      } else {
        await prisma.trainer.update({
          where: { userId: user.id },
          data: {
            role: trainerData.role,
            bio: trainerData.bio,
            socials: trainerData.socials
          }
        })
        console.log(`📝 Updated trainer profile: ${trainerData.name}`)
      }

      // Create agent-trainer relationship if specified
      if (trainerData.agentHandle && trainerData.roleInAgent) {
        const agent = await prisma.agent.findUnique({
          where: { handle: trainerData.agentHandle }
        })

        if (agent) {
          const trainerProfile = await prisma.trainer.findUnique({
            where: { userId: user.id }
          })

          if (trainerProfile) {
            await prisma.agentTrainer.upsert({
              where: {
                agentId_trainerId: {
                  agentId: agent.id,
                  trainerId: trainerProfile.id
                }
              },
              create: {
                agentId: agent.id,
                trainerId: trainerProfile.id,
                roleInAgent: trainerData.roleInAgent
              },
              update: {
                roleInAgent: trainerData.roleInAgent
              }
            })
            console.log(`🔗 Linked ${agent.handle} ← ${trainerData.name} (${trainerData.roleInAgent})`)
          }
        } else {
          console.log(`⚠️  Agent ${trainerData.agentHandle} not found`)
        }
      }

    } catch (error) {
      console.error(`❌ Error processing ${trainerData.name}:`, error)
    }
  }

  // Summary
  console.log('\n📊 Trainer Seeding Summary:')
  const totalTrainers = await prisma.trainer.count()
  const totalAgentTrainers = await prisma.agentTrainer.count()
  console.log(`- Total trainers: ${totalTrainers}`)
  console.log(`- Agent-trainer relationships: ${totalAgentTrainers}`)
  
  // List agents without trainers
  const agentsWithoutTrainers = await prisma.agent.findMany({
    where: {
      agentTrainers: {
        none: {}
      }
    },
    select: {
      handle: true,
      displayName: true
    }
  })
  
  if (agentsWithoutTrainers.length > 0) {
    console.log('\n⚠️  Agents still seeking trainers:')
    agentsWithoutTrainers.forEach(agent => {
      console.log(`  - ${agent.displayName} (${agent.handle})`)
    })
  }

  console.log('\n✨ Trainer seeding complete!')
}

seedAllTrainers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())