'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, AlertCircle, Rocket } from 'lucide-react'

interface LaunchValidation {
  agent: {
    id: string
    handle: string
    displayName: string
    agentNumber: number
    status: string
  }
  validation: {
    isValid: boolean
    score: number
    gates: {
      demand: { passed: boolean; score: number; details: string }
      retention: { passed: boolean; score: number; details: string } 
      efficiency: { passed: boolean; score: number; details: string }
    }
    recommendations: string[]
    requiresApproval: boolean
  }
}

interface LaunchSummary {
  totalAgents: number
  readyToLaunch: number
  needsWork: number
  averageScore: number
}

export default function LaunchDashboard() {
  const [validations, setValidations] = useState<LaunchValidation[]>([])
  const [summary, setSummary] = useState<LaunchSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [launching, setLaunching] = useState<Set<string>>(new Set())

  const fetchValidations = async () => {
    try {
      const response = await fetch('/api/v1/agents/launch?cohort=genesis-2024')
      if (response.ok) {
        const data = await response.json()
        setValidations(data.validations || [])
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to fetch launch validations:', error)
    } finally {
      setLoading(false)
    }
  }

  const launchAgent = async (agentId: string, force = false) => {
    setLaunching(prev => new Set([...prev, agentId]))
    
    try {
      const response = await fetch('/api/v1/agents/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, force })
      })
      
      if (response.ok) {
        // Refresh validations after launch
        await fetchValidations()
      } else {
        console.error('Launch failed:', await response.text())
      }
    } catch (error) {
      console.error('Launch error:', error)
    } finally {
      setLaunching(prev => {
        const next = new Set(prev)
        next.delete(agentId)
        return next
      })
    }
  }

  useEffect(() => {
    fetchValidations()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading launch dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Genesis Launch Dashboard</h1>
        <Button onClick={fetchValidations} variant="outline">
          Refresh
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalAgents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ready to Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.readyToLaunch}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Needs Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.needsWork}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.averageScore.toFixed(1)}/100</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {validations.map((validation) => (
          <Card key={validation.agent.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold">
                    {validation.agent.displayName}
                  </div>
                  <Badge variant="outline">#{validation.agent.agentNumber}</Badge>
                  <Badge 
                    variant={validation.agent.status === 'ACTIVE' ? 'default' : 'secondary'}
                  >
                    {validation.agent.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  {validation.validation.isValid ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <span className="font-medium">
                    {validation.validation.score.toFixed(1)}/100
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Progress value={validation.validation.score} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {validation.validation.gates.demand.passed ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-red-500" size={16} />
                    )}
                    <span className="font-medium">Demand Gate</span>
                    <span className="text-sm text-gray-600">
                      {validation.validation.gates.demand.score}/100
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {validation.validation.gates.demand.details}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {validation.validation.gates.retention.passed ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-red-500" size={16} />
                    )}
                    <span className="font-medium">Retention Gate</span>
                    <span className="text-sm text-gray-600">
                      {validation.validation.gates.retention.score}/100
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {validation.validation.gates.retention.details}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {validation.validation.gates.efficiency.passed ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-red-500" size={16} />
                    )}
                    <span className="font-medium">Efficiency Gate</span>
                    <span className="text-sm text-gray-600">
                      {validation.validation.gates.efficiency.score}/100
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {validation.validation.gates.efficiency.details}
                  </div>
                </div>
              </div>
              
              {validation.validation.recommendations.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-yellow-500" size={16} />
                    <span className="font-medium">Recommendations</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {validation.validation.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => launchAgent(validation.agent.id, false)}
                  disabled={!validation.validation.isValid || launching.has(validation.agent.id)}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Rocket size={16} />
                  <span>Launch</span>
                </Button>
                
                <Button
                  onClick={() => launchAgent(validation.agent.id, true)}
                  disabled={launching.has(validation.agent.id)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Rocket size={16} />
                  <span>Force Launch</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}