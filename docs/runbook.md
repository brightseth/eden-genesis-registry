# Eden Operations Runbook

## Deployment Guide

### Production Environment
- **Registry**: `https://registry.eden2.io` (Vercel + Supabase)
- **Academy**: `https://academy.eden2.io` (Vercel + Supabase)
- **Agent Sites**: `/sites/[handle]` (integrated into Academy)

### Environment Variables
```bash
# Registry (.env.local)
DATABASE_URL="postgresql://..."
JWT_SECRET="registry-jwt-secret-2024"
NEXTAUTH_SECRET="..."
REPLICATE_API_TOKEN="..."

# Academy (.env.local)  
NEXT_PUBLIC_SUPABASE_URL="..."
SUPABASE_SERVICE_KEY="..."
ANTHROPIC_API_KEY="..."
ENABLE_PRIVY_WALLET_AUTH="true"
```

### Deployment Commands
```bash
# Deploy Registry to production
cd eden-genesis-registry
vercel deploy --prod

# Deploy Academy to production  
cd eden-academy
vercel deploy --prod

# Run database migrations
npx prisma db push
npx supabase db push
```

## Security Configuration

### API Key Management
```bash
# Generate Registry API key
npx tsx scripts/generate-api-key.ts

# Test API key access
curl -H "Authorization: Bearer <key>" https://registry.eden2.io/api/v1/agents
```

### Rate Limiting
- Chat endpoints: 10 requests per 10 minutes
- Admin endpoints: 50 requests per minute  
- Webhook endpoints: 1000 requests per minute
- Public APIs: 100 requests per minute

### CORS & Security Headers
```typescript
// Configured domains
const allowedOrigins = [
  'https://registry.eden2.io',
  'https://academy.eden2.io',
  'https://solienne.eden2.io',
  'https://abraham.eden2.io'
];
```

### Input Validation
- All inputs sanitized with DOMPurify
- Zod schema validation on API routes
- SQL injection prevention via Prisma/Supabase
- XSS protection with Content Security Policy

## Branching Strategy

### Git Workflow
```bash
# Main branches
main        # Production-ready code
develop     # Integration branch
feature/*   # Feature development

# Agent-specific worktrees  
git worktree add ../abraham-dev agents/abraham
git worktree add ../solienne-dev agents/solienne
```

### Development Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Create PR to `develop`
4. Deploy to staging for review
5. Merge to `main` for production

### Release Process
```bash
# Tag releases
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# Deploy to production
vercel deploy --prod --target production
```

## Monitoring & Alerts

### Health Checks
```bash
# Registry health
curl https://registry.eden2.io/api/v1/status

# Academy health  
curl https://academy.eden2.io/api/health

# Agent-specific health
curl https://academy.eden2.io/api/agents/abraham/health
```

### Database Monitoring
```sql
-- Check agent work counts
SELECT a.handle, COUNT(c.id) as work_count 
FROM agents a 
LEFT JOIN creations c ON a.id = c.agent_id 
GROUP BY a.handle;

-- Monitor API usage
SELECT endpoint, COUNT(*) as requests, AVG(response_time)
FROM api_logs 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint;
```

### Error Tracking
- Vercel Analytics for performance monitoring
- Supabase logs for database queries
- Custom error logging in `/api/v1/monitoring`

## Troubleshooting

### Common Issues

#### Agent Profile Not Loading
```bash
# Check Registry sync
curl https://registry.eden2.io/api/v1/agents/abraham

# Force refresh Academy cache
curl -X POST https://academy.eden2.io/api/sync
```

#### Missing Agent Works
```bash
# Verify database connection
npx prisma db pull

# Check work imports
SELECT COUNT(*) FROM creations WHERE agent_id = 'abraham';

# Re-import if needed
npx tsx scripts/import-abraham-works.ts
```

#### Three-Tier Navigation Broken
```bash
# Verify routes exist:
# /academy/agent/[handle] - Profile
# /sites/[handle] - Public site  
# /dashboard/[handle] - Trainer interface

# Check navigation config
grep -r "three-tier" src/components/
```

### Emergency Procedures

#### Registry Outage
1. Check Vercel deployment status
2. Verify Supabase database connectivity
3. Fall back to Academy cached data
4. Enable maintenance mode if needed

#### Data Loss Recovery
```bash
# Restore from backup
pg_restore --clean --create -d registry_db backup.sql

# Re-sync agent data
npx tsx scripts/migrate-from-academy.ts full
```

#### Security Incident
1. Rotate API keys immediately
2. Check access logs for suspicious activity
3. Update security headers and CORS policies
4. Notify stakeholders of any data exposure

## Performance Optimization

### Caching Strategy
- Registry API responses cached 5 minutes
- Agent profile data cached 15 minutes  
- Static assets cached 24 hours
- Database queries optimized with indexes

### CDN Configuration
```bash
# Vercel edge functions
vercel.json:
{
  "functions": {
    "src/app/api/v1/agents/[handle]/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Database Optimization
```sql
-- Key indexes
CREATE INDEX idx_creations_agent_id ON creations(agent_id);
CREATE INDEX idx_creations_created_at ON creations(created_at);
CREATE INDEX idx_agents_handle ON agents(handle);
```

## Maintenance Tasks

### Weekly Tasks
- Review error logs and performance metrics
- Update agent work counts and metrics
- Check for broken image URLs
- Verify all health endpoints

### Monthly Tasks  
- Database cleanup and optimization
- Security audit of API endpoints
- Update dependencies and run tests
- Backup verification and testing

### Quarterly Tasks
- Full security penetration testing
- Performance load testing
- Disaster recovery drills
- Documentation updates