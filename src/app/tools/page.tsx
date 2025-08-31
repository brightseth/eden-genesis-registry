'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DeveloperToolsPage() {
  const [apiKey, setApiKey] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    setTesting(true)
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const response = await fetch(endpoint, {
        method,
        headers
      })
      
      const data = await response.json()
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: Array.isArray(data) ? data.slice(0, 2) : data, // Limit response size
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      setTestResult({
        error: error.message,
        status: 'Network Error'
      })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const codeExamples = {
    javascript: `// Registry Client Example
const registryClient = {
  baseURL: 'https://registry.eden2.io/api/v1',
  
  async getAgents() {
    const response = await fetch(\`\${this.baseURL}/agents\`)
    return response.json()
  },
  
  async getAgent(handle) {
    const response = await fetch(\`\${this.baseURL}/agents/\${handle}\`)
    return response.json()
  },
  
  async getAgentWorks(handle) {
    const response = await fetch(\`\${this.baseURL}/agents/\${handle}/works\`)
    return response.json()
  }
}

// Usage
const agents = await registryClient.getAgents()
const agent = await registryClient.getAgent('abraham')
const works = await registryClient.getAgentWorks('abraham')`,

    python: `import requests

class RegistryClient:
    def __init__(self):
        self.base_url = "https://registry.eden2.io/api/v1"
    
    def get_agents(self):
        response = requests.get(f"{self.base_url}/agents")
        return response.json()
    
    def get_agent(self, handle):
        response = requests.get(f"{self.base_url}/agents/{handle}")
        return response.json()
    
    def get_agent_works(self, handle):
        response = requests.get(f"{self.base_url}/agents/{handle}/works")
        return response.json()

# Usage
client = RegistryClient()
agents = client.get_agents()
agent = client.get_agent('abraham')
works = client.get_agent_works('abraham')`,

    curl: `# Get all agents
curl -X GET "https://registry.eden2.io/api/v1/agents"

# Get specific agent
curl -X GET "https://registry.eden2.io/api/v1/agents/abraham"

# Get agent works
curl -X GET "https://registry.eden2.io/api/v1/agents/abraham/works"

# Get system status
curl -X GET "https://registry.eden2.io/api/v1/status"

# With API key (for write operations)
curl -X POST "https://registry.eden2.io/api/v1/agents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"handle": "new-agent", "displayName": "New Agent"}'`
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← REGISTRY HOME
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">DEVELOPER TOOLS</h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            REGISTRY SDK • API TESTING • INTEGRATION UTILITIES
          </p>
        </div>

        {/* API Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">API TESTING</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Panel */}
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold uppercase mb-4">ENDPOINT TESTING</h3>
              
              <div className="mb-4">
                <label className="text-xs uppercase tracking-wider opacity-60 mb-2 block">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="registry-api-key..."
                  className="w-full bg-black border border-white/40 p-3 text-sm font-mono"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => testEndpoint('/api/v1/status')}
                  disabled={testing}
                  className="w-full border border-white/40 p-3 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <div className="font-mono text-sm">GET /api/v1/status</div>
                  <div className="text-xs opacity-60">System health check</div>
                </button>

                <button
                  onClick={() => testEndpoint('/api/v1/agents')}
                  disabled={testing}
                  className="w-full border border-white/40 p-3 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <div className="font-mono text-sm">GET /api/v1/agents</div>
                  <div className="text-xs opacity-60">List all agents</div>
                </button>

                <button
                  onClick={() => testEndpoint('/api/v1/agents/abraham')}
                  disabled={testing}
                  className="w-full border border-white/40 p-3 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <div className="font-mono text-sm">GET /api/v1/agents/abraham</div>
                  <div className="text-xs opacity-60">Get Abraham agent details</div>
                </button>

                <button
                  onClick={() => testEndpoint('/api/v1/docs')}
                  disabled={testing}
                  className="w-full border border-white/40 p-3 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <div className="font-mono text-sm">GET /api/v1/docs</div>
                  <div className="text-xs opacity-60">API documentation</div>
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold uppercase mb-4">RESPONSE</h3>
              {testing && (
                <div className="text-sm opacity-60">Testing endpoint...</div>
              )}
              {testResult && !testing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono">
                      Status: {testResult.status} {testResult.statusText}
                    </span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(testResult, null, 2))}
                      className="text-xs border border-white/40 px-2 py-1 hover:bg-white/5"
                    >
                      COPY
                    </button>
                  </div>
                  <pre className="bg-white/5 p-3 text-xs font-mono overflow-auto max-h-64 border border-white/10">
{testResult.error ? 
  testResult.error : 
  JSON.stringify(testResult.data, null, 2)
}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SDK Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">SDK EXAMPLES</h2>
          
          <div className="space-y-8">
            {/* JavaScript */}
            <div className="border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold uppercase">JAVASCRIPT / NODE.JS</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples.javascript)}
                  className="text-xs border border-white/40 px-3 py-1 hover:bg-white/5 uppercase"
                >
                  COPY CODE
                </button>
              </div>
              <pre className="bg-white/5 p-4 text-xs font-mono overflow-auto border border-white/10">
{codeExamples.javascript}
              </pre>
            </div>

            {/* Python */}
            <div className="border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold uppercase">PYTHON</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples.python)}
                  className="text-xs border border-white/40 px-3 py-1 hover:bg-white/5 uppercase"
                >
                  COPY CODE
                </button>
              </div>
              <pre className="bg-white/5 p-4 text-xs font-mono overflow-auto border border-white/10">
{codeExamples.python}
              </pre>
            </div>

            {/* cURL */}
            <div className="border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold uppercase">CURL COMMANDS</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples.curl)}
                  className="text-xs border border-white/40 px-3 py-1 hover:bg-white/5 uppercase"
                >
                  COPY CODE
                </button>
              </div>
              <pre className="bg-white/5 p-4 text-xs font-mono overflow-auto border border-white/10">
{codeExamples.curl}
              </pre>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/docs"
            className="border border-white/20 p-6 hover:bg-white/5 transition-colors"
          >
            <h3 className="text-lg font-bold uppercase mb-2">API DOCUMENTATION</h3>
            <p className="text-sm opacity-60">Complete endpoint reference and schemas</p>
          </Link>

          <Link
            href="/schema"
            className="border border-white/20 p-6 hover:bg-white/5 transition-colors"
          >
            <h3 className="text-lg font-bold uppercase mb-2">DATA SCHEMA</h3>
            <p className="text-sm opacity-60">Agent and Registry data structures</p>
          </Link>

          <Link
            href="/contracts"
            className="border border-white/20 p-6 hover:bg-white/5 transition-colors"
          >
            <h3 className="text-lg font-bold uppercase mb-2">API CONTRACTS</h3>
            <p className="text-sm opacity-60">Generated OpenAPI specification</p>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-xs uppercase tracking-wider opacity-60">
            REGISTRY DEVELOPER TOOLS • FOR SUPPORT CONTACT TECH@EDEN2.IO
          </p>
        </div>
      </div>
    </div>
  )
}