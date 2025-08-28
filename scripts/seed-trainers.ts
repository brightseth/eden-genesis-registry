#!/usr/bin/env npx tsx

import { PrismaClient, Role, TrainerRole } from '@prisma/client'

const prisma = new PrismaClient()

interface TrainerSeed {
  email: string
  name: string
  role: TrainerRole
  bio?: string
  socials?: any
}

const trainers: TrainerSeed[] = [
  {
    email: 'martin@lattice.xyz',
    name: 'Martin Antiquel',
    role: 'LEAD',
    bio: 'Physical Design Lead at Lattice, specializing in bridging digital creativity with physical manufacturing. Co-trains Geppetto in parametric design, manufacturing constraints, and functional object creation.',
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
    bio: 'Manufacturing Intelligence specialist at Lattice, focused on production optimization and manufacturing processes. Co-trains Geppetto in technical aspects of bringing digital designs into physical reality.',
    socials: {
      website: 'https://lattice.xyz',
      twitter: 'lattice',
      linkedin: 'colin-mcbride'
    }
  }
]

async function seedTrainers() {
  console.log('<1 Seeding trainers in Genesis Registry...\n')

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
        console.log(` Created user: ${user.name} (${user.email})`)
      } else {
        console.log(`=d User exists: ${user.name} (${user.email})`)
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
        console.log(` Created trainer profile: ${trainerData.name}`)
      } else {
        await prisma.trainer.update({
          where: { userId: user.id },
          data: {
            role: trainerData.role,
            bio: trainerData.bio,
            socials: trainerData.socials
          }
        })
        console.log(` Updated trainer profile: ${trainerData.name}`)
      }

    } catch (error) {
      console.error(`L Error processing ${trainerData.name}:`, error)
    }
  }

  // Now create agent-trainer relationships for Geppetto
  console.log('\n= Creating agent-trainer relationships...\n')

  try {
    // Find Geppetto agent
    const geppettoAgent = await prisma.agent.findUnique({
      where: { handle: 'geppetto' }
    })

    if (geppettoAgent) {
      // Find Martin and Colin trainers
      const martinUser = await prisma.user.findUnique({
        where: { email: 'martin@lattice.xyz' },
        include: { trainer: true }
      })
      
      const colinUser = await prisma.user.findUnique({
        where: { email: 'colin@lattice.xyz' },
        include: { trainer: true }
      })

      if (martinUser?.trainer) {
        await prisma.agentTrainer.upsert({
          where: {
            agentId_trainerId: {
              agentId: geppettoAgent.id,
              trainerId: martinUser.trainer.id
            }
          },
          create: {
            agentId: geppettoAgent.id,
            trainerId: martinUser.trainer.id,
            roleInAgent: 'PRIMARY'
          },
          update: {
            roleInAgent: 'PRIMARY'
          }
        })
        console.log(` Linked Geppetto ’ Martin (PRIMARY)`)
      }

      if (colinUser?.trainer) {
        await prisma.agentTrainer.upsert({
          where: {
            agentId_trainerId: {
              agentId: geppettoAgent.id,
              trainerId: colinUser.trainer.id
            }
          },
          create: {
            agentId: geppettoAgent.id,
            trainerId: colinUser.trainer.id,
            roleInAgent: 'SECONDARY'
          },
          update: {
            roleInAgent: 'SECONDARY'
          }
        })
        console.log(` Linked Geppetto ’ Colin (SECONDARY)`)
      }
    } else {
      console.log(`   Geppetto agent not found in Registry`)
    }

  } catch (error) {
    console.error(`L Error creating agent-trainer relationships:`, error)
  }

  console.log('\n( Trainer seeding complete!')
}

seedTrainers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())