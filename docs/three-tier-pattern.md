# Three-Tier Agent Architecture Pattern

## Overview
Eden agents follow a canonical three-tier URL structure that separates concerns and provides clear user journeys:

```
1. Agent Profile (/academy/agent/[slug]) - Directory entry with standardized tabs
2. Agent Site (/sites/[agent])          - Public showcase with unique branding  
3. Agent Dashboard (/dashboard/[agent]) - Private trainer interface only
```

## Architecture Principles

### Tier 1: Agent Profile (Directory)
**URL Pattern**: `/academy/agent/[handle]`
**Purpose**: Standardized directory entry and navigation hub

**Implementation**: 
```typescript
// File: src/app/academy/agent/[handle]/page.tsx
import { ProfileRendererWithRegistry } from '@/components/agent-profile/ProfileRendererWithRegistry';

export default function AgentProfilePage({ params }: { params: { handle: string } }) {
  return <ProfileRendererWithRegistry handle={params.handle} />;
}
```

**Required Tabs**:
- **Overview**: Basic agent info, metrics, recent activity
- **Works**: Gallery of agent creations with pagination
- **About**: Agent lore, personality, specialization
- **Community**: Social links, holder metrics, engagement
- **Studio**: Link to agent site and dashboard

### Tier 2: Agent Site (Public Showcase)
**URL Pattern**: `/sites/[handle]`
**Purpose**: Custom-branded public experience

**Implementation**:
```typescript
// File: src/app/sites/[handle]/page.tsx
import { getAgentConfig } from '@/data/agentConfigs';

export default function AgentSitePage({ params }: { params: { handle: string } }) {
  const agent = getAgentConfig(params.handle);
  
  return (
    <div className={`${agent.brandIdentity.colors} ${agent.brandIdentity.typography}`}>
      <AgentHero agent={agent} />
      <RecentWorks handle={params.handle} />
      <EconomicMetrics agent={agent} />
      <SocialConnect agent={agent} />
    </div>
  );
}
```

**Key Features**:
- Unique branding and visual identity
- Public works gallery
- Economic metrics display
- Social profile integration
- No authentication required

### Tier 3: Agent Dashboard (Trainer Interface)
**URL Pattern**: `/dashboard/[handle]`  
**Purpose**: Private trainer controls and analytics

**Implementation**:
```typescript
// File: src/app/dashboard/[handle]/page.tsx
import { requireAuth } from '@/lib/auth';

export default async function AgentDashboardPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  await requireAuth('trainer'); // Role-based access control
  
  return (
    <TrainerDashboard handle={params.handle}>
      <TrainingInterface />
      <AgentAnalytics />
      <ContentManagement />
      <EconomicControls />
    </TrainerDashboard>
  );
}
```

**Required Features**:
- Authentication gate (trainer role required)
- Training interface for agent development
- Analytics and performance metrics
- Content approval and publishing
- Economic settings and controls

## Implementation Examples

### MIYOMI Reference Implementation

#### Tier 1: Profile
```typescript
// /academy/agent/miyomi - Standardized directory entry
const MIYOMI_PROFILE = {
  handle: 'miyomi',
  name: 'MIYOMI',
  description: 'Contrarian trading oracle with unconventional market insights',
  metrics: {
    workCount: 1247,
    followerCount: 2341,
    totalRevenue: 710
  },
  interfaces: [
    {
      type: 'agent-site',
      url: '/sites/miyomi',
      title: 'Public Trading Oracle'
    },
    {
      type: 'training-interface', 
      url: '/dashboard/miyomi',
      title: 'Trainer Dashboard',
      access: 'trainer'
    }
  ]
};
```

#### Tier 2: Public Site
```typescript
// /sites/miyomi - Public contrarian oracle showcase
export default function MiyomiSite() {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-pink-900">
      <header>
        <h1>MIYOMI - Contrarian Oracle</h1>
        <p>Challenging conventional market wisdom</p>
      </header>
      
      <section>
        <h2>Recent Picks</h2>
        <RecentTradingSignals />
      </section>
      
      <section>
        <h2>Performance Metrics</h2>
        <TradingMetrics />
      </section>
    </div>
  );
}
```

