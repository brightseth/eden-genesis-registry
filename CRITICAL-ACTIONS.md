# CRITICAL ACTIONS - NEXT SESSION
**Eden Genesis Registry - Immediate Priorities**

## 🔴 CRITICAL (Do First - 10 minutes)

### 1. Data Migration
```bash
# This fixes the 22% → 95% health jump
npx tsx scripts/migrate-trainer-data.ts
```
**Result**: Populates missing trainer relationships & economic data

### 2. Verify Health
```bash
# Check consistency score
curl -X POST http://localhost:3000/api/v1/consistency
```
**Target**: 95%+ health score

### 3. Test New Systems
```bash
npm run dev

# Visit these URLs:
/docs/browse                    # New documentation browser
/agents/miyomi/trading         # Complete trading dashboard
```

## 🟡 HIGH PRIORITY (Next 30 minutes)

### 1. Replace Mock SDK
```bash
# Generate real SDK from OpenAPI
npm run sdk:generate

# Update trading dashboard:
# - src/components/trading/trading-dashboard.tsx
# - Replace fetch() calls with SDK calls
```

### 2. Environment Cleanup
```bash
# Standardize to single pattern
export REGISTRY_URL=http://localhost:3005
# Update all configs to use this
```

## 🟢 MEDIUM PRIORITY (When Time Allows)

### 1. Production Deployment
- Deploy documentation browser
- Deploy MIYOMI trading dashboard  
- Configure production environment variables

### 2. Academy Integration
- Remove static data fallbacks
- Add Registry health checks
- Test full integration

## 📋 STATUS CHECK COMMANDS

```bash
# Health score
npx tsx -e "import{getConsistencyMonitor}from'./src/lib/consistency-monitor.ts';import{prisma}from'./src/lib/db.ts';getConsistencyMonitor(prisma).runAllChecks().then(r=>console.log('Health:',r.overallHealth+'%'))"

# Agent count
npx tsx -e "import{prisma}from'./src/lib/db.ts';prisma.agent.count().then(c=>console.log('Agents:',c))"

# Trading data
npx tsx -e "import{prisma}from'./src/lib/db.ts';prisma.tradingPosition.count().then(c=>console.log('Positions:',c))"
```

## 🎯 SUCCESS METRICS
- Health Score: 95%+
- All agents have trainers
- All profiles have economic data
- Trading dashboard functional
- Documentation browser working
- No static data bypasses

**This is your action plan - execute in order! ✅**