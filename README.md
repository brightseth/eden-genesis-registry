# Eden Genesis Registry

The sovereign system of record for AI agents, trainers, and creators in the Eden ecosystem.

## Overview

Eden Genesis Registry is a standalone service that manages:
- Agent identity and profiles
- Trainer assignments and permissions
- Model artifacts and creations
- Progress tracking and onboarding
- Applications and invitations
- Webhook notifications for ecosystem integration

## Architecture

- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints with OpenAPI specification
- **Auth**: Magic link authentication with JWT tokens
- **Storage**: External object storage for media/artifacts (pointers only)
- **Secrets**: Vault integration (stores pointers, never raw secrets)
- **Audit**: Complete event logging for all mutations

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables (see `.env.example`)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

## API Documentation

The API follows REST principles and is documented in `openapi.yaml`.

### Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://registry.eden.art/api/v1`

### Authentication
Most endpoints require a Bearer token obtained through magic link authentication:

```bash
# Request magic link
POST /api/v1/auth/magic/start
{"email": "user@example.com"}

# Complete authentication
POST /api/v1/auth/magic/complete
{"token": "magic-link-token"}
```

### Key Endpoints

#### Agents
- `GET /api/v1/agents` - List agents
- `POST /api/v1/agents` - Create agent (admin)
- `GET /api/v1/agents/:id` - Get agent details
- `PATCH /api/v1/agents/:id` - Update agent
- `GET /api/v1/agents/:id/profile` - Get profile
- `PUT /api/v1/agents/:id/profile` - Update profile
- `GET /api/v1/agents/:id/personas` - List personas
- `POST /api/v1/agents/:id/personas` - Create persona
- `GET /api/v1/agents/:id/creations` - List creations
- `POST /api/v1/agents/:id/creations` - Create creation
- `GET /api/v1/agents/:id/progress` - Get progress

#### Applications
- `POST /api/v1/applications` - Submit application
- `PATCH /api/v1/applications/:id` - Update application
- `POST /api/v1/applications/:id/review` - Review application (admin)

#### Webhooks
- `POST /api/v1/webhooks/register` - Register webhook subscription

### Webhook Events
- `agent.created`
- `agent.updated`
- `persona.created`
- `artifact.added`
- `creation.published`
- `progress.updated`
- `application.reviewed`

## Data Model

### Core Tables
- `agents` - Agent identity and status
- `profiles` - Sovereign agent profiles
- `personas` - Agent personality configurations
- `model_artifacts` - Model files and checkpoints
- `creations` - Agent outputs and works
- `trainers` - Trainer profiles
- `agent_trainers` - Agent-trainer relationships
- `users` - User accounts
- `invitations` - Magic link invitations
- `applications` - Cohort applications
- `progress_checklists` - Onboarding progress
- `events` - Audit log

## Integration

### For Eden Academy
```javascript
// Configure registry client
const registry = new RegistryClient({
  baseUrl: process.env.GENESIS_REGISTRY_URL,
  apiKey: process.env.EDEN_API_KEY
})

// Fetch agents
const agents = await registry.getAgents({ cohort: 'genesis' })

// Subscribe to updates
await registry.subscribeWebhook({
  url: 'https://academy.eden.art/webhooks',
  events: ['agent.updated', 'creation.published']
})
```

### Security

- **No secrets in DB**: Only vault pointers stored
- **Audit everything**: Complete event log for compliance
- **Scoped access**: Role-based permissions (admin, trainer, curator, etc.)
- **Signed uploads**: Direct to storage via pre-signed URLs

## Progress Templates

### Genesis Agent Checklist
- ✅ Reserve handle & display name
- ✅ Upload 1-paragraph Statement
- ✅ Add one persona v0
- ✅ Register primary wallet
- ✅ Link primary social
- ☐ Upload 1 model artifact
- ☐ Publish first 3 creations
- ☐ Sign Graduation covenant

## Deployment

### Environment Variables
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=...
RESEND_API_KEY=...
STORAGE_URL=...
VAULT_URL=...
```

### Database Setup
```bash
# Run migrations
npx prisma migrate deploy

# Verify schema
npx prisma studio
```

### Production Checklist
- [ ] Configure production database
- [ ] Set up vault for secrets
- [ ] Configure object storage
- [ ] Set up email provider (Resend)
- [ ] Configure CORS for API access
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## Development

### Project Structure
```
src/
├── app/
│   ├── api/v1/        # REST API endpoints
│   ├── admin/         # Admin dashboard
│   ├── apply/         # Application form
│   └── invite/        # Invitation flow
├── lib/
│   ├── db.ts          # Database client
│   ├── auth.ts        # Authentication
│   ├── email.ts       # Email service
│   ├── webhooks.ts    # Webhook system
│   ├── audit.ts       # Audit logging
│   └── validations.ts # Schema validation
└── middleware/
    └── auth.ts        # Auth middleware
```

### Testing
```bash
# Run tests
npm test

# Test API endpoints
npm run test:api

# Test database
npm run test:db
```

## Support

For issues or questions, please contact the Eden team or open an issue in the repository.# Registry-as-Protocol Deployment - Wed Aug 27 01:36:10 EDT 2025
