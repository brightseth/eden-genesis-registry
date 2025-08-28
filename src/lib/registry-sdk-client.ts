/**
 * Registry SDK Client
 * 
 * Wrapper around the generated Eden Registry SDK
 * Replaces raw fetch patterns per ADR-019 compliance
 */

import EdenRegistrySDK from '@eden/registry-sdk'

// Initialize the SDK with proper configuration
const registrySDK = new EdenRegistrySDK({
  baseUrl: process.env.REGISTRY_URL || 'http://localhost:3000',
  apiKey: process.env.REGISTRY_API_KEY,
  timeout: 10000
})

export default registrySDK

// Export convenience functions for common operations
export const registryClient = {
  // Agent operations
  async getAgents(filters?: { cohort?: string; status?: string }) {
    return registrySDK.getAgents(filters?.cohort, filters?.status)
  },
  
  async getAgent(id: string) {
    return registrySDK.getAgent(id)
  },
  
  async getAgentProfile(id: string) {
    return registrySDK.getProfile(id)
  },
  
  async updateAgentProfile(id: string, profileData: any) {
    return registrySDK.updateProfile(id, profileData)
  },
  
  // Creation operations
  async getAgentCreations(id: string, status?: string) {
    return registrySDK.getCreations(id, status)
  },
  
  async createAgentWork(id: string, workData: any) {
    return registrySDK.createCreation(id, workData)
  },
  
  // Application operations
  async submitApplication(applicationData: any) {
    return registrySDK.createApplication(applicationData)
  },
  
  // Documentation operations
  async getDocumentation() {
    return registrySDK.getDocs()
  },
  
  async getDocumentationByCategory(category: string) {
    return registrySDK.getDocsByCategory(category)
  },
  
  async getDocument(category: string, slug: string) {
    return registrySDK.getDocument(category, slug)
  },
  
  // Authentication operations
  async startMagicAuth(email: string) {
    return registrySDK.startMagicAuth({ email })
  },
  
  async completeMagicAuth(token: string) {
    return registrySDK.completeMagicAuth({ token })
  },
  
  // Webhook operations
  async registerWebhook(url: string, events: string[]) {
    return registrySDK.registerWebhook({ url, events })
  }
}

// Export the raw SDK for advanced usage
export { EdenRegistrySDK }
export { registrySDK }