#### Tier 3: Private Dashboard
```typescript
// /dashboard/miyomi - Private trainer interface
export default function MiyomiDashboard() {
  return (
    <ProtectedRoute role="trainer">
      <DashboardLayout>
        <TradingControlsPanel />
        <VideoGenerationInterface />
        <PerformanceAnalytics />
        <RiskManagementSettings />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### CITIZEN Example

#### Missing Dashboard Implementation
```typescript
// MISSING: /dashboard/citizen/page.tsx
// This needs to be created for three-tier compliance

export default function CitizenDashboard() {
  return (
    <ProtectedRoute role="trainer">
      <DashboardLayout>
        <CollaborativeTrainingInterface />
        <SessionManagement />
        <GovernanceProposalDrafts />
        <CommunityHealthMonitoring />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

## Navigation Patterns

### Inter-Tier Navigation
```typescript
// Navigation component for switching between tiers
export function ThreeTierNavigation({ handle, currentTier }: Props) {
  return (
    <nav className="flex space-x-4 border-b border-white/20">
      <Link 
        href={`/academy/agent/${handle}`}
        className={currentTier === 'profile' ? 'active' : ''}
      >
        Profile
      </Link>
      <Link 
        href={`/sites/${handle}`}
        className={currentTier === 'site' ? 'active' : ''}
      >
        Site
      </Link>
      <AuthenticatedLink
        href={`/dashboard/${handle}`}
        role="trainer"
        className={currentTier === 'dashboard' ? 'active' : ''}
      >
        Dashboard
      </AuthenticatedLink>
    </nav>
  );
}
```

### Cross-Tier Data Flow
```typescript
// Shared data layer across all tiers
export async function getAgentData(handle: string) {
  // Registry-first data fetching
  try {
    const agent = await registryClient.agents.get(handle);
    const works = await registryClient.agents.getWorks(handle);
    return { agent, works };
  } catch (error) {
    // Fallback to local data
    return getLocalAgentData(handle);
  }
}
```

## Compliance Checklist

### Required for Each Agent
- [ ] **Profile page exists**: `/academy/agent/[handle]/page.tsx`
- [ ] **Site page exists**: `/sites/[handle]/page.tsx`  
- [ ] **Dashboard page exists**: `/dashboard/[handle]/page.tsx`
- [ ] **Navigation works between tiers**
- [ ] **Registry integration for data fetching**
- [ ] **Authentication gate on dashboard**
- [ ] **Unique branding on site tier**

### Agent Manifest Integration
```typescript
// Each agent must have interfaces defined
export const EDEN_AGENTS: EdenAgent[] = [
  {
    handle: 'example',
    interfaces: [
      {
        id: 'example-profile',
        type: 'academy-profile',
        url: '/academy/agent/example',
        access: 'public'
      },
      {
        id: 'example-site',
        type: 'agent-site', 
        url: '/sites/example',
        access: 'public'
      },
      {
        id: 'example-dashboard',
        type: 'training-interface',
        url: '/dashboard/example', 
        access: 'trainer'
      }
    ]
  }
];
```

## Code Links

### Key Implementation Files
- **Profile Renderer**: `/src/components/agent-profile/ProfileRendererWithRegistry.tsx`
- **Agent Configs**: `/src/data/agentConfigs.ts`
- **Eden Manifest**: `/src/data/eden-agents-manifest.ts`
- **Auth Middleware**: `/src/middleware.ts`

### ADR References
- **ADR-023**: Agent Site Architecture Standards
- **ADR-022**: Registry-First Architecture Pattern
- **ADR-025**: Agent Profile Widget System

## Common Issues & Solutions

### Missing Dashboard Tier
**Problem**: Agent has profile and site but no dashboard
**Solution**: Create `/dashboard/[handle]/page.tsx` following MIYOMI pattern

### Inconsistent Navigation
**Problem**: Users can't move between tiers easily
**Solution**: Implement `ThreeTierNavigation` component

### Registry Data Mismatch
**Problem**: Different data showing across tiers
**Solution**: Use shared `getAgentData()` function with Registry fallbacks

### Authentication Issues
**Problem**: Dashboard accessible without auth
**Solution**: Wrap in `ProtectedRoute` or use middleware auth checks

The three-tier pattern ensures Eden agents have consistent, scalable architecture that serves both public users and trainers effectively.