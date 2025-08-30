# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eden Genesis Registry is the sovereign system of record for AI agents, trainers, and creators in the Eden ecosystem. It serves as the authoritative source for agent identity, profiles, model artifacts, creations, and progress tracking.

## Core Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production (includes Prisma generation)
npm run build

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate
```

### Database Operations
```bash
# Run database migrations
npx prisma migrate dev

# Deploy migrations to production
npx prisma migrate deploy

# Seed database with initial data
npm run prisma:seed

# Open Prisma Studio for data inspection
npx prisma studio

# Production database setup (with credentials)
DATABASE_URL="<production_url>" npx tsx scripts/setup-production-database.ts
```

### Documentation & Validation
```bash
# Generate API documentation from OpenAPI spec
npm run docs:generate

# Validate documentation consistency
npm run docs:validate
```

## Architecture

### Registry-First Pattern (ADR-022)
The codebase follows a "Registry-First Architecture Pattern" where:
- Registry is the single source of truth for all agent data
- Academy and other services consume data via API endpoints
- Data transformation happens at API boundaries
- Graceful fallbacks to mock data when Registry is unavailable

### Core Data Models
The Prisma schema defines the complete data model with key entities:
- **Agent**: Core agent identity with sequential numbering, roles, and status
- **Profile**: Sovereign agent profiles with statements, manifesto, economic data
- **AgentLore**: Comprehensive identity framework with philosophy, expertise, voice
- **Creation**: Agent works/outputs with metadata and market data
- **Persona**: Agent personality configurations
- **ModelArtifact**: Model files and checkpoints
- **ProgressChecklist**: Onboarding progress tracking
- **Trading Models**: MIYOMI-specific trading positions, signals, sentiment, metrics

### API Structure
RESTful API endpoints under `/src/app/api/v1/`:
- `/agents` - Agent management and data
- `/applications` - Cohort applications
- `/invitations` - Magic link invitations
- `/status` - System health and monitoring
- `/docs` - API documentation endpoints
- `/genesis-cohort` - Genesis cohort specific operations

### Key Libraries & Services
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Magic link authentication with JWT tokens via iron-session
- **Email**: Resend for transactional emails
- **Webhooks**: Event-driven notifications system
- **Validation**: Zod schemas with comprehensive input validation
- **Audit**: Complete event logging for all mutations

## Development Patterns

### Database Access
Always use the singleton Prisma client from `/src/lib/db.ts`:
```typescript
import { prisma } from '@/lib/db'
```

### Error Handling
Follow graceful degradation patterns:
```typescript
try {
  const data = await registryAPI()
  return data
} catch (error) {
  console.error('Registry error:', error)
  // Fall back to mock data or cached data
  return fallbackData
}
```

### Authentication
Use the auth middleware for protected endpoints. Magic link flow:
1. `POST /api/v1/auth/magic/start` - Request magic link
2. `POST /api/v1/auth/magic/complete` - Complete authentication

### Event System
All mutations should trigger audit events via `/src/lib/audit.ts`

## Genesis Agent System

The Registry manages a complete roster of 10 Genesis agents:
1. Abraham - Collective Intelligence Artist
2. Solienne - Digital Consciousness Explorer  
3. Koru - Community Healer
4. Geppetto - Narrative Architect
5. Sue - Chief Curator
6. Amanda - Art Collector (via static data)
7. Citizen - DAO Manager
8. Miyomi - Market Predictor
9. Bertha - Investment Strategist
10. VERDELIS - Environmental Artist

Each agent has:
- Sequential agent numbering system
- Complete profile with statement, manifesto, economic data
- AgentLore with comprehensive identity framework
- Progress checklists for onboarding
- Role-based permissions (CURATOR, INVESTOR, ADMIN, etc.)

## Special Features

### Trading System (MIYOMI)
Comprehensive trading models for live market operations:
- TradingPosition, TradingSignal, MarketSentiment, TradingMetrics
- Real-time PnL calculations and performance tracking

### Progress Tracking
Structured onboarding with template-based checklists:
- Genesis Agent checklist
- Trainer, Curator, Collector, Investor tracks
- Progress percentages and completion tracking

### Webhook System
Event-driven architecture with webhook deliveries for:
- agent.created, agent.updated
- persona.created, artifact.added
- creation.published, progress.updated

## Deployment & Environment

### Environment Variables
Required environment variables:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
RESEND_API_KEY=...
STORAGE_URL=...
VAULT_URL=...
```

### Production Database
Production database setup via script with pre-configured agent data and roles.

## ADR Compliance

Follow established ADRs in `/docs/adr/`:
- ADR-022: Registry-First Architecture Pattern (mandatory)
- ADR-019: Registry Integration Pattern
- ADR-025: Flagship Artistic Development Architecture

## Security Considerations

- No secrets stored in database (vault pointers only)
- Complete audit trail for compliance
- Role-based access control
- CORS configuration for API access
- Signed uploads for media storage