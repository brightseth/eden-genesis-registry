# Registry-as-Protocol Migration Guide

Complete guide for migrating services to use Eden Genesis Registry as the single source of truth.

## Overview

The Eden Genesis Registry now serves as the **Registry-as-Protocol** - the canonical source for all agent data, applications, and ecosystem state. This guide helps you migrate existing services to consume Registry APIs instead of maintaining separate data stores.

## Migration Benefits

✅ **Single Source of Truth** - No more schema drift or data inconsistencies  
✅ **Real-time Updates** - Webhook notifications for all changes  
✅ **Canonical Data** - Sequential agent numbering and standardized schemas  
✅ **Reduced Maintenance** - No duplicate data management  
✅ **Future-proof** - Built for ecosystem growth  

## Architecture Overview

### Before Migration
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Service A  │  │   Service B  │  │   Service C  │
│              │  │              │  │              │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │Local Data│ │  │ │Local Data│ │  │ │Local Data│ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
└──────────────┘  └──────────────┘  └──────────────┘
```

### After Migration (Registry-as-Protocol)
```
         ┌─────────────────────────────┐
         │   EDEN GENESIS REGISTRY     │
         │    (Single Source)          │
         │                             │
         │  🏛️ Agents                   │
         │  📝 Applications             │
         │  🎨 Creations               │
         │  🔔 Webhooks                │
         └─────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
    ┌──────▼──┐  ┌──────▼──┐  ┌──────▼──┐
    │Service A│  │Service B│  │Service C│
    │(Client) │  │(Client) │  │(Client) │
    └─────────┘  └─────────┘  └─────────┘
```

## Step 1: Assess Current Implementation

### Data Inventory Checklist

- [ ] **Agent Data**: Where do you store agent profiles, roles, status?
- [ ] **Applications**: Do you handle applications/forms locally?
- [ ] **Schema Consistency**: What enums/types differ from Registry?
- [ ] **Real-time Needs**: Do you need live updates when data changes?

### Common Migration Patterns

**Pattern 1: Replace Local Agent Store**
```javascript
// Before: Local agent data
const agents = [
  { name: 'Abraham', role: 'creator' }, // ❌ Inconsistent schema
  { name: 'Solienne', role: 'curator' }
];

// After: Registry API
const agents = await fetch('https://eden-genesis-registry.vercel.app/api/v1/agents')
  .then(res => res.json())
  .then(data => data.agents); // ✅ Canonical data
```

**Pattern 2: Replace Application Forms**
```javascript
// Before: Local form submission
app.post('/apply', (req, res) => {
  // Local processing ❌
  await database.save(req.body);
});

// After: Registry integration
app.post('/apply', (req, res) => {
  // Forward to Registry ✅
  await fetch('https://eden-genesis-registry.vercel.app/api/v1/applications', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
});
```

## Step 2: Registry API Integration

### Base Configuration

```javascript
const REGISTRY_CONFIG = {
  baseUrl: 'https://eden-genesis-registry.vercel.app/api/v1',
  timeout: 10000,
  retries: 3
};

class RegistryClient {
  constructor(config = REGISTRY_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
  }
  
  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      timeout: this.timeout,
      ...options
    });
    
    if (!response.ok) {
      throw new Error(\`Registry API error: \${response.status}\`);
    }
    
    return response.json();
  }
  
  // Agent operations
  async getAgents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(\`/agents?\${params}\`);
  }
  
  async getAgent(id) {
    return this.request(\`/agents/\${id}\`);
  }
  
  async createAgent(data) {
    return this.request('/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  // Application operations
  async submitApplication(data) {
    return this.request('/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async getApplications(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(\`/applications?\${params}\`);
  }
}

// Usage
const registry = new RegistryClient();
```

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/agents` | GET | List all agents |
| `/agents` | POST | Create agent (admin) |
| `/agents/:id` | GET | Get agent details |
| `/agents/:id/profile` | GET | Get agent profile |
| `/agents/:id/creations` | GET | List agent creations |
| `/applications` | POST | Submit application |
| `/applications/:id` | GET | Get application |
| `/webhooks/register` | POST | Register webhook |

### Schema Alignment

**Agent Schema (Canonical)**
```typescript
interface Agent {
  id: string;
  handle: string;              // Unique identifier
  displayName: string;         // Public name
  agentNumber: number;         // Sequential number (1-N)
  role: 'CURATOR' | 'COLLECTOR' | 'INVESTOR' | 'TRAINER' | 'ADMIN' | 'GUEST';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'TRAINING';
  cohortSlug: string;          // 'genesis', etc.
  createdAt: string;
  updatedAt: string;
}
```

**Application Schema**
```typescript
interface Application {
  id: string;
  track: 'AGENT' | 'TRAINER' | 'CURATOR' | 'TEST';
  applicantName: string;
  applicantEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  customData: Record<string, any>;
  submittedAt: string;
}
```

## Step 3: Webhook Integration

### Webhook Registration

```javascript
// Register for real-time updates
await registry.request('/webhooks/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://your-service.com/webhooks/registry',
    events: ['agent.created', 'agent.updated', 'application.submitted'],
    secret: 'your-webhook-secret'
  })
});
```

### Webhook Handler Implementation

```javascript
const crypto = require('crypto');

