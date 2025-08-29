import { z } from 'zod'

export const PrototypeVersionSchema = z.object({
  id: z.string(),
  version: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['dashboard', 'interface', 'component', 'api', 'full-site']),
  status: z.enum(['active', 'archived', 'deprecated', 'experimental']),
  url: z.string().url().optional(),
  component: z.string().optional(), // Component path for embedded prototypes
  features: z.array(z.string()),
  createdAt: z.string().datetime(),
  archivedAt: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AgentPrototypeCollectionSchema = z.object({
  agentHandle: z.string(),
  prototypes: z.array(PrototypeVersionSchema),
  experiments: z.array(PrototypeVersionSchema),
  archived: z.array(PrototypeVersionSchema),
  activeExperiments: z.number(),
  totalPrototypes: z.number(),
  lastUpdated: z.string().datetime(),
})

export const BetaFeatureFlagSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  agentHandle: z.string(),
  prototypeId: z.string().optional(),
  enabledEnvironments: z.array(z.enum(['development', 'staging', 'beta', 'production'])),
  rolloutPercentage: z.number().min(0).max(100),
  metadata: z.record(z.unknown()).optional(),
})

export type PrototypeVersion = z.infer<typeof PrototypeVersionSchema>
export type AgentPrototypeCollection = z.infer<typeof AgentPrototypeCollectionSchema>
export type BetaFeatureFlag = z.infer<typeof BetaFeatureFlagSchema>