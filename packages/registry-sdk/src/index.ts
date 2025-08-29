/**
 * Registry SDK v1 - Main Export
 * REGISTRY-GUARDIAN: Official SDK for Eden Registry
 */

// Export client
export {
  RegistryClient,
  createRegistryClient,
  createDefaultClient
} from './client'

// Export all types
export * from './types'

// Version
export const SDK_VERSION = '1.0.0'

// Default exports for convenience
export { createDefaultClient as default } from './client'