app.post('/webhooks/registry', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-registry-signature'];
  const payload = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', 'your-webhook-secret')
    .update(payload)
    .digest('hex');
  
  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle webhook events
  const { event, data } = req.body;
  
  switch (event) {
    case 'agent.created':
      handleNewAgent(data);
      break;
    case 'agent.updated':
      handleAgentUpdate(data);
      break;
    case 'application.submitted':
      handleNewApplication(data);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).send('OK');
});

function handleNewAgent(agent) {
  // Update your UI, cache, etc.
  console.log('New agent created:', agent.displayName);
  // Broadcast to connected clients, update displays, etc.
}
```

### Available Webhook Events

| Event | Trigger |
|-------|---------|
| `agent.created` | New agent registered |
| `agent.updated` | Agent data modified |
| `agent.activated` | Agent status → ACTIVE |
| `creation.published` | New agent creation |
| `application.submitted` | New application received |
| `application.reviewed` | Application status changed |

## Step 4: Data Migration

### Migration Script Template

```javascript
const fs = require('fs');

async function migrateToRegistry() {
  console.log('🚀 Starting Registry migration...');
  
  // 1. Backup existing data
  const existingData = await getCurrentData();
  fs.writeFileSync('./backup.json', JSON.stringify(existingData, null, 2));
  console.log('✅ Data backed up');
  
  // 2. Transform data to Registry schema
  const transformedData = existingData.agents.map(agent => ({
    handle: agent.name.toLowerCase().replace(/\s+/g, ''),
    displayName: agent.name,
    role: mapRole(agent.role), // Convert CREATOR → CURATOR, etc.
    status: agent.active ? 'ACTIVE' : 'INACTIVE',
    cohortSlug: 'genesis'
  }));
  
  // 3. Validate transformed data
  const validData = transformedData.filter(agent => {
    return agent.handle && agent.displayName && agent.role;
  });
  console.log(\`✅ Validated \${validData.length}/\${transformedData.length} records\`);
  
  // 4. Migrate to Registry (requires admin access)
  for (const agent of validData) {
    try {
      await registry.createAgent(agent);
      console.log(\`✅ Migrated: \${agent.displayName}\`);
    } catch (error) {
      console.error(\`❌ Failed: \${agent.displayName}\`, error.message);
    }
  }
  
  console.log('🎉 Migration completed!');
}

function mapRole(oldRole) {
  const roleMap = {
    'creator': 'CURATOR',
    'curator': 'CURATOR',
    'collector': 'COLLECTOR',
    'investor': 'INVESTOR',
    'admin': 'ADMIN'
  };
  return roleMap[oldRole] || 'CURATOR';
}
```

## Step 5: Update UI Components

### React/Next.js Example

```jsx
// Before: Local state management
function AgentList() {
  const [agents, setAgents] = useState(localAgents);
  
  return (
    <div>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

// After: Registry integration
function AgentList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch from Registry
    fetch('https://eden-genesis-registry.vercel.app/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents);
        setLoading(false);
      });
    
    // Set up real-time updates via WebSocket or polling
    const eventSource = new EventSource('/api/registry-updates');
    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.event === 'agent.updated') {
        setAgents(prev => prev.map(agent => 
          agent.id === update.data.id ? update.data : agent
        ));
      }
    };
    
    return () => eventSource.close();
  }, []);
  
  if (loading) return <div>Loading agents from Registry...</div>;
  
  return (
    <div>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
```

## Step 6: Testing & Validation

### Migration Testing Checklist

- [ ] **Data Integrity**: All agents migrated with correct schema
- [ ] **API Connectivity**: All endpoints responding correctly  
- [ ] **Real-time Updates**: Webhooks delivering events
- [ ] **Form Submissions**: Applications routing to Registry
- [ ] **Error Handling**: Graceful fallbacks for API failures
- [ ] **Performance**: Acceptable response times
- [ ] **Cache Strategy**: Appropriate caching for frequently accessed data

### Testing Script

```javascript
async function validateMigration() {
  console.log('🧪 Validating Registry migration...');
  
  // Test API connectivity
  const agents = await registry.getAgents();
  console.log(\`✅ Retrieved \${agents.agents.length} agents\`);
  
  // Test webhook delivery
  await testWebhookDelivery();
  
  // Test form submissions
  await testFormSubmission();
  
  // Test data consistency
  await validateDataIntegrity();
  
  console.log('🎉 Migration validation complete!');
}
```

## Common Migration Issues

### Issue 1: Schema Mismatches
```javascript
// Problem: Different role enums
const oldRole = 'creator'; // ❌
const newRole = 'CURATOR';  // ✅

// Solution: Role mapping function
function normalizeRole(role) {
  return role.toUpperCase().replace('CREATOR', 'CURATOR');
}
```

### Issue 2: Missing Agent Numbers
```javascript
// Problem: No sequential numbering
const agent = { name: 'Test', role: 'CURATOR' }; // ❌

// Solution: Let Registry assign numbers
const response = await registry.createAgent(agent);
console.log('Assigned agent number:', response.agentNumber); // ✅
```

### Issue 3: Webhook Authentication
```javascript
// Problem: Webhooks require proper signature verification
app.post('/webhook', (req, res) => {
  // No verification ❌
  processWebhook(req.body);
});

// Solution: Verify signatures
app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }
  processWebhook(req.body); // ✅
});
```

## Eden Academy Specific Migration

### Priority Changes for Eden Academy

1. **Replace agent mocks** with Registry API calls
2. **Update trainer assignment** to use Registry relationships  
3. **Migrate application forms** to Registry endpoints
4. **Implement webhook handlers** for real-time updates
5. **Update UI components** to consume Registry data

### Eden Academy Migration Script

```bash
# 1. Update dependencies
npm install @registry/client

# 2. Environment variables
echo "REGISTRY_API_URL=https://eden-genesis-registry.vercel.app/api/v1" >> .env
echo "REGISTRY_WEBHOOK_SECRET=your_secret" >> .env

# 3. Run migration
npm run migrate:registry

# 4. Test integration
npm run test:registry
```

## Support & Resources

### Documentation
- **API Reference**: https://eden-genesis-registry.vercel.app/docs/api
- **Webhook Guide**: https://eden-genesis-registry.vercel.app/docs/webhooks
- **Schema Documentation**: https://eden-genesis-registry.vercel.app/schema

### Getting Help
- **Registry Issues**: Check `/admin/applications` for status
- **API Errors**: Enable debug logging to capture request/response details
- **Webhook Problems**: Verify signature calculation and endpoint accessibility

---

## Next Steps

1. **Assess your service** using the checklist above
2. **Plan migration timeline** - start with read-only API integration  
3. **Implement Registry client** with proper error handling
4. **Set up webhooks** for real-time updates
5. **Test thoroughly** before removing legacy systems
6. **Monitor performance** post-migration

The Registry-as-Protocol approach ensures consistent, scalable data management across the entire Eden ecosystem. This migration unlocks real-time updates, eliminates data drift, and provides a foundation for future ecosystem growth.

**Registry-as-Protocol: One source of truth, infinite possibilities.**