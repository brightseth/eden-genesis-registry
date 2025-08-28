# ADR-002: Academy Documentation Deprecation Strategy

## Status
Accepted

## Context
Following ADR-001 (Documentation Consolidation), the Academy contains Registry-related documentation that violates the single source of truth principle. Specific issues:

1. **Registry ADRs in Academy**: ADR-019, ADR-022 define Registry architecture but live outside Registry
2. **Integration Guides**: Academy contains Registry integration documentation that should be authoritative from Registry
3. **Parallel Systems**: Academy's `/admin/docs` system maintains copies of Registry documentation
4. **User Confusion**: Multiple sources of truth create inconsistency and outdated information

## Decision
Implement a phased deprecation strategy:

### Phase 1: Migration (Immediate)
- **Move Registry ADRs**: Transfer ADR-019, ADR-022 from Academy to Registry `/docs/adr/`
- **Replace with Deprecation Notices**: Academy files become deprecation notices pointing to Registry
- **Webhook Integration**: Registry notifies Academy of documentation changes

### Phase 2: Federation (Short-term)
- **Academy API Consumption**: Academy displays Registry docs via API calls
- **Clear Source Attribution**: Registry content clearly marked as "Live from Registry"
- **Hybrid Display**: Academy-specific docs remain, Registry docs federated

### Phase 3: Consolidation (Long-term)  
- **Remove Deprecated Files**: Clean up Academy deprecation notices after migration
- **Full API Integration**: Academy documentation system primarily federates Registry content
- **User Education**: Teams trained on new documentation architecture

## Implementation
Created migration tools:
- `/scripts/migrate-academy-docs.ts`: Automated migration script
- `/scripts/academy-integration-template.tsx`: Federation components for Academy
- Webhook events for real-time updates

## Consequences
### Positive
- Single source of truth for Registry architecture maintained
- Real-time documentation updates across systems
- Clear ownership boundaries established
- Reduced maintenance overhead

### Negative
- Temporary disruption during migration period
- Teams need to update documentation workflows
- API dependency for Academy documentation display

## Compliance
- Maintains Registry as protocol authority per ADR-001
- Uses webhook system for real-time federation
- Follows existing Academy integration patterns
- Preserves Academy's user-facing documentation ownership

## Rollback Plan
If federation causes issues:
1. Academy can cache Registry documentation locally
2. Deprecation notices can be temporary reversed
3. Manual sync process as fallback
4. Full rollback to parallel systems if necessary

## Success Metrics
- Zero outdated Registry documentation in Academy
- 100% Registry ADRs owned by Registry
- Real-time documentation updates working
- User confusion reports decreased