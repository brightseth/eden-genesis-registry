import { z } from 'zod'
import { AgentStatus, Visibility, Role, ApplicationTrack, PersonaPrivacy, ArtifactKind, CreationStatus, SocialPlatform, KeyType } from '@prisma/client'

// Agent schemas
export const createAgentSchema = z.object({
  handle: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
  displayName: z.string().min(1).max(100),
  role: z.string().optional(),
  cohortId: z.string().cuid(),
  status: z.nativeEnum(AgentStatus).optional(),
  visibility: z.nativeEnum(Visibility).optional()
})

export const updateAgentSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  role: z.string().optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  visibility: z.nativeEnum(Visibility).optional()
})

// Profile schemas
export const profileSchema = z.object({
  statement: z.string().max(1000).optional(),
  manifesto: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z.object({
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().optional()
  }).optional()
})

// Persona schemas
export const personaSchema = z.object({
  name: z.string().min(1).max(100),
  version: z.string().default('0.1.0'),
  prompt: z.string().min(1),
  alignmentNotes: z.string().optional(),
  privacy: z.nativeEnum(PersonaPrivacy).default(PersonaPrivacy.INTERNAL)
})

// Artifact schemas
export const artifactSchema = z.object({
  kind: z.nativeEnum(ArtifactKind),
  version: z.string(),
  storageUri: z.string().url(),
  hash: z.string().optional(),
  sizeBytes: z.number().optional(),
  license: z.string().optional(),
  visibility: z.nativeEnum(Visibility).default(Visibility.INTERNAL),
  notes: z.string().optional()
})

// Creation schemas
export const creationSchema = z.object({
  title: z.string().min(1).max(200),
  mediaUri: z.string().url().optional(),
  metadata: z.object({
    prompts: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
    provenance: z.record(z.unknown()).optional()
  }).optional(),
  publishedTo: z.object({
    ethereum: z.object({
      txHash: z.string(),
      contractAddress: z.string(),
      tokenId: z.string()
    }).optional(),
    farcaster: z.object({
      castId: z.string()
    }).optional()
  }).optional(),
  status: z.nativeEnum(CreationStatus).default(CreationStatus.DRAFT)
})

// Application schemas
export const applicationSchema = z.object({
  applicantEmail: z.string().email(),
  applicantName: z.string().min(1).max(100),
  track: z.nativeEnum(ApplicationTrack),
  payload: z.record(z.unknown()) // Flexible JSON payload for experimental forms
})

// Strict application schema for canonical forms
export const strictApplicationSchema = z.object({
  applicantEmail: z.string().email(),
  applicantName: z.string().min(1).max(100),
  track: z.nativeEnum(ApplicationTrack),
  payload: z.object({
    experience: z.string().optional(),
    portfolio: z.string().url().optional(),
    statement: z.string().max(1000),
    referral: z.string().optional()
  })
})

// Invitation schemas
export const invitationSchema = z.object({
  email: z.string().email(),
  roleTarget: z.nativeEnum(Role),
  agentId: z.string().cuid().optional(),
  cohortId: z.string().cuid().optional()
})

// Social account schemas
export const socialAccountSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  handle: z.string().min(1).max(100),
  credentialRef: z.string().optional()
})

// Key schemas
export const keySchema = z.object({
  type: z.nativeEnum(KeyType),
  vaultPath: z.string(),
  notes: z.string().optional()
})

// Auth schemas
export const magicLinkSchema = z.object({
  email: z.string().email()
})

export const verifyMagicLinkSchema = z.object({
  token: z.string()
})

// Webhook schemas
export const webhookSubscriptionSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1)
})

// Progress schemas
export const updateProgressSchema = z.object({
  itemId: z.string(),
  done: z.boolean()
})