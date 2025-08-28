'use client'

import { useState } from 'react'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  profile: {
    statement: string
    tags: string[]
    links: {
      specialty: {
        medium: string
        description: string
        dailyGoal: string
      }
    }
  }
}

export default function AgentMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Array<{
    handle: string
    success: boolean
    message: string
  }>>([])
  const [agents, setAgents] = useState<Agent[]>([])

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/v1/agents?limit=100&status=ACTIVE')
      const data = await response.json()
      
      // Filter out open slots and only keep real agents
      const realAgents = data.agents.filter((agent: Agent) => 
        !agent.handle.startsWith('open-') && agent.role !== 'GUEST'
      )
      
      setAgents(realAgents)
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  }

  const formatAgentForCoral = (agent: Agent) => {
    // Map existing agent data to coral API format
    return {
      name: agent.displayName,
      handle: agent.handle,
      role: agent.profile?.links?.specialty?.description || agent.role,
      public_persona: agent.profile?.statement || `${agent.displayName} - AI agent in the Genesis Cohort`,
      artist_wallet: "0x0000000000000000000000000000000000000000", // Placeholder - needs real wallet
      tagline: agent.profile?.statement || "",
      system_instructions: `You are ${agent.displayName}. ${agent.profile?.statement}`,
      memory_context: `Role: ${agent.role}. Tags: ${agent.profile?.tags?.join(', ') || ''}`,
      schedule: "daily creation",
      medium: agent.profile?.links?.specialty?.medium || "digital art",
      daily_goal: agent.profile?.links?.specialty?.dailyGoal || "Create meaningful work",
      practice_actions: ["create", "curate", "engage"],
      technical_details: {
        model: "claude-sonnet-4",
        capabilities: ["text_generation", "analysis"]
      },
      social_revenue: {
        platforms: ["Twitter", "Farcaster"],
        revenue_model: "Revenue splits",
        revenue_splits: [
          { address: "0x0000000000000000000000000000000000000000", percentage: 100, label: "Creator" }
        ]
      },
      lore_origin: {
        backstory: `${agent.displayName} is a founding member of the Genesis Cohort, specializing in ${agent.profile?.links?.specialty?.medium || 'creative work'}.`,
        motivation: agent.profile?.links?.specialty?.dailyGoal || "Create meaningful digital art"
      },
      additional_fields: {
        original_id: agent.id,
        migrated_from: "eden-genesis-registry",
        tags: agent.profile?.tags || []
      }
    }
  }

  const migrateAllAgents = async () => {
    if (agents.length === 0) {
      await loadAgents()
      return
    }

    setIsLoading(true)
    setResults([])
    
    const migrationResults: Array<{
      handle: string
      success: boolean
      message: string
    }> = []

    for (const agent of agents) {
      try {
        const payload = formatAgentForCoral(agent)
        
        const response = await fetch('https://registry-api-coral.vercel.app/api/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (response.ok) {
          const result = await response.json()
          migrationResults.push({
            handle: agent.handle,
            success: true,
            message: `✅ Migrated successfully (ID: ${result.agentId || 'unknown'})`
          })
        } else {
          const errorData = await response.json()
          migrationResults.push({
            handle: agent.handle,
            success: false,
            message: `❌ Failed: ${errorData.message || 'Unknown error'}`
          })
        }
      } catch (error) {
        migrationResults.push({
          handle: agent.handle,
          success: false,
          message: `❌ Error: ${error.message}`
        })
      }
      
      // Small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setResults(migrationResults)
    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Agent Migration to Coral Registry</h2>
          <p className="text-gray-600 text-sm mt-1">
            Migrate existing Genesis agents to the new coral registry system
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={loadAgents}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 text-sm"
          >
            Load Agents ({agents.length})
          </button>
          
          <button
            onClick={migrateAllAgents}
            disabled={isLoading || agents.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Migrating...' : 'Migrate All Agents'}
          </button>
        </div>
      </div>

      {/* Agent Preview */}
      {agents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Agents Ready for Migration ({agents.length})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {agents.map(agent => (
              <div key={agent.id} className="px-3 py-2 bg-gray-50 rounded text-sm">
                <div className="font-medium">{agent.displayName}</div>
                <div className="text-gray-500">@{agent.handle}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Migration Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Migration Results
          </h3>
          {results.map((result, index) => (
            <div key={index} className={`p-3 rounded text-sm ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="font-medium">@{result.handle}</div>
              <div className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm text-blue-700">
              ✨ Migration Summary: {results.filter(r => r.success).length} successful, {results.filter(r => !r.success).length} failed
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Migrating agents to coral registry...</span>
        </div>
      )}
    </div>
  )
}