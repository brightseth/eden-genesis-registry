#!/usr/bin/env node

/**
 * Create Abraham Launch Issues in Linear
 * 
 * Setup:
 * 1. npm install @linear/sdk
 * 2. Get your API key from Linear: Settings → API → Personal API keys
 * 3. Run: LINEAR_API_KEY=your_key_here node create-abraham-linear-issues.js
 */

const { LinearClient } = require("@linear/sdk");

// Get API key from environment variable
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error("❌ Please set LINEAR_API_KEY environment variable");
  console.error("Run: LINEAR_API_KEY=your_key_here node create-abraham-linear-issues.js");
  process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

// Issue definitions
const ISSUES = [
  {
    title: "Choose blockchain (Ethereum L1 vs Base vs Arbitrum)",
    description: `**Decision Required by Aug 28**

Analyze and decide on the blockchain for Abraham's token launch.

## Requirements
- Calculate gas costs for 2,500 NFT mints on each chain
- Consider long-term sustainability for 13-year covenant (4,056 daily mints)
- Evaluate ecosystem support and tooling
- Document decision rationale

## Analysis Points
- [ ] Total gas cost for archive sale (2,500 mints)
- [ ] Daily auction gas costs projection
- [ ] Chain reliability and uptime history
- [ ] Developer tooling and support
- [ ] Bridge/liquidity considerations

## Recommendation
Initial suggestion: Base (Coinbase L2) for lower gas costs while maintaining security

## Deliverable
Decision document with rationale posted to team`,
    assigneeEmail: "henry@eden.art", // Update with actual email
    priority: 1, // Urgent
    estimate: 1,
    labels: ["urgent", "decision-needed", "smart-contract"],
    dueDate: "2025-08-28"
  },
  {
    title: "Set up smart contract dev environment",
    description: `**Setup Required by Aug 29**

Initialize the development environment for Abraham smart contracts.

## Tasks
- [ ] Choose framework (Hardhat vs Foundry)
- [ ] Create abraham-contracts repository
- [ ] Set up basic project structure
- [ ] Configure testing framework
- [ ] Add deployment scripts skeleton
- [ ] Share repo access with team

## Project Structure
\`\`\`
abraham-contracts/
├── contracts/
│   ├── ArchiveSale.sol
│   ├── DailyAuction.sol
│   └── AbrahamToken.sol
├── test/
├── scripts/
└── deployments/
\`\`\`

## Deliverable
Working repo with initial setup pushed to GitHub`,
    assigneeEmail: "henry@eden.art",
    priority: 2,
    estimate: 1,
    labels: ["setup", "smart-contract"],
    dueDate: "2025-08-29"
  },
  {
    title: "Archive sale contract v1",
    description: `**Critical Path - Due Aug 30**

Build the fixed-price sale contract for Abraham's 2,500 archive works.

## Core Requirements
- Fixed price: 0.025 ETH per NFT
- Batch minting capability for gas optimization
- Purchase limits (e.g., 10 per wallet in first 24h)
- Revenue split: 70% Creator, 30% Eden Treasury
- ERC-721 standard with on-chain metadata pointer

## Technical Specifications
\`\`\`solidity
contract AbrahamArchiveSale {
    uint256 constant PRICE = 0.025 ether;
    uint256 constant MAX_SUPPLY = 2500;
    uint256 constant PURCHASE_LIMIT = 10;
    
    // Revenue split
    address creator = 0x... // 70%
    address treasury = 0x... // 30%
}
\`\`\`

## Security Considerations
- [ ] Reentrancy protection
- [ ] Integer overflow checks
- [ ] Access controls
- [ ] Emergency pause mechanism

## Gas Optimization
- [ ] Batch minting functions
- [ ] Efficient storage patterns
- [ ] Minimal external calls

## Deliverable
Tested contract deployed to testnet with documentation`,
    assigneeEmail: "henry@eden.art",
    priority: 1,
    estimate: 3,
    labels: ["smart-contract", "critical-path"],
    dueDate: "2025-08-30"
  },
  {
    title: "Gas cost analysis for 2,500 mints",
    description: `**Analysis Due Aug 30**

Comprehensive gas cost analysis for the Abraham archive sale.

## Calculations Required

### Per-Chain Analysis
Calculate for each chain (Ethereum, Base, Arbitrum):
- Single mint gas cost
- Batch mint (10 NFTs) gas cost  
- Batch mint (100 NFTs) gas cost
- Total cost for 2,500 mints
- Cost per mint in USD at current prices

### Optimization Strategies
- [ ] Merkle tree for allowlist vs on-chain storage
- [ ] Metadata storage (on-chain vs IPFS pointer)
- [ ] Batch size optimization curve
- [ ] Lazy minting feasibility

## Target Metrics
- Maximum acceptable: $50 per mint
- Target: <$25 per mint
- Ideal: <$10 per mint

## Deliverable
Spreadsheet with full analysis and recommendations`,
    assigneeEmail: "henry@eden.art",
    priority: 2,
    estimate: 2,
    labels: ["research", "urgent", "smart-contract"],
    dueDate: "2025-08-30"
  },
  {
    title: "Select 2,500 Abraham works from archive",
    description: `**Content Curation - Due Aug 30**

Select and prepare 2,500 works from Abraham's training period (2019-2025).

## Selection Criteria
- Quality: Highest artistic merit
- Variety: Different styles, epochs, techniques
- Progression: Show evolution over time
- Significance: Historical or technical importance

## Tasks
- [ ] Review full archive (estimate: 10,000+ works)
- [ ] Create selection criteria rubric
- [ ] First pass: Select 5,000 candidates
- [ ] Second pass: Narrow to 3,000
- [ ] Final curation: 2,500 works
- [ ] Quality check all selections

## Metadata Required
For each work:
- Title
- Creation date
- Training epoch/phase
- Technical parameters
- Description (max 280 chars)
- Tags/categories

## Organization
\`\`\`
/archive-sale/
├── selected/ (2,500 final works)
├── alternates/ (500 backup works)
├── metadata.csv
└── ipfs-hashes.json
\`\`\`

## Deliverable
2,500 works with complete metadata in structured format`,
    assigneeEmail: "seth@eden.art", // Update with actual email
    priority: 1,
    estimate: 3,
    labels: ["content", "critical-path"],
    dueDate: "2025-08-30"
  },
  {
    title: "Define metadata schema for NFTs",
    description: `**Schema Definition - Due Aug 28**

Create the metadata standard for Abraham's NFTs (both archive and daily).

## OpenSea Metadata Standard
\`\`\`json
{
  "name": "Abraham #0001 - Knowledge Synthesis",
  "description": "Created during early training phase...",
  "image": "ipfs://...",
  "attributes": [
    {
      "trait_type": "Epoch",
      "value": "Training Phase 1"
    },
    {
      "trait_type": "Creation Date",
      "display_type": "date",
      "value": 1609459200
    },
    {
      "trait_type": "Technique",
      "value": "Knowledge Synthesis"
    }
  ]
}
\`\`\`

## Required Fields
- [ ] Core fields (name, description, image)
- [ ] Training epoch/phase taxonomy
- [ ] Technical parameters
- [ ] Rarity indicators
- [ ] Providence/history

## Storage Strategy
- [ ] IPFS for images
- [ ] Arweave backup consideration
- [ ] Metadata hosting (centralized vs IPFS)
- [ ] Update mechanism for reveals

## Deliverable
Complete schema documentation with examples`,
    assigneeEmail: "seth@eden.art",
    priority: 2,
    estimate: 1,
    labels: ["product"],
    dueDate: "2025-08-28"
  },
  {
    title: "Create collector engagement strategy",
    description: `**Marketing Strategy - Due Aug 30**

Develop the collector acquisition and engagement plan for Abraham's launch.

## Target Segments
1. **AI Art Collectors** - Previous buyers of AI-generated art
2. **Long-term Investors** - Understand 13-year value proposition
3. **Eden Community** - Existing ecosystem members
4. **Institution/Galleries** - Looking for historical significance

## Engagement Tactics
- [ ] Create allowlist signup form
- [ ] Design early access benefits
- [ ] Plan Discord/Twitter campaigns
- [ ] Identify and reach out to 50 key collectors
- [ ] Create educational content about Abraham
- [ ] Design referral incentives

## Key Messages
- "Own Abraham's genesis before the 13-year journey"
- "2,500 works from 6 years of training"
- "Fixed price before daily auctions begin"
- "The first truly autonomous AI artist"

## Timeline
- Sept 1: Allowlist opens
- Sept 15: Early bird snapshot
- Oct 1: Final push
- Oct 5: Launch day

## Success Metrics
- 500+ allowlist signups
- 200+ unique buyers
- 25 ETH revenue minimum

## Deliverable
Engagement strategy doc with tactical calendar`,
    assigneeEmail: "seth@eden.art",
    priority: 2,
    estimate: 2,
    labels: ["marketing"],
    dueDate: "2025-08-30"
  }
];

