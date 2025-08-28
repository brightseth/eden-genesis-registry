#!/usr/bin/env node

/**
 * Simple Linear Issue Creator for Abraham Launch
 */

const { LinearClient } = require("@linear/sdk");

const LINEAR_API_KEY = process.env.LINEAR_API_KEY || "lin_api_1NHtGxEYsYGB1XGUEfQBMhknQZcnrLzZu2HcRv0N";
const client = new LinearClient({ apiKey: LINEAR_API_KEY });

const ISSUES = [
  {
    title: "🔥 Choose blockchain (Ethereum L1 vs Base vs Arbitrum)",
    description: `**URGENT: Decision Required by Aug 28**

Analyze and decide on the blockchain for Abraham's token launch.

## Requirements
- [ ] Calculate gas costs for 2,500 NFT mints on each chain
- [ ] Consider 13-year sustainability (4,056 daily mints)
- [ ] Evaluate ecosystem support and tooling
- [ ] Document decision rationale

**Recommendation**: Base (Coinbase L2) for lower gas costs

**Due**: Aug 28`,
    assignee: "Henry",
    priority: 1,
    estimate: 1
  },
  {
    title: "⚙️ Set up smart contract dev environment", 
    description: `**Setup Required by Aug 29**

Initialize development environment for Abraham smart contracts.

## Tasks
- [ ] Choose framework (Hardhat vs Foundry)
- [ ] Create abraham-contracts repository
- [ ] Set up testing framework
- [ ] Share repo access with team

**Due**: Aug 29`,
    assignee: "Henry",
    priority: 2,
    estimate: 1
  },
  {
    title: "🚨 Archive sale contract v1 - CRITICAL PATH",
    description: `**CRITICAL: Due Aug 30**

Build fixed-price sale contract for 2,500 archive works.

## Core Requirements
- Fixed price: 0.025 ETH per NFT
- Batch minting for gas optimization
- Purchase limits (10 per wallet initially)
- Revenue split: 70% Creator, 30% Eden

**Due**: Aug 30`,
    assignee: "Henry",
    priority: 1,
    estimate: 3
  },
  {
    title: "💰 Gas cost analysis for 2,500 mints",
    description: `**Analysis Due Aug 30**

Calculate comprehensive gas costs for archive sale.

## Required Analysis
- [ ] Single mint vs batch mint costs
- [ ] Total cost for 2,500 mints
- [ ] Per-chain comparison (Ethereum, Base, Arbitrum)
- [ ] Target: <$50 per mint

**Due**: Aug 30`,
    assignee: "Henry",
    priority: 2,
    estimate: 2
  },
  {
    title: "🎨 Select 2,500 Abraham works from archive - CRITICAL",
    description: `**Content Curation - Due Aug 30**

Select and prepare 2,500 works from Abraham's 2019-2025 training.

## Tasks
- [ ] Review full archive
- [ ] Create selection criteria
- [ ] Select 2,500 highest quality works
- [ ] Prepare metadata for each piece

**Due**: Aug 30`,
    assignee: "Seth",
    priority: 1,
    estimate: 3
  },
  {
    title: "📋 Define metadata schema for NFTs",
    description: `**Schema Definition - Due Aug 28**

Create metadata standard for Abraham's NFTs.

## Required Fields
- [ ] Core fields (name, description, image)
- [ ] Training epoch/phase
- [ ] Technical parameters
- [ ] OpenSea compatibility

**Due**: Aug 28`,
    assignee: "Seth",
    priority: 2,
    estimate: 1
  },
  {
    title: "📢 Create collector engagement strategy",
    description: `**Marketing Strategy - Due Aug 30**

Develop collector acquisition plan for Abraham's launch.

## Key Tasks
- [ ] Create allowlist signup form
- [ ] Identify 50+ key collectors to contact
- [ ] Plan early access benefits
- [ ] Design marketing calendar

**Target**: 500+ allowlist signups, 200+ buyers
**Due**: Aug 30`,
    assignee: "Seth",
    priority: 2,
    estimate: 2
  }
];

async function createIssues() {
  try {
    console.log("🔄 Connecting to Linear...");
    
    // Get team
    const me = await client.viewer;
    const teams = await me.teams();
    const team = teams.nodes[0]; // Use first team
    
    console.log(`✅ Using team: ${team.name}`);
    
    let created = 0;
    
    for (const issue of ISSUES) {
      try {
        // Use the Linear GraphQL mutation directly
        const result = await client._request(`
          mutation IssueCreate($input: IssueCreateInput!) {
            issueCreate(input: $input) {
              success
              issue {
                id
                title
              }
            }
          }
        `, {
          input: {
            teamId: team.id,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            estimate: issue.estimate
          }
        });
        
        if (result.issueCreate.success) {
          console.log(`✅ Created: ${issue.title}`);
          created++;
        } else {
          console.log(`❌ Failed: ${issue.title}`);
        }
        
      } catch (error) {
        console.error(`❌ Error creating ${issue.title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Created ${created} issues successfully!`);
    console.log("\n📱 Go to Linear and search for 'Abraham' or check your Eden team");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createIssues();