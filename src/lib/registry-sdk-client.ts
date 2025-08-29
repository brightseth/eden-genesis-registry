/**
 * Registry SDK Client
 * 
 * Deprecated - use registry-client.ts instead
 * 
 * This file maintained for backward compatibility only.
 * Please migrate to the generated client in registry-client.ts
 */

import { registryClient } from './registry-client';

// Legacy compatibility exports
export default {
  agents: {
    list: async (params?: any) => {
      try {
        const response = await registryClient.agents.list(params);
        return { agents: response.data };
      } catch (error) {
        console.warn('Registry client error, returning empty:', error);
        return { agents: [] };
      }
    },
    get: async (id: string) => {
      try {
        const agent = await registryClient.agents.get(id);
        return { agent };
      } catch (error) {
        console.warn('Registry client error, returning null:', error);
        return { agent: null };
      }
    },
    launch: async (id: string, force?: boolean) => {
      // TODO: Implement launch endpoint in registry-client
      console.warn('Launch endpoint not yet implemented in registry-client');
      return { success: false };
    }
  }
};

// Legacy wrapper for backward compatibility
export const legacyRegistryClient = {
  async getAgent(handle: string) {
    try {
      return await registryClient.agents.get(handle);
    } catch (error) {
      console.warn('Registry getAgent error:', error);
      return null;
    }
  },
  
  async listAgents(filters?: any) {
    try {
      const response = await registryClient.agents.list(filters);
      return response.data;
    } catch (error) {
      console.warn('Registry listAgents error:', error);
      return [];
    }
  },
  
  async launchAgent(agentId: string, force = false) {
    // TODO: Implement in registry-client when endpoint is available
    console.warn('launchAgent not implemented yet');
    return { success: false };
  }
};

// Re-export new client for migration
export { registryClient };
export { registryClient as registrySDK };