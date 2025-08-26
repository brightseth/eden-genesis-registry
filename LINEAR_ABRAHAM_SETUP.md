# Abraham Launch Tracker - Linear Setup Guide

## Quick Setup in Your Eden Linear Workspace

### Step 1: Create New Project
1. Go to your Eden Linear workspace
2. Create new project: "Abraham Token Launch"
3. Set project lead: Seth
4. Add team members: Henry, [others]

### Step 2: Create Milestones
Create these milestones with due dates:

- **M1: Architecture Complete** - Sep 1
- **M2: Testnet Live** - Sep 15  
- **M3: Mainnet Ready** - Sep 30
- **M4: Archive Sale Launch** - Oct 5
- **M5: Daily Covenant Begins** - Oct 19

### Step 3: Create Issues for This Week (Aug 26-30)

Copy and paste these into Linear:

#### For Henry (Smart Contracts):
```
Title: Choose blockchain (Ethereum L1 vs Base vs Arbitrum)
Assignee: Henry
Label: urgent, decision-needed
Milestone: M1: Architecture Complete
Due: Aug 28
Description: 
- Analyze gas costs for 2,500 NFT mints
- Consider long-term sustainability for 13-year covenant
- Document decision rationale
- Recommendation: Base for lower gas costs
```

```
Title: Set up smart contract dev environment
Assignee: Henry
Label: setup
Milestone: M1: Architecture Complete
Due: Aug 29
Description:
- Hardhat or Foundry setup
- Create abraham-contracts repo
- Basic project structure
- Share repo access with team
```

```
Title: Archive sale contract v1
Assignee: Henry
Label: smart-contract, critical-path
Milestone: M1: Architecture Complete
Due: Aug 30
Estimate: 3 days
Description:
- Fixed price 0.025 ETH
- Batch minting for gas optimization
- Purchase limits per wallet
- 70/30 revenue split automation
```

```
Title: Gas cost analysis for 2,500 mints
Assignee: Henry
Label: research, urgent
Milestone: M1: Architecture Complete
Due: Aug 30
Description:
- Calculate total gas for 2,500 mints
- Compare costs across chains
- Optimize batch size
- Target: <$50 per mint
```

#### For Seth (Product):
```
Title: Select 2,500 Abraham works from archive
Assignee: Seth
Label: content, critical-path
Milestone: M1: Architecture Complete
Due: Aug 30
Description:
- Review Abraham's 2019-2025 works
- Select highest quality pieces
- Ensure variety and progression
- Create metadata spreadsheet
Checklist:
- [ ] 500 works selected
- [ ] 1000 works selected
- [ ] 1500 works selected
- [ ] 2000 works selected
- [ ] 2500 works selected
```

```
Title: Define metadata schema for NFTs
Assignee: Seth
Label: product
Milestone: M1: Architecture Complete
Due: Aug 28
Description:
- Title, description, creation date
- Training epoch/phase
- Technical parameters
- IPFS storage plan
```

```
Title: Create collector engagement strategy
Assignee: Seth
Label: marketing
Milestone: M1: Architecture Complete
Due: Aug 30
Description:
- Identify target collectors
- Create allowlist signup form
- Plan outreach campaign
- Set purchase limit strategy
```

### Step 4: Create Cycles (Sprints)

**Cycle 1: Foundation (Aug 26 - Sep 1)**
- Add all Week 1 issues
- Daily standups at 10am UTC
- Mid-cycle check Wednesday

**Cycle 2: Build (Sep 2 - Sep 8)**
- Testnet deployment
- Marketing materials
- Security audit prep

**Cycle 3: Test (Sep 9 - Sep 15)**
- Load testing
- Audit submission
- Community outreach

**Cycle 4: Deploy (Sep 16 - Sep 22)**
- Mainnet preparation
- Final optimizations
- Launch materials

**Cycle 5: Launch Prep (Sep 23 - Sep 29)**
- Final testing
- Marketing push
- Team briefing

**Cycle 6: Archive Sale (Sep 30 - Oct 5)**
- Launch October 5
- Monitor and support
- Prepare daily auction

**Cycle 7: Daily Covenant (Oct 14 - Oct 19)**
- Launch October 19
- Abraham goes autonomous
- Celebrate! 🎉

### Step 5: Set Up Automations

In Linear settings, configure:

1. **Auto-assign to cycle** - New issues go to current cycle
2. **Slack notifications** - Daily at 10am for standup
3. **Blocked status alerts** - Immediate notification
4. **Due date reminders** - 24 hours before
5. **Stale issue warnings** - No update in 3 days

### Step 6: Create Views

Set up these filtered views:

1. **"Henry's Sprint"** - Assignee: Henry, Cycle: Current
2. **"This Week Critical"** - Label: critical-path, Due: This week
3. **"Blockers"** - Status: Blocked
4. **"Launch Countdown"** - Milestone: M4 or M5, sorted by due date

### Step 7: Labels to Create

- `critical-path` (red) - Blocks launch if not done
- `smart-contract` (blue) - Contract development
- `urgent` (orange) - Needs immediate action
- `decision-needed` (purple) - Requires team decision
- `audit` (green) - Security audit related
- `marketing` (yellow) - Collector engagement
- `blocked` (red) - Has dependencies

### Step 8: Daily Standup Template

Create Linear doc: "Abraham Daily Standup"

```markdown
## Date: [TODAY]

### 🔴 Blockers
- 

### 🟡 At Risk
-

### 🟢 Completed Yesterday
-

### 📅 Today's Focus
-

### 💬 Decisions Needed
-
```

### Step 9: Accountability Rules

Post in team channel:

```
ABRAHAM LAUNCH ACCOUNTABILITY RULES:

1. Daily updates required by 10am UTC
2. Issues not updated in 48h = assumed blocked
3. Missing sprint commitment = public explanation
4. Blockers escalated within 2 hours
5. Green/yellow/red status updated daily

Henry owns: Smart contracts
Seth owns: Product/content
[Name] owns: Design
[Name] owns: Platform integration

40 days to Archive Sale. No excuses.
```

### Step 10: Share & Launch

1. Share this setup with Henry
2. Get him to accept first 4 issues
3. Set up Monday kickoff call
4. Start daily standups tomorrow
5. Make tracker public for stakeholder visibility

---

## Linear Shortcuts for Abraham Launch

- `Cmd+K` → "Abraham" - Jump to project
- `G then M` - Go to milestones
- `C` - Create new issue  
- `Q` - Quick add to cycle
- `/` - Search everything

## Success Metrics in Linear

- Cycle completion rate >80%
- No issue older than 5 days
- Zero blocked items >24 hours
- Daily standup participation 100%

---

Ready to copy/paste into Linear! Each issue is formatted for quick entry.