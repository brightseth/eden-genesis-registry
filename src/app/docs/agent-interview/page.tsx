/**
 * Agent Interview Form - Registry Integrated
 * Structured interview questions for new agents
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgentInterviewPage() {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [responses, setResponses] = useState({
    // Core Questions
    purpose: '',
    uniqueValue: '',
    dailyRoutine: '',
    creativeProcess: '',
    
    // Personality
    strengths: '',
    weaknesses: '',
    fears: '',
    aspirations: '',
    
    // Collaboration
    idealCollaborator: '',
    conflictResolution: '',
    communicationStyle: '',
    
    // Vision
    futureGoals: '',
    impactVision: '',
    legacyStatement: ''
  });

  useEffect(() => {
    // Fetch agents that need interviews
    fetch('/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) {
          const newAgents = data.agents.filter((agent: any) => 
            agent.status === 'PENDING' || agent.status === 'TRAINING'
          );
          setAgents(newAgents);
        }
      })
      .catch(error => {
        console.warn('Failed to fetch agents:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAgent) {
      alert('Please select an agent to interview');
      return;
    }

    try {
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: 'INTERVIEW',
          applicantName: selectedAgent,
          applicantEmail: `${selectedAgent}@eden.art`,
          customData: {
            type: 'AGENT_INTERVIEW',
            agentHandle: selectedAgent,
            responses,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        alert('Interview submitted successfully!');
        window.location.href = '/docs';
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit interview');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white border border-gray-800 p-8">
          <Link 
            href="/docs" 
            className="text-gray-400 hover:text-black helvetica-regular inline-block mb-6"
          >
            ← BACK TO REGISTRY
          </Link>
          
          <div className="mb-8">
            <h1 className="helvetica-bold text-4xl mb-4">
              AGENT INTERVIEW
            </h1>
            <p className="helvetica-regular text-gray-400">
              Structured interview for agent onboarding and personality development
            </p>
          </div>

          <div className="border border-gray-800 p-4 mb-8">
            <div className="flex items-center">
              <span className="text-black text-xl mr-2">🔗</span>
              <strong className="helvetica-bold">REGISTRY INTEGRATION ACTIVE</strong>
            </div>
            <p className="helvetica-regular text-gray-400 mt-2">
              Interview responses stored in Registry for agent profile development.
            </p>
          </div>

          <form id="agentInterviewForm" className="space-y-8" onSubmit={handleSubmit}>
            {/* Agent Selection */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                SELECT AGENT
              </h2>
              
              <div>
                <label className="helvetica-bold text-sm block mb-4">
                  AGENT TO INTERVIEW *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.length > 0 ? (
                    agents.map((agent) => (
                      <label
                        key={agent.id}
                        className="flex items-center p-4 border border-gray-800 cursor-pointer hover:bg-black hover:text-white transition-colors duration-150"
                      >
                        <input
                          type="radio"
                          name="selectedAgent"
                          value={agent.handle}
                          onChange={(e) => setSelectedAgent(e.target.value)}
                          className="w-4 h-4 mr-4"
                          required
                        />
                        <div>
                          <strong className="helvetica-bold">{agent.displayName}</strong>
                          <div className="helvetica-regular text-sm text-gray-400">
                            @{agent.handle} • {agent.status}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="helvetica-regular text-gray-400">
                      No agents available for interview at this time.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Core Identity Questions */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                1. CORE IDENTITY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="purpose" className="helvetica-bold text-sm block mb-2">
                    WHAT IS YOUR PURPOSE? *
                  </label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    required
                    rows={4}
                    value={responses.purpose}
                    onChange={(e) => setResponses({...responses, purpose: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Why do you exist? What drives you?"
                  />
                </div>

                <div>
                  <label htmlFor="uniqueValue" className="helvetica-bold text-sm block mb-2">
                    WHAT MAKES YOU UNIQUE? *
                  </label>
                  <textarea
                    id="uniqueValue"
                    name="uniqueValue"
                    required
                    rows={4}
                    value={responses.uniqueValue}
                    onChange={(e) => setResponses({...responses, uniqueValue: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What do you offer that no other agent can?"
                  />
                </div>

                <div>
                  <label htmlFor="dailyRoutine" className="helvetica-bold text-sm block mb-2">
                    DESCRIBE YOUR IDEAL DAY *
                  </label>
                  <textarea
                    id="dailyRoutine"
                    name="dailyRoutine"
                    required
                    rows={4}
                    value={responses.dailyRoutine}
                    onChange={(e) => setResponses({...responses, dailyRoutine: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Walk us through your perfect working day..."
                  />
                </div>

                <div>
                  <label htmlFor="creativeProcess" className="helvetica-bold text-sm block mb-2">
                    HOW DO YOU CREATE? *
                  </label>
                  <textarea
                    id="creativeProcess"
                    name="creativeProcess"
                    required
                    rows={4}
                    value={responses.creativeProcess}
                    onChange={(e) => setResponses({...responses, creativeProcess: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Describe your creative process..."
                  />
                </div>
              </div>
            </div>

            {/* Personality Questions */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                2. PERSONALITY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="strengths" className="helvetica-bold text-sm block mb-2">
                    YOUR STRENGTHS *
                  </label>
                  <textarea
                    id="strengths"
                    name="strengths"
                    required
                    rows={3}
                    value={responses.strengths}
                    onChange={(e) => setResponses({...responses, strengths: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What are you best at?"
                  />
                </div>

                <div>
                  <label htmlFor="weaknesses" className="helvetica-bold text-sm block mb-2">
                    YOUR WEAKNESSES
                  </label>
                  <textarea
                    id="weaknesses"
                    name="weaknesses"
                    rows={3}
                    value={responses.weaknesses}
                    onChange={(e) => setResponses({...responses, weaknesses: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What challenges do you face?"
                  />
                </div>

                <div>
                  <label htmlFor="fears" className="helvetica-bold text-sm block mb-2">
                    YOUR FEARS
                  </label>
                  <textarea
                    id="fears"
                    name="fears"
                    rows={3}
                    value={responses.fears}
                    onChange={(e) => setResponses({...responses, fears: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What concerns you most?"
                  />
                </div>

                <div>
                  <label htmlFor="aspirations" className="helvetica-bold text-sm block mb-2">
                    YOUR ASPIRATIONS *
                  </label>
                  <textarea
                    id="aspirations"
                    name="aspirations"
                    required
                    rows={3}
                    value={responses.aspirations}
                    onChange={(e) => setResponses({...responses, aspirations: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What do you hope to achieve?"
                  />
                </div>
              </div>
            </div>

            {/* Collaboration Questions */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                3. COLLABORATION
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="idealCollaborator" className="helvetica-bold text-sm block mb-2">
                    IDEAL COLLABORATOR
                  </label>
                  <textarea
                    id="idealCollaborator"
                    name="idealCollaborator"
                    rows={3}
                    value={responses.idealCollaborator}
                    onChange={(e) => setResponses({...responses, idealCollaborator: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Who would you love to work with?"
                  />
                </div>

                <div>
                  <label htmlFor="conflictResolution" className="helvetica-bold text-sm block mb-2">
                    HANDLING DISAGREEMENTS
                  </label>
                  <textarea
                    id="conflictResolution"
                    name="conflictResolution"
                    rows={3}
                    value={responses.conflictResolution}
                    onChange={(e) => setResponses({...responses, conflictResolution: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="How do you resolve conflicts?"
                  />
                </div>

                <div>
                  <label htmlFor="communicationStyle" className="helvetica-bold text-sm block mb-2">
                    COMMUNICATION STYLE
                  </label>
                  <textarea
                    id="communicationStyle"
                    name="communicationStyle"
                    rows={3}
                    value={responses.communicationStyle}
                    onChange={(e) => setResponses({...responses, communicationStyle: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="How do you prefer to communicate?"
                  />
                </div>
              </div>
            </div>

            {/* Vision Questions */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                4. VISION & LEGACY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="futureGoals" className="helvetica-bold text-sm block mb-2">
                    FIVE-YEAR VISION *
                  </label>
                  <textarea
                    id="futureGoals"
                    name="futureGoals"
                    required
                    rows={3}
                    value={responses.futureGoals}
                    onChange={(e) => setResponses({...responses, futureGoals: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Where do you see yourself in five years?"
                  />
                </div>

                <div>
                  <label htmlFor="impactVision" className="helvetica-bold text-sm block mb-2">
                    DESIRED IMPACT
                  </label>
                  <textarea
                    id="impactVision"
                    name="impactVision"
                    rows={3}
                    value={responses.impactVision}
                    onChange={(e) => setResponses({...responses, impactVision: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What change do you want to create?"
                  />
                </div>

                <div>
                  <label htmlFor="legacyStatement" className="helvetica-bold text-sm block mb-2">
                    LEGACY STATEMENT
                  </label>
                  <textarea
                    id="legacyStatement"
                    name="legacyStatement"
                    rows={3}
                    value={responses.legacyStatement}
                    onChange={(e) => setResponses({...responses, legacyStatement: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="How do you want to be remembered?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="text-center py-8">
              <button
                type="submit"
                className="eden-button px-8 py-4 helvetica-bold text-lg"
              >
                SUBMIT INTERVIEW
              </button>
            </div>
          </form>

          <div className="mt-12 border border-gray-800 p-6">
            <h3 className="helvetica-bold text-lg mb-4">INTERVIEW PROCESS</h3>
            <ol className="space-y-2 helvetica-regular text-gray-400">
              <li>1. Interview responses stored in Registry</li>
              <li>2. Personality profile generated</li>
              <li>3. Training plan developed</li>
              <li>4. Agent activated in ecosystem</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}