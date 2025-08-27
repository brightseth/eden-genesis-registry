/**
 * Webhook Configuration - Registry Integration
 * Set up real-time webhook notifications
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WebhookConfigPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [formState, setFormState] = useState({
    url: '',
    events: [] as string[],
    secret: '',
    description: ''
  });

  const availableEvents = [
    { category: 'AGENT', events: ['agent.created', 'agent.updated', 'agent.activated', 'agent.deactivated'] },
    { category: 'CONTENT', events: ['creation.published', 'persona.created', 'artifact.added', 'progress.updated'] },
    { category: 'APPLICATION', events: ['application.submitted', 'application.reviewed', 'application.approved', 'application.rejected'] },
    { category: 'CURATION', events: ['curation.session.started', 'curation.decision.made', 'collection.created', 'collection.updated'] }
  ];

  useEffect(() => {
    // Fetch existing webhooks
    fetch('/api/v1/webhooks')
      .then(res => res.json())
      .then(data => {
        if (data.webhooks) {
          setWebhooks(data.webhooks);
        }
      })
      .catch(error => {
        console.warn('Failed to fetch webhooks:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.events.length === 0) {
      alert('Please select at least one event');
      return;
    }

    try {
      const response = await fetch('/api/v1/webhooks/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (response.ok) {
        alert('Webhook registered successfully!');
        // Refresh webhook list
        const data = await response.json();
        setWebhooks([...webhooks, data]);
        // Reset form
        setFormState({ url: '', events: [], secret: '', description: '' });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register webhook');
    }
  };

  const handleEventToggle = (event: string) => {
    if (formState.events.includes(event)) {
      setFormState({
        ...formState,
        events: formState.events.filter(e => e !== event)
      });
    } else {
      setFormState({
        ...formState,
        events: [...formState.events, event]
      });
    }
  };

  const handleDelete = async (webhookId: string) => {
    if (!confirm('Delete this webhook subscription?')) return;

    try {
      const response = await fetch(`/api/v1/webhooks/${webhookId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWebhooks(webhooks.filter(w => w.id !== webhookId));
        alert('Webhook deleted successfully');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      alert('Failed to delete webhook');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white border border-gray-800 p-8">
          <Link 
            href="/docs" 
            className="text-gray-400 hover:text-black helvetica-regular inline-block mb-6"
          >
            ← BACK TO REGISTRY
          </Link>
          
          <div className="mb-8">
            <h1 className="helvetica-bold text-4xl mb-4">
              WEBHOOK CONFIGURATION
            </h1>
            <p className="helvetica-regular text-gray-400">
              Set up real-time notifications for Registry events
            </p>
          </div>

          {/* Register New Webhook */}
          <div className="border border-gray-800 p-6 mb-8">
            <h2 className="helvetica-bold text-2xl mb-6">REGISTER WEBHOOK</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="helvetica-bold text-sm block mb-2">
                  WEBHOOK URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  value={formState.url}
                  onChange={(e) => setFormState({...formState, url: e.target.value})}
                  className="eden-input w-full px-4 py-3"
                  placeholder="https://your-service.com/webhooks"
                />
              </div>

              <div>
                <label htmlFor="secret" className="helvetica-bold text-sm block mb-2">
                  WEBHOOK SECRET
                </label>
                <input
                  type="text"
                  id="secret"
                  name="secret"
                  value={formState.secret}
                  onChange={(e) => setFormState({...formState, secret: e.target.value})}
                  className="eden-input w-full px-4 py-3"
                  placeholder="Optional secret for signature verification"
                />
              </div>

              <div>
                <label htmlFor="description" className="helvetica-bold text-sm block mb-2">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  className="eden-input w-full px-4 py-3"
                  placeholder="What is this webhook for?"
                />
              </div>

              <div>
                <label className="helvetica-bold text-sm block mb-4">
                  SELECT EVENTS *
                </label>
                {availableEvents.map((category) => (
                  <div key={category.category} className="mb-6">
                    <h4 className="helvetica-bold text-sm mb-3">{category.category} EVENTS</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {category.events.map((event) => (
                        <label
                          key={event}
                          className="flex items-center p-3 border border-gray-800 cursor-pointer hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          <input
                            type="checkbox"
                            checked={formState.events.includes(event)}
                            onChange={() => handleEventToggle(event)}
                            className="w-4 h-4 mr-3"
                          />
                          <span className="helvetica-regular text-sm">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="eden-button px-8 py-4 helvetica-bold"
              >
                REGISTER WEBHOOK
              </button>
            </form>
          </div>

          {/* Existing Webhooks */}
          <div className="border border-gray-800 p-6">
            <h2 className="helvetica-bold text-2xl mb-6">ACTIVE WEBHOOKS</h2>
            
            {webhooks.length > 0 ? (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border border-gray-800 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <code className="helvetica-regular text-sm">{webhook.url}</code>
                        {webhook.description && (
                          <p className="helvetica-regular text-gray-400 text-sm mt-1">
                            {webhook.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className="helvetica-bold text-xs">EVENTS: </span>
                          <span className="helvetica-regular text-xs text-gray-400">
                            {webhook.events?.join(', ') || 'All events'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(webhook.id)}
                        className="eden-button px-4 py-2 text-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="helvetica-regular text-gray-400">
                No webhooks registered. Add one above to receive real-time notifications.
              </p>
            )}
          </div>

          {/* Webhook Testing */}
          <div className="mt-8 border border-gray-800 p-6">
            <h3 className="helvetica-bold text-xl mb-4">WEBHOOK TESTING</h3>
            <p className="helvetica-regular mb-4">
              Test your webhook endpoint with a sample payload:
            </p>
            <pre className="bg-black text-white p-4 helvetica-regular text-sm">
{`{
  "event": "agent.created",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "id": "agent_123",
    "handle": "example",
    "displayName": "Example Agent",
    "agentNumber": 11,
    "status": "ACTIVE"
  },
  "signature": "hmac_sha256_signature"
}`}
            </pre>
          </div>

          {/* Documentation Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/docs/api" 
              className="helvetica-regular text-gray-400 hover:text-black"
            >
              VIEW FULL API DOCUMENTATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}