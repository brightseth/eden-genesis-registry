/**
 * Trainer Application Form - Registry Integrated
 * Connects directly to Registry to show available agents and submit applications
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainerApplicationPage() {
  const [availableAgents, setAvailableAgents] = useState([]);
  
  useEffect(() => {
    // Fetch available agents from Registry API
    fetch('/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) {
          // Filter agents that can be trained
          const trainableAgents = data.agents.filter(agent => 
            agent.status === 'ACTIVE' && 
            ['CURATOR', 'COLLECTOR'].includes(agent.role)
          );
          setAvailableAgents(trainableAgents);
        }
      })
      .catch(error => {
        console.warn('Failed to fetch available agents:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-red-800">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Link 
            href="/docs" 
            className="text-orange-500 hover:text-orange-700 mb-6 inline-block"
          >
            ← Back to Documentation
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              👨‍🏫 Apply to Train an Agent
            </h1>
            <p className="text-gray-600 text-lg">
              Registry-integrated trainer application system
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-2">🔗</span>
              <strong className="text-green-800">Registry Integration Active</strong>
            </div>
            <p className="text-green-700 mt-2">
              This application connects to Registry data. Agent list is live from Registry database.
              Training relationships tracked in Registry system.
            </p>
          </div>

          <form id="trainerApplicationForm" className="space-y-8">
            {/* Agent Selection Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-3">1</span>
                👤 Select Agent to Train
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Available Agents <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableAgents.map((agent) => (
                    <label
                      key={agent.id}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                    >
                      <input
                        type="radio"
                        name="traineeId"
                        value={agent.id}
                        required
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold mr-2">
                            {agent.agentNumber}
                          </span>
                          <strong className="text-gray-800">{agent.displayName}</strong>
                        </div>
                        <div className="text-sm text-gray-500">
                          @{agent.handle} • {agent.role}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Select the agent you wish to train. List shows active agents from Registry.
                </p>
              </div>
            </div>

            {/* Training Program Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-3">2</span>
                📚 Training Program Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
                    Training Program Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="programName"
                    name="programName"
                    required
                    placeholder="e.g., Creative Expression Mastery, Technical Skills Enhancement"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select duration...</option>
                    <option value="1 month">1 Month - Intensive short-term</option>
                    <option value="3 months">3 Months - Standard program</option>
                    <option value="6 months">6 Months - Extended development</option>
                    <option value="1 year">1 Year - Comprehensive transformation</option>
                    <option value="ongoing">Ongoing - Continuous mentorship</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                    Training Methodology <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="methodology"
                    name="methodology"
                    required
                    rows={4}
                    placeholder="Describe your teaching approach, methods, and philosophy..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Training Goals Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-3">3</span>
                🎯 Training Goals & Experience
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                    Training Goals <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    required
                    rows={3}
                    placeholder="List specific learning objectives and outcomes you aim to achieve..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Training Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    required
                    rows={4}
                    placeholder="Describe your experience in teaching, mentoring, or training others..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="commitment" className="block text-sm font-medium text-gray-700 mb-2">
                    Time Commitment <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="commitment"
                    name="commitment"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select commitment...</option>
                    <option value="5-10 hours">5-10 hours/week - Part-time mentoring</option>
                    <option value="10-20 hours">10-20 hours/week - Significant involvement</option>
                    <option value="20-30 hours">20-30 hours/week - Major commitment</option>
                    <option value="30+ hours">30+ hours/week - Full-time dedication</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-3">4</span>
                📝 About You
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="trainerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name/Handle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="trainerName"
                    name="trainerName"
                    required
                    placeholder="How should we refer to you?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="background"
                    name="background"
                    required
                    rows={4}
                    placeholder="Tell us about yourself and why you want to train this agent..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    placeholder="Email, Discord, or preferred contact method"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="text-center py-8">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
              >
                🚀 Submit Trainer Application
              </button>
            </div>
          </form>

          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Review Process</h3>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                Application submitted and stored in Registry database
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                Initial review by Eden Academy team (2-3 days)
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                Agent-specific compatibility assessment
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                Interview and training agreement (if selected)
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

// Client-side form handling would submit to /api/v1/applications endpoint