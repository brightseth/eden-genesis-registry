# Eden Genesis Registry - Production Deployment Checklist

## Architecture Validation ✅
- Registry serves as single source of truth
- API contracts stable at `/api/v1/agents`
- Database schema consistent with domain models
- Environment separation maintained

## Pre-Deployment Requirements

### 1. Database Configuration
```bash
# Verify Vercel environment variables
npx vercel env ls

# Required environment variables:
# - DATABASE_URL (PostgreSQL connection string)
# - REGISTRY_API_KEY
```

### 2. Database Setup Options

#### Option A: Supabase (Recommended)
1. Create project at https://supabase.com
2. Get connection string from Settings > Database
3. Add to Vercel: `npx vercel env add DATABASE_URL production`

#### Option B: Neon
1. Create project at https://neon.tech  
2. Copy connection string
3. Add to Vercel environment

#### Option C: Vercel Postgres (Pro accounts)
1. Add from Vercel Dashboard > Storage
2. DATABASE_URL automatically configured

## Deployment Process

### Step 1: Configure Environment
```bash
# Add production database URL
npx vercel env add DATABASE_URL production
# Paste your PostgreSQL connection string

# Verify configuration
npx vercel env ls
```

### Step 2: Deploy with Database Setup
```bash
# Deploy to production (includes DB schema + seeding)
npx vercel --prod

# Or manually run setup first
export DATABASE_URL="your-connection-string"
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh
```

### Step 3: Verify Deployment
```bash
# Test API health (should show 10+ agents)
curl https://eden-genesis-registry.vercel.app/api/v1/status

# Test agent endpoint
curl https://eden-genesis-registry.vercel.app/api/v1/agents

# Test frontend
open https://eden-genesis-registry.vercel.app/agents
```

## Expected Results

### Healthy Status Response
```json
{
  "status": "healthy",
  "database": "connected", 
  "agentCount": 10,
  "cohortCount": 1,
  "genesisAgents": 10,
  "activeAgents": 8,
  "seeded": "complete"
}
```

### Agent Count Breakdown
- **10 Total Agents**: All Genesis cohort members
- **8 Active Agents**: Public visibility agents
- **2 Open Slots**: Internal visibility (open-1, open-2)

### Frontend Display
- Shows "10 AGENTS REGISTERED"
- Lists 8 active agents in grid
- Shows 2 open slots in separate section

## Troubleshooting

### Issue: "0 AGENTS REGISTERED"

**Cause**: Database not seeded or wrong DATABASE_URL

**Solution**:
```bash
# Check environment
curl https://eden-genesis-registry.vercel.app/api/v1/status

# If seeded: "incomplete", run:
npx vercel --prod  # Redeploy with fixed build command
```

### Issue: API Returns Empty Array

**Cause**: Database connection working but no data

**Solution**:
```bash
# Manually seed production database
export DATABASE_URL="your-production-url"
npx prisma db seed
npx vercel --prod
```

### Issue: Database Connection Error

**Cause**: Invalid DATABASE_URL format

**Solution**:
```bash
# Verify connection string format:
# PostgreSQL: postgres://user:password@host:port/database
# Supabase: postgres://postgres.[ref]:[password]@[host]:5432/postgres
npx vercel env rm DATABASE_URL production
npx vercel env add DATABASE_URL production
```

## Architecture Compliance Check

- ✅ Registry maintains single source of truth
- ✅ API versioning consistent (`/api/v1/`)
- ✅ Data models follow domain language (Agent, Cohort, Work)
- ✅ Environment variable separation
- ✅ Database seeding automated in build process
- ✅ Error handling and logging in place
- ✅ CORS configuration for studio integrations

## Rollback Plan

If deployment fails:
```bash
# Revert vercel.json build command
git checkout HEAD~1 vercel.json

# Redeploy previous version
npx vercel --prod

# Manual database seed if needed
export DATABASE_URL="your-url"
npx prisma db seed
```