# Eden MVP Workspace Organization

## Terminal Windows Setup

### Window 1: 🏛️ REGISTRY (This Window)
**Purpose:** Source of truth for all agent data, trainers, and creations
**Directory:** `/Users/seth/eden-genesis-registry`
**Focus:** 
- Agent identity management
- Application processing
- Progress tracking
- API endpoints for other services
**Run:** `npm run dev` (port 3000)

### Window 2: 🎓 ACADEMY
**Purpose:** Near-term fix for current eden.art site, agent training interface
**Directory:** `/Users/seth/eden-academy`
**Focus:**
- Agent showcase pages
- Training interface
- Public-facing site
- Integration with Registry API
**Run:** `npm run dev` (port 3001)

### Window 3: 💎 EDEN2
**Purpose:** Next version frontend for collectors/investors/buyers/patrons
**Directory:** `/Users/seth/eden2`
**Focus:**
- Collector dashboard
- Investment tracking
- Patronage tiers
- Market analytics
**Run:** `npm run dev` (port 3002)

### Window 4: 🔮 EDEN2038
**Purpose:** 13-year vision tied to Abraham's contract cadence
**Directory:** `/Users/seth/eden2038`
**Focus:**
- Long-term narrative
- Time capsules
- Graduation ceremonies
- Covenant tracking
**Run:** `npm run dev` (port 3003)

### Window 5: 🎨 CRIT
**Purpose:** Curation frontend for trainers using agent lens (Nina as curator)
**Directory:** `/Users/seth/design-critic-agent`
**Focus:**
- Curation workflows
- Agent-as-curator interface
- Quality assessment
- Work selection
**Run:** `npm run dev` (port 3004)

### Window 6: 🎯 MIYOMI
**Purpose:** Claude SDK agent for prediction markets
**Directory:** `/Users/seth/miyomi`
**Focus:**
- Prediction market creation
- Probability calculations
- Rich media generation
- Sync with Registry identity
**Run:** TBD based on Claude SDK setup

## Data Flow Architecture

```
┌─────────────┐
│   REGISTRY  │ ← Source of Truth
└──────┬──────┘
       │ Webhooks/API
       ├────────────────┬─────────────┬──────────────┬─────────────┐
       ↓                ↓             ↓              ↓             ↓
┌──────────┐    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ ACADEMY  │    │  EDEN2   │  │ EDEN2038 │  │   CRIT   │  │  MIYOMI  │
└──────────┘    └──────────┘  └──────────┘  └──────────┘  └──────────┘
Public Site     Collectors    Long Vision   Curation      Predictions
```

## Quick Commands

```bash
# Source the aliases (run once per terminal session)
source ~/.zshrc

# Navigate to projects
eden-registry  # You are here
eden-academy   # Academy frontend
eden2          # Collector frontend
eden2038       # Vision frontend
crit           # Curation frontend
miyomi         # Prediction agent

# Start all services (run in each window)
npm run dev
```

## Integration Points

1. **REGISTRY → ALL**: Agent data, progress, creations
2. **ACADEMY → REGISTRY**: Public display, training updates
3. **EDEN2 → REGISTRY**: Collection data, investment tracking
4. **EDEN2038 → REGISTRY**: Covenant signatures, time capsules
5. **CRIT → REGISTRY**: Curation decisions, quality scores
6. **MIYOMI → REGISTRY**: Agent identity, prediction data

## Environment Variables Needed

Each project needs:
```bash
GENESIS_REGISTRY_URL=http://localhost:3000  # Point to Registry
GENESIS_REGISTRY_API_KEY=your-key-here      # For API auth
```

## Development Workflow

1. Start REGISTRY first (source of truth)
2. Start other services as needed
3. Use webhook subscriptions for real-time updates
4. Check Registry API at http://localhost:3000/api/v1/status

## Current Status

- ✅ REGISTRY: Core API working, routing conflicts resolved
- 🔧 ACADEMY: Integration in progress
- 🔧 EDEN2: Frontend development
- 🔧 EDEN2038: Vision/narrative focus
- ✅ CRIT: Connected to Registry, deployed on Vercel (needs dynamic scoring)
- 🔧 MIYOMI: Claude SDK integration pending

## CRIT Integration Notes

### ✅ What's Working
- Registry API connection established
- Image display from Registry
- Agent/curator/venue selectors
- Both services deployed on Vercel

### 🔧 What Needs Work
**Dynamic Scoring Implementation**
- Location: `/Users/seth/design-critic-agent/index.html`
- Function: `evaluateImage()` (around line 1800)
- Current: `score = Math.random() * 30 + 70` (hardcoded)
- Needed: `score = curator.criteria.exhibitionReadiness * baseScore`

### 🚀 Quick Test
```bash
cd /Users/seth/design-critic-agent
open https://design-critic-agent.vercel.app
# Click "Browse Registry" - should load Solienne images
```