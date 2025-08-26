// Linear API Script to Create Abraham Launch Issues
// Get your Linear API key from: Settings → API → Personal API keys

const LINEAR_API_KEY = 'YOUR_LINEAR_API_KEY_HERE'; // Replace this!
const TEAM_ID = 'YOUR_TEAM_ID'; // Find in Linear URL when viewing team

const issues = [
  {
    title: "Choose blockchain (Ethereum L1 vs Base vs Arbitrum)",
    description: "Analyze gas costs for 2500 NFT mints. Consider long-term sustainability for 13-year covenant. Document decision rationale. Recommendation: Base for lower gas costs",
    assignee: "Henry",
    labels: ["urgent", "decision-needed"],
    dueDate: "2024-08-28",
    estimate: 1
  },
  {
    title: "Set up smart contract dev environment",
    description: "Hardhat or Foundry setup. Create abraham-contracts repo. Basic project structure. Share repo access with team",
    assignee: "Henry", 
    labels: ["setup"],
    dueDate: "2024-08-29",
    estimate: 1
  },
  {
    title: "Archive sale contract v1",
    description: "Fixed price 0.025 ETH. Batch minting for gas optimization. Purchase limits per wallet. 70/30 revenue split automation",
    assignee: "Henry",
    labels: ["smart-contract", "critical-path"],
    dueDate: "2024-08-30",
    estimate: 3
  },
  {
    title: "Gas cost analysis for 2500 mints",
    description: "Calculate total gas for 2500 mints. Compare costs across chains. Optimize batch size. Target: <$50 per mint",
    assignee: "Henry",
    labels: ["research", "urgent"],
    dueDate: "2024-08-30",
    estimate: 2
  },
  {
    title: "Select 2500 Abraham works from archive",
    description: "Review Abraham's 2019-2025 works. Select highest quality pieces. Ensure variety and progression. Create metadata spreadsheet",
    assignee: "Seth",
    labels: ["content", "critical-path"],
    dueDate: "2024-08-30",
    estimate: 3
  },
  {
    title: "Define metadata schema for NFTs",
    description: "Title description creation date. Training epoch/phase. Technical parameters. IPFS storage plan",
    assignee: "Seth",
    labels: ["product"],
    dueDate: "2024-08-28",
    estimate: 1
  },
  {
    title: "Create collector engagement strategy",
    description: "Identify target collectors. Create allowlist signup form. Plan outreach campaign. Set purchase limit strategy",
    assignee: "Seth",
    labels: ["marketing"],
    dueDate: "2024-08-30",
    estimate: 2
  }
];

// To run this script:
// 1. npm install @linear/sdk
// 2. Replace API key and team ID above
// 3. node linear-import.js

async function createIssues() {
  const { LinearClient } = require("@linear/sdk");
  const linear = new LinearClient({ apiKey: LINEAR_API_KEY });
  
  for (const issue of issues) {
    try {
      await linear.issueCreate({
        teamId: TEAM_ID,
        title: issue.title,
        description: issue.description,
        // assigneeId: would need to look up user IDs
        // labelIds: would need to look up label IDs
        dueDate: issue.dueDate,
        estimate: issue.estimate
      });
      console.log(`Created: ${issue.title}`);
    } catch (error) {
      console.error(`Failed to create: ${issue.title}`, error);
    }
  }
}

// Uncomment to run:
// createIssues();