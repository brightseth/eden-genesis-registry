import { prisma } from './db'
import { ActorSystem } from '@prisma/client'

interface AuditLogOptions {
  actorUserId?: string
  actorSystem?: ActorSystem
  verb: string
  entity: string
  entityId: string
  delta?: Record<string, unknown>
}

export async function logEvent({
  actorUserId,
  actorSystem,
  verb,
  entity,
  entityId,
  delta
}: AuditLogOptions) {
  return prisma.event.create({
    data: {
      actorUserId,
      actorSystem,
      verb,
      entity,
      entityId,
      delta
    }
  })
}

export async function logApiEvent(
  verb: string,
  entity: string,
  entityId: string,
  delta?: Record<string, unknown>,
  userId?: string
) {
  return logEvent({
    actorUserId: userId,
    actorSystem: ActorSystem.API,
    verb,
    entity,
    entityId,
    delta
  })
}