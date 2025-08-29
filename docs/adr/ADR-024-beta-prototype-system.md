# ADR-024: Beta Prototype System for Eden Academy

## Status: Accepted
**Date**: 2025-08-29
**Author**: Feature Integrator (Claude)

## Context

Eden Academy has evolved rapidly with multiple experimental features, prototype dashboards, and unused interfaces scattered across the codebase. We need a systematic way to:

1. Preserve historical prototypes for reference and potential revival
2. Organize experimental features with proper feature flag controls
3. Provide easy access to prototype versions without cluttering production interfaces
4. Scale the prototype management system across all 10 Genesis agents

## Decision

We will implement a **four-tier architecture** by adding a **Beta Environment** as the fourth tier:

```
1. Agent Profile (/agents/[handle])     - Registry directory entry
2. Agent Site (/sites/[agent])          - Production public showcase  
3. Agent Dashboard (/dashboard/[agent]) - Production trainer interface
4. Agent Beta (/beta/[agent])           - Historical prototypes & experiments
```

### Key Components

#### 1. Beta Hub Structure
- `/beta/[agent]` - Main beta environment hub
- `/beta/[agent]/embedded/[prototypeId]` - Individual prototype viewer
- Organized categories: Active Experiments, Historical Prototypes, Archived Versions

#### 2. Data Architecture
- **PrototypeVersion**: Individual prototype with versioning, metadata, features
- **AgentPrototypeCollection**: Complete collection per agent with categorization  
- **BetaFeatureFlag**: Feature flag system for gradual rollout control

#### 3. Integration Points
- Agent profiles link to beta environments via "BETA LAB" cards
- Admin interface at `/admin/beta` for system-wide management
- API endpoints for prototype and feature flag management
- Migration hooks for moving existing interfaces to beta archive

#### 4. Component Registry
- Lazy-loaded prototype components for embedded viewing
- Feature flag wrappers for conditional rendering
- Prototype navigation between versions

## Architecture Benefits

### 1. Historical Preservation
- All prototype versions preserved with full context and metadata
- Clear documentation of why features were archived or replaced
- Learning history maintained for future development insights

### 2. Experimental Safety
- Feature flags control access to unstable features
- Clear beta warnings and experimental status indicators
- Gradual rollout capabilities with percentage-based distribution

### 3. Development Efficiency  
- Organized prototype access reduces development overhead
- Easy comparison between historical and current implementations
- Component reuse through embedded prototype system

### 4. Scalable Architecture
- Consistent structure across all 10 Genesis agents
- Standardized API patterns for prototype management
- Admin tools for system-wide beta content oversight

## Implementation Details

### API Endpoints
- `GET /api/v1/agents/[id]/prototypes` - Fetch agent prototype collection
- `POST /api/v1/agents/[id]/prototypes` - Register new prototype
- `POST /api/v1/agents/[id]/prototypes/[id]/archive` - Archive prototype
- `GET /api/v1/agents/[id]/beta-flags` - Fetch feature flags
- `PATCH /api/v1/agents/[id]/beta-flags/[key]` - Toggle feature flag

### Feature Flag Integration
```typescript
// Check if beta feature is enabled
const { isEnabled } = useBetaFeatureFlag('ai-advisor', 'miyomi')

// Conditional rendering with beta wrapper
<BetaFeatureWrapper flagKey="advanced-charts" agentHandle="miyomi">
  <AdvancedChartsComponent />
</BetaFeatureWrapper>
```

### Migration Strategy
1. **Phase 1**: Set up beta infrastructure and API endpoints
2. **Phase 2**: Migrate historical prototypes with full metadata
3. **Phase 3**: Create feature flags for experimental features
4. **Phase 4**: Migrate existing dashboards to beta archive
5. **Phase 5**: Update agent profiles with beta navigation

## Security Considerations

- **Authentication**: Beta access requires trainer or admin role
- **Feature Flags**: Admin-only flag management with audit logging
- **Prototype Isolation**: Beta components isolated from production data
- **Rate Limiting**: API endpoints protected against abuse

## Monitoring & Observability

- **Prototype Usage**: Track which prototypes are accessed most frequently
- **Feature Flag Performance**: Monitor feature flag toggle frequency and rollout success
- **Archive Cleanup**: Automated cleanup of old unused prototypes
- **Error Tracking**: Comprehensive logging for prototype loading failures

## Rollback Strategy

1. **Immediate**: Disable feature flags to hide experimental features
2. **Graceful**: Archive active prototypes to remove from beta hub
3. **Complete**: Remove beta navigation links from agent profiles
4. **Emergency**: Disable entire `/beta/*` routes via environment variable

## Success Metrics

- **Prototype Preservation**: All historical interfaces migrated with metadata
- **Developer Efficiency**: Reduced time to access and compare prototype versions  
- **Feature Stability**: Smooth rollout of experimental features via flags
- **User Experience**: Clear separation between production and experimental interfaces

## Alternative Considered

**Single Archive Page**: Considered a single `/prototypes` page for all agents, but rejected due to:
- Poor organization and discoverability
- Lack of agent-specific context
- Difficulty in maintaining agent-specific feature flags
- Poor integration with existing three-tier architecture

## References

- Three-tier architecture from ADR-023
- Feature flag patterns from staged launch system
- Prototype component patterns from existing dashboard implementations

## Implementation Files

### Core System
- `/src/lib/schemas/prototype.schema.ts` - TypeScript schemas
- `/src/lib/beta-prototype-manager.ts` - Core prototype management  
- `/src/lib/beta-feature-flags.ts` - Feature flag service
- `/src/lib/beta-migration-hooks.ts` - Migration utilities

### User Interface
- `/src/app/beta/[agent]/page.tsx` - Beta hub page
- `/src/app/beta/[agent]/embedded/[prototypeId]/page.tsx` - Prototype viewer
- `/src/app/admin/beta/page.tsx` - Admin management interface

### API Layer
- `/src/app/api/v1/agents/[id]/prototypes/route.ts` - Prototype CRUD
- `/src/app/api/v1/agents/[id]/beta-flags/route.ts` - Feature flag management

### Integration
- `/src/app/agents/[handle]/page.tsx` - Updated with beta navigation
- `/src/components/prototypes/` - Prototype component registry

### Setup & Migration
- `/scripts/setup-beta-system.ts` - Complete system setup
- `/scripts/migrate-prototypes.ts` - Historical prototype migration