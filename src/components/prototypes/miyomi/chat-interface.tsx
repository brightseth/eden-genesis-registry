'use client'

export default function MiyomiChatInterface({ agentHandle, metadata }: { agentHandle: string, metadata?: any }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500 p-4 mb-8">
          <h3 className="text-red-400 font-bold uppercase tracking-wide mb-2">ARCHIVED PROTOTYPE</h3>
          <p className="text-sm text-red-300">
            This conversational interface was replaced by the dashboard approach after user feedback showed 
            preference for quick visual data over extended conversations.
          </p>
        </div>

        <div className="bg-black border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide">MIYOMI TRADING AI</h2>
              <p className="text-sm text-white/60">Contrarian Oracle • Chat Interface v2.0</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-2">MIYOMI</div>
              <p>Hey there! I'm seeing some interesting market movements today. BTC is up 3.2% but I'm noticing unusual selling pressure in the derivatives markets. What's your risk appetite looking like?</p>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-lg ml-12">
              <div className="text-xs text-blue-400 mb-2">YOU</div>
              <p>Moderate risk. What's your take on the current setup?</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-white/60 mb-2">MIYOMI</div>
              <div>
                <p className="mb-3">Based on my contrarian analysis:</p>
                <div className="space-y-2 text-sm">
                  <div>📈 <strong>SHORT TERM:</strong> Expecting a pullback to $67,200 - $66,800</div>
                  <div>📊 <strong>SENTIMENT:</strong> Retail FOMO peaking (contrarian signal)</div>
                  <div>🎯 <strong>TRADE IDEA:</strong> Wait for the dip, then long with tight stops</div>
                  <div>⚠️ <strong>RISK:</strong> If we break $69,000, this thesis is invalidated</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 bg-black border border-white/30 px-4 py-2 text-white placeholder-white/50"
                disabled
              />
              <button 
                disabled
                className="bg-white/10 text-white/50 px-6 py-2 uppercase tracking-wide text-sm cursor-not-allowed"
              >
                SEND
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              This is a historical prototype - interaction is disabled
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white/5 p-6">
          <h3 className="font-bold uppercase tracking-wide mb-4">PROTOTYPE INSIGHTS</h3>
          <div className="space-y-3 text-sm">
            <div><strong>User Feedback:</strong> "I want quick data, not conversation"</div>
            <div><strong>Usage Pattern:</strong> Users would ask for trades, then immediately leave</div>
            <div><strong>Evolution:</strong> Led to the current dashboard-first approach</div>
            <div><strong>Learning:</strong> Contrarian oracle works better as a data dashboard than chatbot</div>
          </div>
        </div>
      </div>
    </div>
  )
}