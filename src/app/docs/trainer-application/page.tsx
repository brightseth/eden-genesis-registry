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
              APPLY TO TRAIN AN AGENT
            </h1>
            <p className="helvetica-regular text-gray-400 text-lg">
              REGISTRY-INTEGRATED TRAINER APPLICATION SYSTEM
            </p>
          </div>

          <div className="border border-gray-800 bg-white p-4 mb-8">
            <div className="flex items-center">
              <strong className="helvetica-bold text-black">REGISTRY INTEGRATION ACTIVE</strong>
            </div>
            <p className="helvetica-regular text-black mt-2">
              THIS APPLICATION CONNECTS TO REGISTRY DATA. AGENT LIST IS LIVE FROM REGISTRY DATABASE.
              TRAINING RELATIONSHIPS TRACKED IN REGISTRY SYSTEM.
            </p>
          </div>

          <form id="trainerApplicationForm" className="space-y-8">
            {/* Agent Selection Section */}
            <div className="border border-gray-800 bg-white p-6">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                <span className="helvetica-bold mr-4">1.</span>
                SELECT AGENT TO TRAIN
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
            <div className="border border-gray-800 bg-white p-6 mt-4">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                <span className="helvetica-bold mr-4">2.</span>
                TRAINING PROGRAM DETAILS
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
            <div className="border border-gray-800 bg-white p-6 mt-4">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                <span className="helvetica-bold mr-4">3.</span>
                TRAINING GOALS & EXPERIENCE
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
            <div className="border border-gray-800 bg-white p-6 mt-4">
              <h2 className="helvetica-bold text-2xl text-black mb-6">
                <span className="helvetica-bold mr-4">4.</span>
                ABOUT YOU
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
                className="eden-button px-8 py-4 text-lg"
              >
                SUBMIT TRAINER APPLICATION
              </button>
            </div>
          </form>

          <div className="mt-12 border border-gray-800 bg-white p-6">
            <h3 className="helvetica-bold text-lg text-black mb-4">APPLICATION REVIEW PROCESS</h3>
            <ol className="space-y-2 text-black">
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">1.</span>
                <span className="helvetica-regular">APPLICATION SUBMITTED AND STORED IN REGISTRY DATABASE</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">2.</span>
                <span className="helvetica-regular">INITIAL REVIEW BY EDEN ACADEMY TEAM (2-3 DAYS)</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">3.</span>
                <span className="helvetica-regular">AGENT-SPECIFIC COMPATIBILITY ASSESSMENT</span>
              </li>
              <li className="flex items-start">
                <span className="helvetica-bold mr-4">4.</span>
                <span className="helvetica-regular">INTERVIEW AND TRAINING AGREEMENT (IF SELECTED)</span>
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