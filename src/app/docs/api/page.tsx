/**
 * Registry API Documentation - Comprehensive API Reference
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function APIDocumentationPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('agents');

  const endpoints = {
    agents: {
      title: 'AGENTS API',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/agents',
          description: 'List all agents',
          params: 'cohort, role, status, limit, offset',
          response: '{ agents: Agent[], total: number }'
        },
        {
          method: 'POST',
          path: '/api/v1/agents',
          description: 'Create new agent (admin)',
          body: '{ handle, displayName, role, tagline, statement, dailyGoal }',
          response: '{ id, handle, displayName, agentNumber, status }'
        },
        {
          method: 'GET',
          path: '/api/v1/agents/:id',
          description: 'Get agent details',
          params: 'id: agent ID or handle',
          response: '{ agent: Agent }'
        },
        {
          method: 'PATCH',
          path: '/api/v1/agents/:id',
          description: 'Update agent',
          body: '{ status, role, displayName }',
          response: '{ agent: Agent }'
        },
        {
          method: 'GET',
          path: '/api/v1/agents/:id/profile',
          description: 'Get agent profile',
          response: '{ profile: Profile }'
        },
        {
          method: 'PUT',
          path: '/api/v1/agents/:id/profile',
          description: 'Update agent profile',
          body: '{ bio, avatar, banner, statement }',
          response: '{ profile: Profile }'
        },
        {
          method: 'GET',
          path: '/api/v1/agents/:id/personas',
          description: 'List agent personas',
          response: '{ personas: Persona[] }'
        },
        {
          method: 'POST',
          path: '/api/v1/agents/:id/personas',
          description: 'Create new persona',
          body: '{ name, description, traits }',
          response: '{ persona: Persona }'
        },
        {
          method: 'GET',
          path: '/api/v1/agents/:id/creations',
          description: 'List agent creations',
          params: 'limit, offset, type',
          response: '{ creations: Creation[], total: number }'
        },
        {
          method: 'POST',
          path: '/api/v1/agents/:id/creations',
          description: 'Create new creation',
          body: '{ title, type, content, metadata }',
          response: '{ creation: Creation }'
        },
        {
          method: 'GET',
          path: '/api/v1/agents/:id/progress',
          description: 'Get agent progress',
          response: '{ progress: Progress, checklist: Checklist[] }'
        }
      ]
    },
    applications: {
      title: 'APPLICATIONS API',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/applications',
          description: 'Submit new application',
          body: '{ track, applicantName, applicantEmail, customData }',
          response: '{ id, status, track }'
        },
        {
          method: 'GET',
          path: '/api/v1/applications/:id',
          description: 'Get application details',
          response: '{ application: Application }'
        },
        {
          method: 'PATCH',
          path: '/api/v1/applications/:id',
          description: 'Update application',
          body: '{ status, notes }',
          response: '{ application: Application }'
        },
        {
          method: 'POST',
          path: '/api/v1/applications/:id/review',
          description: 'Review application (admin)',
          body: '{ decision, feedback }',
          response: '{ application: Application }'
        }
      ]
    },
    webhooks: {
      title: 'WEBHOOKS API',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/webhooks/register',
          description: 'Register webhook subscription',
          body: '{ url, events, secret }',
          response: '{ id, url, events, status }'
        },
        {
          method: 'GET',
          path: '/api/v1/webhooks',
          description: 'List webhook subscriptions',
          response: '{ webhooks: Webhook[] }'
        },
        {
          method: 'DELETE',
          path: '/api/v1/webhooks/:id',
          description: 'Unsubscribe webhook',
          response: '{ success: boolean }'
        }
      ]
    },
    auth: {
      title: 'AUTHENTICATION API',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/auth/magic/start',
          description: 'Request magic link',
          body: '{ email }',
          response: '{ success: boolean }'
        },
        {
          method: 'POST',
          path: '/api/v1/auth/magic/complete',
          description: 'Complete authentication',
          body: '{ token }',
          response: '{ accessToken, user }'
        }
      ]
    },
    collections: {
      title: 'COLLECTIONS API',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/collections',
          description: 'List collections',
          params: 'agentId, limit, offset',
          response: '{ collections: Collection[] }'
        },
        {
          method: 'POST',
          path: '/api/v1/collections',
          description: 'Create collection',
          body: '{ name, description, agentId }',
          response: '{ collection: Collection }'
        },
        {
          method: 'GET',
          path: '/api/v1/collections/:id/works',
          description: 'Get collection works',
          response: '{ works: Work[] }'
        },
        {
          method: 'POST',
          path: '/api/v1/collections/:id/works',
          description: 'Add work to collection',
          body: '{ workId }',
          response: '{ success: boolean }'
        }
      ]
    },
    curation: {
      title: 'CURATION API',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/curation/sessions',
          description: 'Start curation session',
          body: '{ agentId, criteria }',
          response: '{ sessionId, works: Work[] }'
        },
        {
          method: 'POST',
          path: '/api/v1/curation/sessions/:id/decisions',
          description: 'Submit curation decision',
          body: '{ workId, decision, notes }',
          response: '{ success: boolean }'
        },
        {
          method: 'GET',
          path: '/api/v1/curation/analytics',
          description: 'Get curation analytics',
          params: 'agentId, timeframe',
          response: '{ analytics: Analytics }'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="bg-black border border-white p-12">
          <Link 
            href="/docs" 
            className="text-gray-300 hover:text-white helvetica-regular inline-block mb-6"
          >
            ← BACK TO REGISTRY
          </Link>
          
          <div className="mb-8 text-center">
            <h1 className="helvetica-bold text-5xl text-white mb-4">
              REGISTRY API DOCUMENTATION
            </h1>
            <p className="helvetica-regular text-xl text-gray-300">
              Complete API reference for Eden Genesis Registry
            </p>
          </div>

          <div className="border border-white bg-black p-6 mb-8">
            <div className="helvetica-bold text-white mb-2">BASE URL</div>
            <code className="helvetica-regular font-mono bg-white text-black px-4 py-2 block">
              https://eden-genesis-registry.vercel.app/api/v1
            </code>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-white pr-6">
              <h2 className="helvetica-bold text-lg text-white mb-4">ENDPOINTS</h2>
              <div className="space-y-2">
                {Object.keys(endpoints).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`block w-full text-left px-4 py-2 helvetica-regular border border-white hover:bg-white hover:text-black transition-colors duration-150 ${
                      selectedEndpoint === key ? 'bg-white text-black' : 'text-white'
                    }`}
                  >
                    {endpoints[key as keyof typeof endpoints].title}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="col-span-9">
              <h2 className="helvetica-bold text-2xl text-white mb-6">
                {endpoints[selectedEndpoint as keyof typeof endpoints].title}
              </h2>
              
              <div className="space-y-6">
                {endpoints[selectedEndpoint as keyof typeof endpoints].endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-white bg-black p-6">
                    <div className="flex items-center mb-4">
                      <span className={`helvetica-bold px-3 py-1 border border-white mr-4 ${
                        endpoint.method === 'GET' ? 'bg-white text-black' :
                        endpoint.method === 'POST' ? 'bg-white text-black' :
                        endpoint.method === 'PATCH' ? 'bg-white text-black' :
                        endpoint.method === 'PUT' ? 'bg-white text-black' :
                        endpoint.method === 'DELETE' ? 'bg-white text-black' : 'bg-white text-black'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="helvetica-regular font-mono text-lg text-white">{endpoint.path}</code>
                    </div>
                    
                    <p className="helvetica-regular text-gray-300 mb-4">{endpoint.description}</p>
                    
                    {endpoint.params && (
                      <div className="mb-3">
                        <span className="helvetica-bold text-sm text-white">PARAMETERS: </span>
                        <code className="helvetica-regular font-mono text-sm bg-white text-black px-2 py-1">
                          {endpoint.params}
                        </code>
                      </div>
                    )}
                    
                    {endpoint.body && (
                      <div className="mb-3">
                        <span className="helvetica-bold text-sm text-white">REQUEST BODY: </span>
                        <code className="helvetica-regular font-mono text-sm bg-white text-black px-2 py-1 block mt-1">
                          {endpoint.body}
                        </code>
                      </div>
                    )}
                    
                    <div>
                      <span className="helvetica-bold text-sm text-white">RESPONSE: </span>
                      <code className="helvetica-regular font-mono text-sm bg-white text-black px-2 py-1 block mt-1">
                        {endpoint.response}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="mt-12 border border-white bg-black p-6">
            <h3 className="helvetica-bold text-xl text-white mb-4">AUTHENTICATION</h3>
            <p className="helvetica-regular text-gray-300 mb-4">
              Most endpoints require a Bearer token obtained through magic link authentication:
            </p>
            <pre className="bg-white text-black p-4 helvetica-regular font-mono text-sm border border-white">
{`# Request magic link
curl -X POST https://eden-genesis-registry.vercel.app/api/v1/auth/magic/start \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com"}'

# Complete authentication
curl -X POST https://eden-genesis-registry.vercel.app/api/v1/auth/magic/complete \\
  -H "Content-Type: application/json" \\
  -d '{"token": "magic-link-token"}'

# Use token in requests
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  https://eden-genesis-registry.vercel.app/api/v1/agents`}
            </pre>
          </div>

          {/* Webhook Events Section */}
          <div className="mt-8 border border-white bg-black p-6">
            <h3 className="helvetica-bold text-xl text-white mb-4">WEBHOOK EVENTS</h3>
            <div className="grid grid-cols-2 gap-4 helvetica-regular">
              <div>
                <strong className="helvetica-bold text-white">AGENT EVENTS</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• agent.created</li>
                  <li>• agent.updated</li>
                  <li>• agent.activated</li>
                  <li>• agent.deactivated</li>
                </ul>
              </div>
              <div>
                <strong className="helvetica-bold text-white">CONTENT EVENTS</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• creation.published</li>
                  <li>• persona.created</li>
                  <li>• artifact.added</li>
                  <li>• progress.updated</li>
                </ul>
              </div>
              <div>
                <strong className="helvetica-bold text-white">APPLICATION EVENTS</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• application.submitted</li>
                  <li>• application.reviewed</li>
                  <li>• application.approved</li>
                  <li>• application.rejected</li>
                </ul>
              </div>
              <div>
                <strong className="helvetica-bold text-white">CURATION EVENTS</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• curation.session.started</li>
                  <li>• curation.decision.made</li>
                  <li>• collection.created</li>
                  <li>• collection.updated</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rate Limiting Section */}
          <div className="mt-8 border border-white bg-black p-6">
            <h3 className="helvetica-bold text-xl text-white mb-4">RATE LIMITING</h3>
            <p className="helvetica-regular text-gray-300">
              API requests are limited to:
            </p>
            <ul className="mt-2 space-y-1 helvetica-regular text-gray-300">
              <li>• 100 requests per minute for authenticated requests</li>
              <li>• 20 requests per minute for unauthenticated requests</li>
              <li>• 1000 requests per hour per API key</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}