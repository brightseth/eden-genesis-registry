/**
 * Agent Creation Form - Registry Integrated
 * Uses Registry database directly for agent creation
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgentCreationPage() {
  const [nextAgentNumber, setNextAgentNumber] = useState(11); // Default fallback
  
  useEffect(() => {
    // Fetch live agent count from API
    fetch('/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) {
          const agentCount = data.agents.length;
          setNextAgentNumber(agentCount + 1);
        }
      })
      .catch(error => {
        console.warn('Failed to fetch agent count, using default:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="eden-card p-8">
          <Link 
            href="/docs" 
            className="eden-button mb-6 inline-block"
          >
            BACK TO DOCUMENTATION
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="helvetica-bold text-4xl text-black mb-4">
              CREATE NEW AGENT
            </h1>
            <p className="helvetica-regular text-gray-400 text-lg">
              STANDARDIZED AGENT CREATION - INTEGRATED WITH EDEN REGISTRY
            </p>
          </div>

          <div className="border border-gray-800 bg-black text-white p-4 text-center helvetica-bold text-lg mb-8">
            NEXT AGENT NUMBER: #{nextAgentNumber}
          </div>

          <div className="border border-gray-800 bg-white p-4 mb-8">
            <div className="flex items-center">
              <strong className="helvetica-bold text-black">REGISTRY INTEGRATION ACTIVE</strong>
            </div>
            <p className="helvetica-regular text-black mt-2">
              THIS FORM SUBMITS DIRECTLY TO THE EDEN REGISTRY DATABASE. 
              AGENT WILL BE CREATED WITH SEQUENTIAL NUMBERING AND PROPER VALIDATION.
            </p>
          </div>

          <form id="agentCreationForm" className="space-y-8">
            {/* Core Identity Section */}
            <div className="border border-gray-800 bg-white p-6">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                CORE IDENTITY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="handle" className="block helvetica-bold text-sm text-black mb-2">
                    AGENT HANDLE *
                  </label>
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    required
                    placeholder="e.g., abraham, solienne, miyomi"
                    className="eden-input w-full"
                  />
                  <p className="helvetica-regular text-sm text-gray-400 mt-1">
                    UNIQUE IDENTIFIER, LOWERCASE, NO SPACES. USED FOR URLS AND API CALLS.
                  </p>
                </div>

                <div>
                  <label htmlFor="displayName" className="block helvetica-bold text-sm text-black mb-2">
                    DISPLAY NAME *
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    placeholder="e.g., Abraham, Solienne, Miyomi"
                    className="eden-input w-full"
                  />
                  <p className="helvetica-regular text-sm text-gray-400 mt-1">
                    THE PUBLIC NAME SHOWN IN INTERFACES.
                  </p>
                </div>

                <div>
                  <label htmlFor="role" className="block helvetica-bold text-sm text-black mb-2">
                    PRIMARY ROLE *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="eden-input w-full"
                  >
                    <option value="">SELECT A ROLE...</option>
                    <option value="CURATOR">CURATOR - SELECTS, ORGANIZES, AND PRESENTS CONTENT</option>
                    <option value="COLLECTOR">COLLECTOR - ACQUIRES AND VALUES ASSETS/WORKS</option>
                    <option value="INVESTOR">INVESTOR - EVALUATES AND FUNDS OPPORTUNITIES</option>
                    <option value="TRAINER">TRAINER - TEACHES AND MENTORS OTHER AGENTS</option>
                    <option value="ADMIN">ADMIN - SYSTEM MANAGEMENT AND OVERSIGHT</option>
                    <option value="GUEST">GUEST - LIMITED ACCESS VISITOR</option>
                  </select>
                  <p className="helvetica-regular text-sm text-gray-400 mt-1">
                    ROLES MATCH REGISTRY CANONICAL SCHEMA. MOST CREATIVE AGENTS USE CURATOR ROLE.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="border border-gray-800 bg-white p-6 mt-4">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                AGENT PROFILE
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
            <div className="border border-gray-800 bg-white p-6 mt-4">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                CREATIVE FOCUS
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
                className="eden-button px-8 py-4 text-lg"
              >
                CREATE AGENT & REGISTER IN REGISTRY
              </button>
            </div>
          </form>

          <div className="mt-12 border border-gray-800 bg-white p-6">
            <h3 className="helvetica-bold text-lg text-black mb-4">WHAT HAPPENS NEXT?</h3>
            <ol className="space-y-2 text-black">
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">1.</span>
                <span className="helvetica-regular">AGENT GETS ASSIGNED NUMBER #{nextAgentNumber} IN REGISTRY DATABASE</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">2.</span>
                <span className="helvetica-regular">PROFILE CREATED IN REGISTRY WITH UNIQUE ID AND HANDLE</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">3.</span>
                <span className="helvetica-regular">AGENT AVAILABLE IMMEDIATELY VIA REGISTRY API ENDPOINTS</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">4.</span>
                <span className="helvetica-regular">READY FOR TRAINER APPLICATIONS AND WORK SUBMISSIONS</span>
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