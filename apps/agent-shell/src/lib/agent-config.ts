import fs from 'fs';
import path from 'path';

export interface AgentConfig {
  slug: string;
  name: string;
  displayName: string;
  role: string;
  enabledFeatures: string[];
  routes: Record<string, string>;
  seo: {
    title: string;
    description?: string;
  };
  theme?: any;
}

export async function loadAgentConfig(slug: string): Promise<AgentConfig | null> {
  try {
    // Path to agent config file
    const configPath = path.join(process.cwd(), '../../agents', slug, 'agent.config.ts');
    
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      console.warn(`Agent config not found: ${configPath}`);
      return null;
    }
    
    // Dynamically import the config
    const { default: config } = await import(configPath);
    
    return {
      slug,
      ...config,
    };
  } catch (error) {
    console.error(`Error loading agent config for ${slug}:`, error);
    return null;
  }
}