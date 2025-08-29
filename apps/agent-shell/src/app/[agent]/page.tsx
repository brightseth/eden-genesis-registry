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
  // Generate static params for known agents
  const agents = [
    'miyomi',
    'abraham', 
    'solienne',
    'bertha',
    'citizen',
    'sue',
    'geppetto',
    'koru',
    'nina',
    'amanda'
  ];
  
  return agents.map((agent) => ({
    agent,
  }));
}