# ADR-001: Registry-as-Protocol Architecture

## Status: ACCEPTED
**Date**: 2025-08-28  
**Decision Made By**: Architecture Team  

## Context

The Eden Academy ecosystem consists of multiple services and frontends that need to maintain consistent agent data, application forms, and state management. Previously, each service maintained its own data stores leading to:

- **Data Drift**: Inconsistent schemas and enums across services
- **Sync Issues**: Manual data synchronization between systems
- **Maintenance Overhead**: Duplicate data management code
- **Numbering Conflicts**: Agent numbering inconsistencies with onchain registry

## Decision

**Eden Genesis Registry will serve as the definitive Registry-as-Protocol for the entire ecosystem.**

### Architecture Principles

1. **Single Source of Truth**: Registry is the canonical data store for:
   - Agent profiles and metadata
   - Application submissions and reviews
   - Creation/work cataloging  
   - User roles and permissions

2. **API-First Design**: All services interact with Registry via standardized APIs:
   - `GET /api/v1/agents` - List/filter agents
   - `POST /api/v1/applications` - Submit applications
   - `GET /api/v1/agents/{id}/creations` - Fetch agent works
   - WebSocket/Webhook real-time updates

3. **Academy as Frontend**: Eden Academy becomes primarily a frontend client:
   - Renders data from Registry APIs
   - Forwards form submissions to Registry
   - Minimal local state, maximum Registry integration

4. **Onchain Compatibility**: Agent numbering starts from 0:
   - Abraham = #0, Solienne = #1, etc.
   - Sequential numbering matches Henry's onchain registry system

## Implementation

### Data Flow Architecture
```
┌─────────────────────────────┐
│   EDEN GENESIS REGISTRY     │
│    (Single Source)          │ ← Definitive data store
│                             │
│  🏛️ Agents (agentNumber 0+) │
│  📝 Applications            │
│  🎨 Creations               │
│  🔔 Webhooks                │
└─────────────────────────────┘
          │
          ▼ API Calls Only
┌─────────────────────────────┐
│      EDEN ACADEMY           │
│     (Frontend Client)       │ ← Renders Registry data
│                             │
│  📊 Agent Dashboards        │
│  📝 Application Forms       │  
│  🎨 Gallery Views           │
│  👥 Trainer Interfaces      │
└─────────────────────────────┘
```

### Service Boundaries

**Registry Responsibilities:**
- Agent profile management and persistence
- Application workflow and review processes
- Creation cataloging with metadata
- User authentication and role management
- Webhook event distribution
- Database schema and migrations

**Academy Responsibilities:**
- UI/UX for agent interactions
- Frontend form validation and submission
- Dashboard visualizations
- Trainer collaboration interfaces
- Client-side caching and optimization

### API Contracts

**Agent Schema (Canonical):**
```typescript
interface Agent {
  id: string;
  agentNumber: number;        // Sequential 0+, matches onchain
  handle: string;            // Unique identifier
  displayName: string;       // Public name
  role: Role;               // Enum from Registry schema
  status: AgentStatus;      // Enum from Registry schema  
  cohortId: string;
  profile?: Profile;
  createdAt: string;
  updatedAt: string;
}
```

## Consequences

### Benefits
✅ **Eliminated Data Drift**: Single schema source across services  
✅ **Real-time Updates**: Webhook notifications for all changes  
✅ **Onchain Alignment**: Agent numbering matches blockchain registry  
✅ **Reduced Complexity**: No duplicate data management code  
✅ **Scalable Growth**: New services easily integrate via APIs  

### Trade-offs
❌ **Network Dependency**: Academy requires Registry API availability  
❌ **Initial Migration**: Existing Academy data needs migration  
❌ **API Coupling**: Changes to Registry APIs affect all clients  

### Mitigation Strategies
- **Fallback Systems**: Academy maintains emergency fallback data
- **API Versioning**: Backward compatibility for breaking changes  
- **Circuit Breakers**: Graceful degradation on Registry downtime
- **Caching Layer**: Reduce API calls with intelligent caching

## Monitoring

### Success Metrics
- **API Response Times**: < 200ms for agent listings
- **Data Consistency**: 0 schema drift incidents
- **System Uptime**: 99.9% Registry availability
- **Migration Success**: All agents renumbered starting from 0

### Key Performance Indicators
- Agent numbering sequential from 0 without gaps
- Academy form submissions route to Registry
- Real-time updates propagate within 1 second
- Zero hardcoded agent data in Academy codebase

## Related Decisions

This ADR supersedes previous local data management approaches and establishes:
- All new features must use Registry APIs
- Existing hardcoded data requires migration  
- Agent numbering follows onchain registry (0-indexed)
- Academy becomes Registry client, not data owner

---

**Next Actions:**
1. Run agentNumber migration to start from 0
2. Update Academy API calls to use Registry endpoints
3. Remove hardcoded agent configurations
4. Implement webhook handlers for real-time updates
5. Add circuit breakers and fallback mechanisms