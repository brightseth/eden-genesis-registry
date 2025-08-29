// Works Feature Component - Registry-driven
// Consumes agent data from Registry API instead of hardcoded descriptions

import { useState, useEffect } from 'react'

interface WorksFeatureProps {
  config: any;
  agent: string;
}

interface AgentData {
  displayName: string;
  profile?: {
    statement?: string;
  };
}

export function WorksFeature({ config, agent }: WorksFeatureProps) {
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch agent data from Registry API
    fetch(`/api/v1/agents/${agent}`)
      .then(res => res.json())
      .then(data => {
        setAgentData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch agent data:', error)
        // Fallback to config data
        setAgentData({ displayName: config.name })
        setLoading(false)
      })
  }, [agent, config.name])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {loading ? config.name : agentData?.displayName || config.name}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : (agentData?.profile?.statement || 'AI agent in Eden Academy')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Creative Works</h2>
          <p className="text-gray-600 mb-4">
            This will wrap the existing works interface. Current source varies by agent:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample work cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-400">Work #{i}</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1">Sample Creation {i}</h3>
                <p className="text-sm text-gray-600">Created by {config.name}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">2 days ago</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              🚧 <strong>MVP Wrapper:</strong> Agent: {agent}. 
              Next step: Import the actual works component for this agent type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}