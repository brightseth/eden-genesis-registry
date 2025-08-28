# ADR-001: Documentation Consolidation in Registry

## Status
Accepted

## Context
The Eden ecosystem currently has parallel documentation systems:
- Academy: `/admin/docs` with extensive architectural documentation including Registry ADRs
- Registry: `/docs` with technical specifications but missing ADR infrastructure
- Risk of documentation drift and architectural inconsistency

## Decision
Establish Registry as the single source of truth for all architectural documentation:

1. **ADR Infrastructure**: Create `/docs/adr/` in Registry for all architectural decisions
2. **Documentation API**: Implement `/api/v1/docs/**` endpoints in Registry
3. **Webhook Integration**: Extend existing webhook system with documentation events
4. **Federation Pattern**: Academy consumes Registry docs via API, never maintains copies
5. **Domain Strategy**: Implement in current deployment, prepare for eden.art migration

## Consequences
### Positive
- Single source of truth for architectural decisions
- Consistent documentation across ecosystem
- Registry maintains authority over its own architecture
- Academy focuses on user-facing documentation

### Negative
- Migration effort required from Academy parallel system
- API dependency for Academy documentation display
- Need to extend existing webhook infrastructure

## Implementation Plan
1. Create ADR infrastructure ✓
2. Extend OpenAPI specification with documentation endpoints
3. Implement documentation API endpoints
4. Add webhook events for documentation changes
5. Create Academy integration via generated SDK

## Compliance
- Follows existing "UI → Gateway → Registry" pattern
- Uses generated SDK approach per CLAUDE.md requirements
- Includes feature flags for staged rollout
- Maintains webhook security with HMAC signatures