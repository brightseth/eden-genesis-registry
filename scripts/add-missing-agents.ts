#!/usr/bin/env tsx

/**
 * Add Missing Genesis Agents via Registry API
 * Adds GEPPETTO, KORU, VERDELIS, BART to production via API calls
 */

const REGISTRY_API_URL = 'https://eden-genesis-registry-hb6msdlqa-edenprojects.vercel.app/api/v1'
const API_KEY = 'registry-upload-key-v1'

interface AgentCreate {
  handle: string
  displayName: string
  role: string
  visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'
  cohort: string
  profile: {
    statement: string
    tags: string[]
    specialty: {
      medium: string
      description: string
      dailyGoal: string
    }
  }
}

const missingAgents: AgentCreate[] = [
  {
    handle: 'geppetto',
    displayName: 'Geppetto',
    role: 'CURATOR',
    visibility: 'PUBLIC',
    cohort: 'genesis',
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
    cohort: 'genesis',
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
    cohort: 'genesis',
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
    cohort: 'genesis',
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

async function addMissingAgents() {
  console.log('🚀 Adding Missing Genesis Agents via Registry API')
  console.log('Target:', REGISTRY_API_URL)
  console.log('Agents to add:', missingAgents.map(a => a.handle).join(', '))
  console.log('')

  // First, check what agents currently exist
  try {
    const response = await fetch(`${REGISTRY_API_URL}/agents`)
    const data = await response.json()
    const existingHandles = data.agents?.map((a: any) => a.handle) || []
    
    console.log(`📊 Current agents (${existingHandles.length}):`, existingHandles.join(', '))
    console.log('')
    
    // Filter to only agents that don't exist
    const agentsToAdd = missingAgents.filter(agent => !existingHandles.includes(agent.handle))
    
    if (agentsToAdd.length === 0) {
      console.log('✅ All agents already exist in production!')
      return
    }
    
    console.log(`🌱 Adding ${agentsToAdd.length} missing agents...`)
    
    for (const agent of agentsToAdd) {
      console.log(`\n⏳ Adding ${agent.handle} (${agent.displayName})...`)
      
      try {
        const response = await fetch(`${REGISTRY_API_URL}/agents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'X-API-Key': API_KEY
          },
          body: JSON.stringify(agent)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log(`✅ Added ${agent.handle}:`, result.id || 'success')
        } else {
          const error = await response.text()
          console.log(`❌ Failed to add ${agent.handle}: ${response.status} - ${error}`)
        }
      } catch (error) {
        console.log(`❌ Network error adding ${agent.handle}:`, error)
      }
    }
    
    console.log('\n📊 Final verification...')
    const finalResponse = await fetch(`${REGISTRY_API_URL}/agents`)
    const finalData = await finalResponse.json()
    const finalCount = finalData.agents?.length || 0
    
    console.log(`🎉 Registry now has ${finalCount} agents total!`)
    console.log('✅ Missing agents addition complete!')
    
  } catch (error) {
    console.error('❌ Failed to add missing agents:', error)
  }
}

// Run the script
addMissingAgents()