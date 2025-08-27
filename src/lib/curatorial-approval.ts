// Curatorial approval workflow - 3-person panel system for agent launches
// Ensures quality and alignment before agents go live

export interface CuratorialReview {
  id: string
  applicationId: string
  reviewerId: string
  reviewerName: string
  status: 'pending' | 'approved' | 'rejected' | 'abstain'
  score: number // 1-10
  feedback: string
  criteria: {
    alignment: number // 1-10 (Eden Academy mission alignment)
    quality: number // 1-10 (technical and creative quality)
    originality: number // 1-10 (uniqueness and innovation)
    viability: number // 1-10 (long-term sustainability)
  }
  createdAt: Date
  updatedAt: Date
}

export interface CuratorialDecision {
  applicationId: string
  agentId?: string
  decision: 'approved' | 'rejected' | 'needs_revision'
  averageScore: number
  reviewsCount: number
  approvals: number
  rejections: number
  abstentions: number
  unanimity: boolean
  finalizedBy: string
  finalizedAt: Date
  reviews: CuratorialReview[]
  nextSteps: string[]
  conditions?: string[] // Conditional approval requirements
}

export class CuratorialApprovalSystem {
  private static readonly PANEL_SIZE = 3
  private static readonly APPROVAL_THRESHOLD = 6.5 // Average score needed
  private static readonly MIN_APPROVALS = 2 // Minimum individual approvals needed

