# AgentConfigs.ts Migration Plan

## Current Status
- ✅ All agents have Registry profiles with complete manifesto, tags, and links data
- ✅ BERTHA Academy page uses Registry-driven widget system
- ✅ Registry client handles response format consistency
- ❌ 6 files still use hardcoded `agentConfigs.ts` (384 lines)

## Remaining Dependencies

### 1. Agent Site Pages (5 files)
```typescript
/Users/seth/eden-academy/src/app/sites/amanda/page.tsx
/Users/seth/eden-academy/src/app/sites/sue/page.tsx
/Users/seth/eden-academy/src/app/sites/abraham/page.tsx  
/Users/seth/eden-academy/src/app/sites/bertha/page.tsx
```

**Current Pattern:**
```typescript
import { agentConfigs } from '@/data/agentConfigs';
return <SovereignSiteTemplate agent={agentConfigs.amanda} showPrivateMode={true} />;
```

**Required Update:**
```typescript
import { registryClient } from '@/lib/registry/client';

export default async function AmandaSite() {
  const agent = await registryClient.getAgentByHandle('amanda');
  return <SovereignSiteTemplate agent={agent} showPrivateMode={true} />;
}
```

### 2. Academy Agent Page (1 file)
```typescript
/Users/seth/eden-academy/src/app/academy/agent/abraham/page.tsx
```

**Status:** Needs widget system implementation like BERTHA

## Migration Strategy

### Phase 1: Update Agent Sites (Low Risk)
1. Update each `/sites/{agent}/page.tsx` to fetch from Registry
2. Ensure `SovereignSiteTemplate` can handle Registry agent format
3. Test each site renders correctly with Registry data

### Phase 2: Complete Academy Pages (Medium Risk)  
1. Create widget profiles for remaining Academy pages
2. Update Abraham page to use widget system like BERTHA
3. Test all Academy pages work with Registry

### Phase 3: Remove AgentConfigs.ts (Final Step)
1. Verify no imports of `agentConfigs` remain
2. Move `agentConfigs.ts` to backup folder
3. Restart servers to catch any missing dependencies

## Risk Assessment

**Low Risk:**
- Agent sites are standalone pages with clear data boundaries
- SovereignSiteTemplate likely flexible enough to handle Registry format

**Medium Risk:**
- Academy pages may need widget system configuration
- Template compatibility needs verification

**High Risk:**
- Complete removal of agentConfigs.ts until all dependencies updated

## Rollback Plan

If issues occur:
1. Restore `agentConfigs.ts` from backup
2. Revert specific page changes
3. Registry data remains intact - no data loss risk

## Next Steps

1. Start with updating one agent site (e.g., Amanda) as proof of concept
2. Verify SovereignSiteTemplate compatibility
3. Batch update remaining agent sites
4. Handle Academy pages
5. Final agentConfigs.ts removal

## Success Criteria

- ✅ All agent pages render correctly from Registry data
- ✅ No hardcoded profile data in Academy codebase  
- ✅ Registry is single source of truth for all agent profiles
- ✅ 384 lines of technical debt eliminated