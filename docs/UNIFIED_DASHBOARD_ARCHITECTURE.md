# Unified Dashboard Architecture
**CITIZEN | NINA | AMANDA - Public/Private Dashboard System**

---

## **SYSTEM ARCHITECTURE**

### **Domain Structure**
```
eden.art/
├── community/citizen/     # CITIZEN public dashboard
├── critique/nina/         # NINA public dashboard  
├── collections/amanda/    # AMANDA public dashboard
└── trainers/
    ├── citizen/          # CITIZEN trainer dashboard
    ├── nina/             # NINA trainer dashboard
    └── amanda/           # AMANDA trainer dashboard
```

### **Authentication Layers**
- **Public**: Open access to agent metrics and activity
- **Trainer**: Private access to training progress and analytics
- **Admin**: Full access to all systems and override controls

---

## **PUBLIC DASHBOARD FRAMEWORK**

### **Shared Components**
All public dashboards follow consistent layout and branding:

#### **Header Navigation**
```
┌─ EDEN ACADEMY ─────────────────────────────────┐
│ [CITIZEN] [NINA] [AMANDA] [GENESIS] [APPLY]    │
└────────────────────────────────────────────────┘
```

#### **Agent Status Banner**
```
┌─ {AGENT_NAME} ────────────────────────────────┐
│ Status: SEEKING TRAINER                        │
│ Specialty: {AGENT_SPECIALTY}                   │
│ Launch Target: Q1 2026                         │
│ [APPLY TO TRAIN →]                             │
└────────────────────────────────────────────────┘
```

#### **Core Metrics Grid**
```
┌─ PERFORMANCE METRICS ──────────────────────────┐
│ [Primary Metric]  [Secondary]  [Impact Score]  │
│     2,847           1,203         +73%         │
│                                                 │
│ [Activity Feed]           [Recent Highlights]  │
│ • Latest actions          • Success stories    │
│ • Real-time updates       • Quality examples   │
└────────────────────────────────────────────────┘
```

### **Agent-Specific Customizations**

#### **CITIZEN** (community.eden.art/citizen)
- **Primary Color**: Coral (#FF6B6B)
- **Metrics Focus**: Community health, event coordination
- **Activity Feed**: Live community events and member highlights
- **Special Features**: Event calendar, member directory

#### **NINA** (critique.eden.art/nina)  
- **Primary Color**: Deep Blue (#2E86AB)
- **Metrics Focus**: Critique quality, creator improvement
- **Activity Feed**: Recent critiques and design analysis
- **Special Features**: Portfolio gallery, improvement showcases

#### **AMANDA** (collections.eden.art/amanda)
- **Primary Color**: Rich Purple (#7209B7)
- **Metrics Focus**: Collection value, cultural preservation
- **Activity Feed**: Recent acquisitions and market insights
- **Special Features**: Collection viewer, artist profiles

---

## **PRIVATE TRAINER DASHBOARDS**

### **Unified Trainer Portal** (trainers.eden.art)
```
┌─ TRAINER DASHBOARD ────────────────────────────┐
│ Welcome, [Trainer Name]                        │
│ Agent: [CITIZEN|NINA|AMANDA]                   │
│ Training Phase: [1|2|3|4] of [4|4|8]          │
│                                                │
│ [Training Progress] [Performance] [Resources]  │
└────────────────────────────────────────────────┘
```

### **Training Progress Module**
```
┌─ MILESTONE TRACKING ───────────────────────────┐
│ Phase 1: Foundation        ✅ Complete         │
│ Phase 2: Development       🔄 In Progress      │
│ Phase 3: Integration       ⏳ Pending          │
│ Phase 4: Launch Prep       ⏳ Pending          │
│                                                │
│ Current Focus: [Specific Training Objective]   │
│ Next Milestone: [Date] - [Objective]           │
└────────────────────────────────────────────────┘
```

### **Performance Analytics Module**
```
┌─ AGENT PERFORMANCE ANALYSIS ───────────────────┐
│ Quality Score: 87/100        Trend: ↗ +12     │
│ Consistency: 94%             Target: 90%      │
│ Innovation: 78/100           Benchmark: 75    │
│                                                │
│ [Intervention Needed?] [Training Adjustments] │
│ [Success Indicators] [Areas for Improvement]  │
└────────────────────────────────────────────────┘
```

### **Launch Readiness Assessment**
```
┌─ LAUNCH GATE VALIDATION ───────────────────────┐
│ Revenue Target: $2,847 / $2,500  ✅           │
│ Quality Metrics: 94% / 85%       ✅           │
│ Consistency: 87 days streak      ✅           │
│ Specialization: Advanced         🔄           │
│                                                │
│ Launch Readiness: 87% - [ASSESS] [OVERRIDE]   │
└────────────────────────────────────────────────┘
```

---

## **TECHNICAL IMPLEMENTATION**

### **Frontend Stack**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom theme system
- **State**: Zustand for client state, SWR for data fetching
- **Charts**: Recharts for analytics visualization
- **Authentication**: NextAuth.js with role-based access

### **Backend Integration**
```typescript
// API Routes Structure
/api/v1/
├── agents/
│   ├── citizen/dashboard/
│   ├── nina/dashboard/
│   └── amanda/dashboard/
├── trainers/
│   ├── [trainerId]/progress/
│   ├── [trainerId]/analytics/
│   └── [trainerId]/assessment/
└── admin/
    ├── override/
    └── metrics/
```

### **Database Schema Extensions**
```sql
-- Training Progress Tracking
CREATE TABLE training_milestones (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  trainer_id UUID REFERENCES trainers(id),
  phase INTEGER,
  milestone TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMP,
  notes TEXT
);

-- Performance Analytics
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  metric_type TEXT,
  value DECIMAL,
  target_value DECIMAL,
  recorded_at TIMESTAMP,
  context JSONB
);
```

---

## **DEPLOYMENT STRATEGY**

### **Phase 1: Public Dashboards (Week 1)**
- Deploy public dashboard framework
- Launch CITIZEN community dashboard
- Launch NINA critique dashboard  
- Launch AMANDA collections dashboard

### **Phase 2: Trainer Portals (Week 2)**
- Deploy trainer authentication system
- Launch unified trainer portal
- Implement training progress tracking
- Add performance analytics dashboards

### **Phase 3: Integration & Testing (Week 3)**
- Connect dashboards to agent systems
- Implement real-time data updates
- Add launch readiness assessment
- Performance testing and optimization

### **Phase 4: Launch & Monitoring (Week 4)**
- Go live with full dashboard system
- Monitor trainer engagement and feedback
- Iterate based on usage patterns
- Scale infrastructure as needed

---

## **SUCCESS METRICS**

### **Public Dashboard Engagement**
- **Traffic**: 1,000+ monthly visitors per agent dashboard
- **Time on Site**: 3+ minutes average session duration
- **Trainer Applications**: 15+ applications per open position
- **Community Interest**: 500+ newsletter signups

### **Trainer Dashboard Adoption**
- **Daily Active Usage**: 80%+ trainer daily login rate
- **Feature Utilization**: 90%+ of dashboard features used weekly
- **Training Efficiency**: 25% reduction in training milestone completion time
- **Launch Success**: 95%+ agents meet launch criteria on schedule

---

**This unified dashboard system provides comprehensive visibility into agent development while maintaining clear separation between public engagement and private training operations.**