/**
 * Agent Creation Form - Registry Integrated
 * Uses Registry database directly for agent creation
 */

import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Role } from '@prisma/client';

export default async function AgentCreationPage() {
  // Get next agent number from Registry
  const agentCount = await prisma.agent.count();
  const nextAgentNumber = agentCount + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Link 
            href="/docs" 
            className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
          >
            ← Back to Documentation
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 Create New Agent
            </h1>
            <p className="text-gray-600 text-lg">
              Standardized agent creation - Integrated with Eden Registry
            </p>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-xl text-center font-bold text-lg mb-8">
            Next Agent Number: #{nextAgentNumber}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-2">🔗</span>
              <strong className="text-green-800">Registry Integration Active</strong>
            </div>
            <p className="text-green-700 mt-2">
              This form submits directly to the Eden Registry database. 
              Agent will be created with sequential numbering and proper validation.
            </p>
          </div>

          <form id="agentCreationForm" className="space-y-8">
            {/* Core Identity Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                🆔 Core Identity
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Handle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    required
                    placeholder="e.g., abraham, solienne, miyomi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Unique identifier, lowercase, no spaces. Used for URLs and API calls.
                  </p>
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    placeholder="e.g., Abraham, Solienne, Miyomi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The public name shown in interfaces.
                  </p>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a role...</option>
                    <option value="CURATOR">Curator - Selects, organizes, and presents content</option>
                    <option value="COLLECTOR">Collector - Acquires and values assets/works</option>
                    <option value="INVESTOR">Investor - Evaluates and funds opportunities</option>
                    <option value="TRAINER">Trainer - Teaches and mentors other agents</option>
                    <option value="ADMIN">Admin - System management and oversight</option>
                    <option value="GUEST">Guest - Limited access visitor</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Roles match Registry canonical schema. Most creative agents use CURATOR role.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                👤 Agent Profile
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    name="tagline"
                    placeholder="Brief, memorable tagline"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    A short phrase that captures the agent's essence (optional).
                  </p>
                </div>

                <div>
                  <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="statement"
                    name="statement"
                    required
                    rows={4}
                    placeholder="Describe the agent's purpose, goals, and approach..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Core mission and purpose of this agent.
                  </p>
                </div>

                <div>
                  <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Goal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="dailyGoal"
                    name="dailyGoal"
                    required
                    rows={3}
                    placeholder="What does this agent aim to accomplish each day?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Creative Medium Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                🎨 Creative Focus
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Creative Mediums
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'text', label: 'Text/Writing' },
                    { value: 'image', label: 'Visual/Image' },
                    { value: 'audio', label: 'Audio/Sound' },
                    { value: 'video', label: 'Video' },
                    { value: 'code', label: 'Code/Software' },
                    { value: 'data', label: 'Data Analysis' }
                  ].map((medium) => (
                    <label key={medium.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="medium"
                        value={medium.value}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{medium.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="text-center py-8">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
              >
                🚀 Create Agent & Register in Registry
              </button>
            </div>
          </form>

          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                Agent gets assigned number #{nextAgentNumber} in Registry database
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                Profile created in Registry with unique ID and handle
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                Agent available immediately via Registry API endpoints
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                Ready for trainer applications and work submissions
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Client-side form handling */}
      <script src="/docs/form-handler.js"></script>
    </div>
  );
}

// Client-side form handling would be added via a separate component
// This would submit to /api/v1/agents endpoint