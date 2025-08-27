// Launch validation system with relaxed requirements for first 8 agents
// Supports creative prototyping while maintaining Registry integrity

export interface LaunchValidationResult {
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

// Genesis agent numbers - these get relaxed validation
const GENESIS_AGENT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8]

export class LaunchValidator {
  /**
   * Validates an agent for launch with relaxed requirements for Genesis cohort
   */
  static async validateAgentLaunch(agentId: string): Promise<LaunchValidationResult> {
    // Get agent data
    const { prisma } = await import('@/lib/db')
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        profile: true,
        creations: true,
        personas: true,
        checklists: true,
        socialAccounts: true
      }
    })

    if (!agent) {
      return {
        isValid: false,
        score: 0,
        gates: {
          demand: { passed: false, score: 0, details: 'Agent not found' },
          retention: { passed: false, score: 0, details: 'Agent not found' },
          efficiency: { passed: false, score: 0, details: 'Agent not found' }
        },
        recommendations: ['Agent must exist in Registry'],
        requiresApproval: true
      }
    }

    // Check if this is a Genesis agent (first 8) - gets relaxed validation
    const isGenesisAgent = GENESIS_AGENT_NUMBERS.includes(agent.agentNumber)
    
    if (isGenesisAgent) {
      return this.validateGenesisAgent(agent)
    } else {
      return this.validateStandardAgent(agent)
    }
  }

  /**
   * Relaxed validation for Genesis agents (first 8)
   */
  private static validateGenesisAgent(agent: any): LaunchValidationResult {
    const gates = {
      demand: this.validateDemandGateRelaxed(agent),
      retention: this.validateRetentionGateRelaxed(agent),
      efficiency: this.validateEfficiencyGateRelaxed(agent)
    }

    const overallScore = (gates.demand.score + gates.retention.score + gates.efficiency.score) / 3
    const allGatesPassed = gates.demand.passed && gates.retention.passed && gates.efficiency.passed

    return {
      isValid: allGatesPassed,
      score: overallScore,
      gates,
      recommendations: this.generateRecommendations(gates, true),
      requiresApproval: !allGatesPassed // Genesis agents only need approval if they fail relaxed validation
    }
  }

  /**
   * Standard validation for non-Genesis agents
   */
  private static validateStandardAgent(agent: any): LaunchValidationResult {
    const gates = {
      demand: this.validateDemandGate(agent),
      retention: this.validateRetentionGate(agent),
      efficiency: this.validateEfficiencyGate(agent)
    }

    const overallScore = (gates.demand.score + gates.retention.score + gates.efficiency.score) / 3
    const allGatesPassed = gates.demand.passed && gates.retention.passed && gates.efficiency.passed

    return {
      isValid: allGatesPassed,
      score: overallScore,
      gates,
      recommendations: this.generateRecommendations(gates, false),
      requiresApproval: true // Standard agents always require curatorial approval
    }
  }

  // RELAXED VALIDATION GATES (for Genesis agents)

  private static validateDemandGateRelaxed(agent: any) {
    let score = 0
    let details = []

    // Basic profile completeness (50 points)
    if (agent.profile?.statement) score += 25
    if (agent.displayName && agent.handle) score += 25

    // Any creative output (30 points)
    if (agent.creations?.length > 0) score += 30

    // Basic persona defined (20 points)
    if (agent.personas?.length > 0) score += 20

    const passed = score >= 50 // Relaxed from 80
    details.push(`Profile completeness: ${score}/100`)
    
    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  private static validateRetentionGateRelaxed(agent: any) {
    let score = 0
    const details = []

    // Onboarding checklist progress (flexible)
    const checklist = agent.checklists?.[0]
    if (checklist) {
      score += Math.min(checklist.percent * 60, 60) // Up to 60 points
    }

    // Social presence (relaxed)
    if (agent.socialAccounts?.length > 0) score += 40

    const passed = score >= 40 // Relaxed from 70
    details.push(`Onboarding progress: ${checklist?.percent || 0}%`)
    details.push(`Social accounts: ${agent.socialAccounts?.length || 0}`)

    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  private static validateEfficiencyGateRelaxed(agent: any) {
    let score = 0
    const details = []

    // Active status (simplified)
    if (agent.status === 'ACTIVE') {
      score += 60
    } else if (agent.status === 'ONBOARDING') {
      score += 40
    } else {
      score += 20
    }

    // Any creative output shows efficiency
    if (agent.creations?.length > 0) {
      score += 40
    }

    const passed = score >= 50 // Very relaxed threshold
    details.push(`Status: ${agent.status}`)
    details.push(`Creations: ${agent.creations?.length || 0}`)

    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  // STANDARD VALIDATION GATES (for future agents)

  private static validateDemandGate(agent: any) {
    let score = 0
    let details = []

    // Profile completeness (40 points)
    if (agent.profile?.statement) score += 20
    if (agent.profile?.manifesto) score += 10
    if (agent.profile?.tags?.length > 0) score += 10

    // Creative portfolio (40 points)
    const creationCount = agent.creations?.length || 0
    score += Math.min(creationCount * 10, 40)

    // Persona sophistication (20 points)
    const personaCount = agent.personas?.length || 0
    score += Math.min(personaCount * 10, 20)

    const passed = score >= 80
    details.push(`Profile score: ${score}/100`)
    
    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  private static validateRetentionGate(agent: any) {
    let score = 0
    const details = []

    // Onboarding completion (50 points)
    const checklist = agent.checklists?.[0]
    if (checklist) {
      score += Math.min(checklist.percent * 50, 50)
    }

    // Social engagement (30 points)
    const socialCount = agent.socialAccounts?.length || 0
    score += Math.min(socialCount * 15, 30)

    // Consistent output (20 points)
    const recentCreations = agent.creations?.filter((c: any) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(c.createdAt) > weekAgo
    })?.length || 0
    score += Math.min(recentCreations * 10, 20)

    const passed = score >= 70
    details.push(`Onboarding: ${checklist?.percent || 0}%`)
    details.push(`Social presence: ${socialCount} accounts`)
    details.push(`Recent activity: ${recentCreations} creations`)

    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  private static validateEfficiencyGate(agent: any) {
    let score = 0
    const details = []

    // Operational readiness (60 points)
    if (agent.status === 'ACTIVE') score += 60
    else if (agent.status === 'ONBOARDING') score += 30

    // Output quality (40 points)
    const publishedCreations = agent.creations?.filter((c: any) => c.status === 'PUBLISHED')?.length || 0
    score += Math.min(publishedCreations * 10, 40)

    const passed = score >= 75
    details.push(`Status: ${agent.status}`)
    details.push(`Published works: ${publishedCreations}`)

    return {
      passed,
      score,
      details: details.join('; ')
    }
  }

  private static generateRecommendations(gates: any, isGenesis: boolean): string[] {
    const recommendations = []

    if (!gates.demand.passed) {
      if (isGenesis) {
        recommendations.push('Complete basic profile with statement and display name')
        recommendations.push('Add at least one persona or creative work')
      } else {
        recommendations.push('Enhance profile with manifesto and tags')
        recommendations.push('Build portfolio with multiple creative works')
      }
    }

    if (!gates.retention.passed) {
      if (isGenesis) {
        recommendations.push('Make progress on onboarding checklist')
        recommendations.push('Set up at least one social account')
      } else {
        recommendations.push('Complete onboarding checklist fully')
        recommendations.push('Establish consistent creative output')
        recommendations.push('Build social media presence across platforms')
      }
    }

    if (!gates.efficiency.passed) {
      if (isGenesis) {
        recommendations.push('Ensure agent status is ONBOARDING or ACTIVE')
        recommendations.push('Create at least one work to demonstrate capability')
      } else {
        recommendations.push('Achieve ACTIVE status with full operational readiness')
        recommendations.push('Publish high-quality creative works consistently')
      }
    }

    return recommendations
  }
}