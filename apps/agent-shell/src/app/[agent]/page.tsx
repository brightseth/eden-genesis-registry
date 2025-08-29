import { notFound } from 'next/navigation';
import { loadAgentConfig } from '@/lib/agent-config';
import { FeatureRouter } from '@/components/feature-router';

interface AgentPageProps {
  params: { 
    agent: string; 
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  try {
    const config = await loadAgentConfig(params.agent);
    if (!config) {
      return notFound();
    }
    
    return <FeatureRouter config={config} agent={params.agent} />;
  } catch (error) {
    console.error(`Error loading agent config for ${params.agent}:`, error);
    return notFound();
  }
}

export async function generateStaticParams() {
  // Registry-driven agent discovery
  try {
    const response = await fetch(`${process.env.REGISTRY_BASE_URL || 'https://registry.eden2.io'}/api/v1/agents?status=ACTIVE`);
    
    if (!response.ok) {
      console.warn('Failed to fetch agents from Registry, using fallback list');
      throw new Error('Registry unavailable');
    }
    
    const agents = await response.json();
    
    return agents.map((agent: { handle: string }) => ({
      agent: agent.handle,
    }));
  } catch (error) {
    console.warn('Registry fetch failed, using static fallback:', error);
    
    // Fallback to known agents if Registry is unavailable
    const fallbackAgents = [
      'miyomi', 'abraham', 'solienne', 'bertha', 
      'citizen', 'sue', 'geppetto', 'koru', 'nina', 'amanda'
    ];
    
    return fallbackAgents.map((agent) => ({
      agent,
    }));
  }
}