'use client';

// Import from packages - for now using relative paths, later will use proper workspace imports
import { TradingFeature } from '../../../../packages/features/trading';
import { WorksFeature } from '../../../../packages/features/works';
import { StreamsFeature } from '../../../../packages/features/streams';
import { CollectorFeature } from '../../../../packages/features/collector';
import { DaoFeature } from '../../../../packages/features/dao';

interface FeatureRouterProps {
  config: any;
  agent: string;
}

export function FeatureRouter({ config, agent }: FeatureRouterProps) {
  // Map feature names to components
  const featureMap: Record<string, React.ComponentType<any>> = {
    trading: TradingFeature,
    works: WorksFeature,
    streams: StreamsFeature,
    collector: CollectorFeature,
    dao: DaoFeature,
  };

  // Get the primary feature (first in enabledFeatures array)
  const primaryFeature = config.enabledFeatures?.[0];
  const FeatureComponent = featureMap[primaryFeature];

  if (!FeatureComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{config.name}</h1>
          <p className="text-gray-600">Feature &quot;{primaryFeature}&quot; not implemented yet</p>
          <p className="text-sm text-gray-400 mt-2">Agent: {agent}</p>
        </div>
      </div>
    );
  }

  return <FeatureComponent config={config} agent={agent} />;
}