  /**
   * Initialize curatorial review for an application
   */
  static async initiateReview(applicationId: string, panelIds: string[]): Promise<void> {
    if (panelIds.length !== this.PANEL_SIZE) {
      throw new Error(`Panel must have exactly ${this.PANEL_SIZE} curators`)
    }

    const { prisma } = await import('@/lib/db')
    const { logApiEvent } = await import('@/lib/audit')

    // Verify application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    })

    if (!application) {
      throw new Error('Application not found')
    }

    // Create initial review records
    for (const curatorId of panelIds) {
      // Store in events table with structured data
      await prisma.event.create({
        data: {
          actorUserId: curatorId,
          verb: 'review_assigned',
          entity: 'application',
          entityId: applicationId,
          delta: {
            type: 'curatorial-review',
            status: 'pending',
            assignedAt: new Date().toISOString(),
            panelSize: this.PANEL_SIZE
          }
        }
      })
    }

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'REVIEW' }
    })

    // Log event
    await logApiEvent('initiate', 'curatorial-review', applicationId, {
      panelSize: this.PANEL_SIZE,
      panelIds
    })
  }

  /**
   * Submit a curator's review
   */
  static async submitReview(
    applicationId: string,
    reviewerId: string,
    review: Omit<CuratorialReview, 'id' | 'applicationId' | 'reviewerId' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const { prisma } = await import('@/lib/db')

    // Validate scores
    const scores = [review.score, review.criteria.alignment, review.criteria.quality, 
                   review.criteria.originality, review.criteria.viability]
    if (scores.some(s => s < 1 || s > 10)) {
      throw new Error('All scores must be between 1 and 10')
    }

    // Get reviewer info
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId }
    })

    if (!reviewer) {
      throw new Error('Reviewer not found')
    }

    // Store review in events table
    await prisma.event.create({
      data: {
        actorUserId: reviewerId,
        verb: 'review_submitted',
        entity: 'application',
        entityId: applicationId,
        delta: {
          type: 'curatorial-review',
          reviewerName: reviewer.name || reviewer.email,
          status: review.status,
          score: review.score,
          feedback: review.feedback,
          criteria: review.criteria,
          submittedAt: new Date().toISOString()
        }
      }
    })

    // Check if all reviews are complete
    await this.checkForCompleteness(applicationId)
  }

  /**
   * Check if all reviews are complete and make final decision
   */
  private static async checkForCompleteness(applicationId: string): Promise<void> {
    const { prisma } = await import('@/lib/db')

    // Get all reviews for this application
    const reviews = await prisma.event.findMany({
      where: {
        verb: 'review_submitted',
        entity: 'application',
        entityId: applicationId
      },
      include: {
        actorUser: true
      }
    })

    if (reviews.length < this.PANEL_SIZE) {
      // Not all reviews complete yet
      return
    }

    // Calculate decision
    const decision = this.calculateDecision(applicationId, reviews)
    
    // Store final decision
    await prisma.event.create({
      data: {
        actorSystem: 'ADMIN',
        verb: 'curatorial_decision',
        entity: 'application',
        entityId: applicationId,
        delta: {
          type: 'curatorial-decision',
          decision: decision.decision,
          averageScore: decision.averageScore,
          reviewsCount: decision.reviewsCount,
          approvals: decision.approvals,
          rejections: decision.rejections,
          unanimity: decision.unanimity,
          finalizedAt: decision.finalizedAt.toISOString(),
          nextSteps: decision.nextSteps,
          conditions: decision.conditions
        }
      }
    })

    // Update application status based on decision
    let newStatus: 'ACCEPTED' | 'REJECTED'
    if (decision.decision === 'approved') {
      newStatus = 'ACCEPTED'
    } else {
      newStatus = 'REJECTED'
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus }
    })

    // Send notifications (would integrate with email/webhook system)
    await this.sendDecisionNotification(decision)
  }

  /**
   * Calculate final decision based on all reviews
   */
  private static calculateDecision(applicationId: string, reviewEvents: any[]): CuratorialDecision {
    const reviews: CuratorialReview[] = reviewEvents.map(event => ({
      id: event.id,
      applicationId,
      reviewerId: event.actorUserId!,
      reviewerName: event.actorUser?.name || event.actorUser?.email || 'Anonymous',
      status: event.delta.status,
      score: event.delta.score,
      feedback: event.delta.feedback,
      criteria: event.delta.criteria,
      createdAt: event.createdAt,
      updatedAt: event.createdAt
    }))

    // Count votes
    const approvals = reviews.filter(r => r.status === 'approved').length
    const rejections = reviews.filter(r => r.status === 'rejected').length
    const abstentions = reviews.filter(r => r.status === 'abstain').length

    // Calculate average score (excluding abstentions)
    const scoredReviews = reviews.filter(r => r.status !== 'abstain')
    const averageScore = scoredReviews.reduce((sum, r) => sum + r.score, 0) / scoredReviews.length

    // Determine decision
    let decision: CuratorialDecision['decision']
    const nextSteps: string[] = []
    const conditions: string[] = []

    if (approvals >= this.MIN_APPROVALS && averageScore >= this.APPROVAL_THRESHOLD) {
      decision = 'approved'
      nextSteps.push('Proceed with agent onboarding')
      nextSteps.push('Assign trainer and begin checklist')
      
      // Check for conditional approval
      const lowScores = reviews.filter(r => r.score < 7)
      if (lowScores.length > 0) {
        conditions.push('Address feedback from low-scoring reviews before launch')
        conditions.push('Complete additional alignment training')
      }
    } else if (rejections >= 2 || averageScore < 4) {
      decision = 'rejected'
      nextSteps.push('Provide detailed feedback to applicant')
      nextSteps.push('Offer reapplication pathway with specific improvements')
    } else {
      decision = 'needs_revision'
      nextSteps.push('Request specific revisions based on panel feedback')
      nextSteps.push('Schedule follow-up review after revisions')
    }

    const unanimity = approvals === this.PANEL_SIZE || rejections === this.PANEL_SIZE

    return {
      applicationId,
      decision,
      averageScore,
      reviewsCount: reviews.length,
      approvals,
      rejections,
      abstentions,
      unanimity,
      finalizedBy: 'curatorial-panel',
      finalizedAt: new Date(),
      reviews,
      nextSteps,
      conditions: conditions.length > 0 ? conditions : undefined
    }
  }

  /**
   * Send decision notification
   */
  private static async sendDecisionNotification(decision: CuratorialDecision): Promise<void> {
    // In a real implementation, this would send emails/webhooks
    console.log('Curatorial Decision:', {
      applicationId: decision.applicationId,
      decision: decision.decision,
      averageScore: decision.averageScore,
      unanimity: decision.unanimity
    })

    // Would integrate with existing webhook/email systems
    const { sendWebhook } = await import('@/lib/webhooks')
    await sendWebhook('curatorial.decision', decision)
  }

  /**
   * Get review status for an application
   */
  static async getReviewStatus(applicationId: string) {
    const { prisma } = await import('@/lib/db')

    // Get all review-related events
    const events = await prisma.event.findMany({
      where: {
        entity: 'application',
        entityId: applicationId,
        verb: { in: ['review_assigned', 'review_submitted', 'curatorial_decision'] }
      },
      include: {
        actorUser: true
      },
      orderBy: { createdAt: 'asc' }
    })

    const assignments = events.filter(e => e.verb === 'review_assigned')
    const submissions = events.filter(e => e.verb === 'review_submitted')
    const decisions = events.filter(e => e.verb === 'curatorial_decision')

    return {
      applicationId,
      panelSize: assignments.length,
      reviewsSubmitted: submissions.length,
      reviewsPending: assignments.length - submissions.length,
      isComplete: submissions.length >= this.PANEL_SIZE,
      finalDecision: decisions[0]?.delta || null,
      reviews: submissions.map(s => ({
        reviewerId: s.actorUserId,
        reviewerName: s.actorUser?.name || s.actorUser?.email,
        status: s.delta.status,
        score: s.delta.score,
        submittedAt: s.createdAt
      }))
    }
  }

  /**
   * Get all pending reviews for a curator
   */
  static async getPendingReviews(curatorId: string) {
    const { prisma } = await import('@/lib/db')

    // Find assigned reviews that haven't been submitted
    const assignments = await prisma.event.findMany({
      where: {
        actorUserId: curatorId,
        verb: 'review_assigned'
      }
    })

    const submissions = await prisma.event.findMany({
      where: {
        actorUserId: curatorId,
        verb: 'review_submitted'
      }
    })

    const submittedIds = submissions.map(s => s.entityId)
    const pending = assignments.filter(a => !submittedIds.includes(a.entityId))

    // Get application details for pending reviews
    const pendingApplications = await Promise.all(
      pending.map(async (p) => {
        const application = await prisma.application.findUnique({
          where: { id: p.entityId }
        })
        return {
          applicationId: p.entityId,
          assignedAt: p.createdAt,
          application
        }
      })
    )

    return pendingApplications
  }

  /**
   * Health check for curatorial system
   */
  static async healthCheck() {
    try {
      const { prisma } = await import('@/lib/db')

      // Count pending reviews
      const pendingReviews = await prisma.event.count({
        where: {
          verb: 'review_assigned',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })

      // Count completed decisions
      const completedDecisions = await prisma.event.count({
        where: {
          verb: 'curatorial_decision',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })

      return {
        healthy: true,
        details: {
          pendingReviews,
          completedDecisions,
          panelSize: this.PANEL_SIZE,
          approvalThreshold: this.APPROVAL_THRESHOLD,
          minApprovals: this.MIN_APPROVALS
        }
      }
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }
}