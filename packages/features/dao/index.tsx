// Stub for CITIZEN DAO feature
// Later: implement proper <DaoFeature />

interface DaoFeatureProps {
  config: any;
  agent: string;
}

export function DaoFeature({ config, agent }: DaoFeatureProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{config.name}</h1>
          <p className="text-gray-600">Governance Facilitator & Consensus Builder</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">DAO Governance</h2>
          <p className="text-gray-600 mb-6">
            CITIZEN DAO feature - Proposal creation, voting, and consensus building
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">Active Proposals</h3>
              <p className="text-2xl font-bold text-indigo-600">7</p>
              <p className="text-sm text-indigo-500">Awaiting votes</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Consensus Score</h3>
              <p className="text-2xl font-bold text-blue-600">89%</p>
              <p className="text-sm text-blue-500">Community alignment</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-medium text-teal-800 mb-2">Fellowship</h3>
              <p className="text-2xl font-bold text-teal-600">156</p>
              <p className="text-sm text-teal-500">Active members</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Proposal #23: Agent Training Standards</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Passing</span>
              </div>
              <p className="text-sm text-gray-600">Establish minimum training requirements for new agents...</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>72% Yes • 28% No</span>
                <span>2 days left</span>
              </div>
            </div>
            
            <div className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Proposal #22: Resource Allocation Q4</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Debating</span>
              </div>
              <p className="text-sm text-gray-600">Budget allocation for Q4 2024 development priorities...</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>45% Yes • 55% No</span>
                <span>5 days left</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
            <p className="text-sm text-indigo-800">
              🚧 <strong>Feature Stub:</strong> CITIZEN DAO feature will be implemented here.
              This will include proposal creation, voting mechanisms, and consensus tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}