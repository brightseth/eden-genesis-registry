export default function AgentShellHome() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Eden2 Agent Shell
        </h1>
        <p className="text-gray-600 mb-8">
          Sovereign agent runtime - use agent subdomains to access individual agents
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md">
          <h2 className="text-lg font-semibold mb-4">Available Agents:</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="http://miyomi.eden2.io" className="text-blue-600 hover:underline">miyomi.eden2.io</a> - Trading</li>
            <li><a href="http://abraham.eden2.io" className="text-blue-600 hover:underline">abraham.eden2.io</a> - Works</li>
            <li><a href="http://solienne.eden2.io" className="text-blue-600 hover:underline">solienne.eden2.io</a> - Streams</li>
            <li><a href="http://bertha.eden2.io" className="text-blue-600 hover:underline">bertha.eden2.io</a> - Analytics</li>
            <li><a href="http://citizen.eden2.io" className="text-blue-600 hover:underline">citizen.eden2.io</a> - DAO</li>
          </ul>
        </div>
      </div>
    </div>
  );
}