async function createAbrahamIssues() {
  try {
    console.log("🔄 Connecting to Linear...");
    
    // Get the viewer (you) to find the team
    const viewer = await client.viewer;
    const teams = await viewer.teams();
    
    if (teams.nodes.length === 0) {
      console.error("❌ No teams found. Check your API key permissions.");
      return;
    }
    
    // Show available teams
    console.log("\n📋 Available teams:");
    teams.nodes.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.key})`);
    });
    
    // Use first team or Eden team if found
    const team = teams.nodes.find(t => 
      t.name.toLowerCase().includes('eden') || 
      t.name.toLowerCase().includes('abraham')
    ) || teams.nodes[0];
    
    console.log(`\n✅ Using team: ${team.name}`);
    
    // Get users for assignment
    const users = await client.users();
    const userMap = {};
    users.nodes.forEach(user => {
      userMap[user.email] = user.id;
      // Also map common names
      if (user.name?.toLowerCase().includes('henry')) userMap['henry'] = user.id;
      if (user.name?.toLowerCase().includes('seth')) userMap['seth'] = user.id;
    });
    
    console.log(`\n👥 Found ${users.nodes.length} users`);
    
    // Get or create labels
    console.log("\n🏷️  Setting up labels...");
    const labelMap = {};
    const neededLabels = ["urgent", "decision-needed", "smart-contract", "critical-path", 
                          "setup", "research", "content", "product", "marketing"];
    
    for (const labelName of neededLabels) {
      try {
        // Try to create label (will fail if exists, that's ok)
        const label = await client.createIssueLabel({
          teamId: team.id,
          name: labelName,
          color: getLabelColor(labelName)
        });
        labelMap[labelName] = label.issueLabel?.id;
      } catch (e) {
        // Label might already exist, try to find it
        const labels = await team.labels();
        const existing = labels.nodes.find(l => l.name === labelName);
        if (existing) labelMap[labelName] = existing.id;
      }
    }
    
    // Create project for Abraham Launch
    console.log("\n📁 Creating Abraham Launch project...");
    let project;
    try {
      const projectResult = await client.createProject({
        teamId: team.id,
        name: "Abraham Token Launch",
        description: "October 5 Archive Sale | October 19 Daily Covenant",
        color: "#FF6B6B"
      });
      project = projectResult.project;
    } catch (e) {
      console.log("Project might already exist, continuing...");
    }
    
    // Create milestones
    console.log("\n🎯 Creating milestones...");
    const milestones = [
      { name: "M1: Architecture Complete", targetDate: "2025-09-01" },
      { name: "M2: Testnet Live", targetDate: "2025-09-15" },
      { name: "M3: Mainnet Ready", targetDate: "2025-09-30" },
      { name: "M4: Archive Sale Launch", targetDate: "2025-10-05" },
      { name: "M5: Daily Covenant Begins", targetDate: "2025-10-19" }
    ];
    
    const milestoneMap = {};
    for (const ms of milestones) {
      try {
        const result = await client.createProjectMilestone({
          projectId: project?.id,
          name: ms.name,
          targetDate: ms.targetDate
        });
        milestoneMap[ms.name] = result.projectMilestone?.id;
      } catch (e) {
        console.log(`Milestone ${ms.name} might already exist`);
      }
    }
    
    // Create issues
    console.log("\n📝 Creating issues...\n");
    let created = 0;
    let failed = 0;
    
    for (const issue of ISSUES) {
      try {
        // Map emails to user IDs
        const assigneeId = userMap[issue.assigneeEmail] || 
                          userMap[issue.assigneeEmail.split('@')[0]] ||
                          null;
        
        // Map label names to IDs
        const labelIds = issue.labels
          .map(l => labelMap[l])
          .filter(Boolean);
        
        const issueData = {
          teamId: team.id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          estimate: issue.estimate,
          dueDate: issue.dueDate
        };
        
        if (assigneeId) issueData.assigneeId = assigneeId;
        if (labelIds.length > 0) issueData.labelIds = labelIds;
        if (project?.id) issueData.projectId = project.id;
        
        const result = await client.createIssue(issueData);
        console.log(`✅ Created: ${issue.title}`);
        created++;
      } catch (error) {
        console.error(`❌ Failed: ${issue.title}`);
        console.error(`   Error: ${error.message}`);
        failed++;
      }
    }
    
    console.log("\n📊 Summary:");
    console.log(`✅ Successfully created: ${created} issues`);
    if (failed > 0) console.log(`❌ Failed: ${failed} issues`);
    console.log("\n🎉 Abraham Launch tracker is ready in Linear!");
    console.log("📱 Open Linear and search for 'Abraham' to see all issues");
    
  } catch (error) {
    console.error("❌ Error:", error);
    console.error("\nTroubleshooting:");
    console.error("1. Check your API key has full access");
    console.error("2. Make sure you're a member of the team");
    console.error("3. Try regenerating your API key");
  }
}

function getLabelColor(labelName) {
  const colors = {
    'urgent': '#F87171',        // red
    'decision-needed': '#A78BFA', // purple
    'smart-contract': '#60A5FA',  // blue
    'critical-path': '#FB7185',   // pink
    'setup': '#4ADE80',           // green
    'research': '#FACC15',        // yellow
    'content': '#FB923C',         // orange
    'product': '#2DD4BF',         // teal
    'marketing': '#FDE047'        // bright yellow
  };
  return colors[labelName] || '#9CA3AF'; // default gray
}

// Run the script
createAbrahamIssues();