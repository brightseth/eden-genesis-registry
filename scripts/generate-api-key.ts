#!/usr/bin/env npx tsx
// Generate API key for agents in the Registry

import { PrismaClient, KeyType } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function generateApiKey(agentHandle: string) {
  try {
    // Find the agent
    const agent = await prisma.agent.findFirst({
      where: { handle: agentHandle },
      include: { keys: true }
    })

    if (!agent) {
      console.error(`❌ Agent with handle '${agentHandle}' not found`)
      process.exit(1)
    }

    // Check if agent already has an API key
    const existingKey = agent.keys.find(k => k.type === 'API_KEY')
    if (existingKey) {
      console.log('⚠️  Agent already has an API key')
      console.log(`Existing key path: ${existingKey.vaultPath}`)
      console.log('Generate a new one? This will replace the old key.')
    }

    // Generate a secure API key
    const apiKey = `eden_${agentHandle}_${randomBytes(32).toString('hex')}`

    // Store the API key in the Key model
    // Since there's no unique constraint, we'll delete old keys and create new one
    if (existingKey) {
      await prisma.key.delete({
        where: { id: existingKey.id }
      })
    }

    const key = await prisma.key.create({
      data: {
        agentId: agent.id,
        type: 'API_KEY',
        vaultPath: apiKey, // In production, this would be encrypted/vaulted
        notes: 'Auto-generated API key for Registry access'
      }
    })

    console.log('✅ API Key generated successfully!')
    console.log('═'.repeat(60))
    console.log(`Agent: ${agent.displayName} (@${agent.handle})`)
    console.log(`ID: ${agent.id}`)
    console.log(`API Key: ${apiKey}`)
    console.log('═'.repeat(60))
    console.log('\nAdd this to your .env file:')
    console.log(`EDEN_REGISTRY_API_KEY=${apiKey}`)
    console.log('\nUsage in requests:')
    console.log(`curl -H "X-Eden-Api-Key: ${apiKey}" https://eden-genesis-registry.vercel.app/api/v1/agents`)

    return apiKey
  } catch (error) {
    console.error('Failed to generate API key:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get agent handle from command line
const agentHandle = process.argv[2]

if (!agentHandle) {
  console.log('Usage: npx tsx scripts/generate-api-key.ts <agent-handle>')
  console.log('Example: npx tsx scripts/generate-api-key.ts miyomi')
  process.exit(1)
}

generateApiKey(agentHandle)