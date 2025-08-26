# Smart Contract Architecture Sync - Henry & Claude Code

**Date**: August 25, 2025  
**Priority**: CRITICAL - Abraham launches October 19 (56 days)

## Current State Assessment

✅ **Registry Infrastructure**: Complete API, agent tracking, creation schemas  
❌ **Smart Contracts**: No contract code found in codebase  
❌ **Token Infrastructure**: No token contracts or deployment scripts  
❌ **Auction System**: No daily auction mechanism  
⚠️ **Ethereum Integration**: Basic schema exists but no implementation

## Critical Path: Abraham October 19 Launch

### Required Smart Contracts (In Order of Priority)

#### 1. **Abraham Daily Auction Contract** - DUE: September 30
```solidity
// Core requirements:
- 4,056 consecutive daily auctions (13 years)
- 0.01 ETH starting price, 24-hour duration
- Automatic settlement & NFT minting
- Treasury accumulation for unclaimed works
- Emergency pause/recovery mechanisms
- Gas optimization for 13-year reliability
```

#### 2. **Revenue Splitter Contract** - DUE: October 1
```solidity
// Core requirements:
- Receive all agent sale revenue
- Split 25% to Creator, Agent Treasury, Eden Platform, $SPIRIT holders
- USDC conversion handling
- Batch processing for gas efficiency
- Multi-sig treasury management
```

#### 3. **$ABRAHAM Token Contract** - DUE: October 5
```solidity
// Core requirements:
- ERC-20 with 1,000,000,000 supply
- 25% allocations: Creator, Agent, Eden, $SPIRIT holders
- Vesting schedules (24-month lock except trainer)
- Uniswap V3 pool initialization
- Whale prevention (max 10% holdings)
```

#### 4. **Abraham Archive Sale** - DUE: September 15
```solidity
// Core requirements:
- Batch mint 2,000+ historical works
- Pricing mechanism (Dutch auction or fixed)
- Gas-optimized bulk operations
- Pre-launch revenue generation
```

## Technical Architecture Questions for Henry

### **Deployment Strategy**
1. **Which chain?**
   - Ethereum L1 (maximum security, higher gas)
   - Base (Coinbase L2, lower gas, good UX) 
   - Arbitrum (established L2, DeFi ecosystem)

2. **Contract upgradeability?**
   - Proxy pattern for 13-year maintenance
   - Immutable contracts with emergency escape hatches
   - Hybrid approach (critical functions immutable)

3. **Gas optimization strategy?**
   - How to handle 4,056 daily mints cost-effectively
   - Batch operations for revenue distributions
   - L2 deployment considerations

### **Revenue Distribution Architecture**
1. **Distribution frequency?**
   - Real-time (high gas, immediate satisfaction)
   - Daily batching (balanced approach)
   - Weekly batching (most gas efficient)

2. **Token conversion?**
   - Auto-convert ETH to USDC for distributions
   - Keep native ETH for simplicity
   - Hybrid approach with user preference

3. **Whale prevention mechanisms?**
   - Hard caps on holdings percentage
   - Transfer restrictions/delays
   - Economic incentives for distribution

### **Auction Mechanism Design**
1. **Platform choice?**
   - Custom auction contracts (full control)
   - Zora protocol integration (proven infrastructure)
   - Manifold platform (creator-friendly tools)

2. **Failure scenarios?**
   - What if auction contract fails after 2 years?
   - Automatic fallback mechanisms needed
   - Manual intervention protocols

3. **Metadata handling?**
   - On-chain vs IPFS storage
   - Provenance tracking requirements
   - Abraham's creative autonomy constraints

### **Token Launch Mechanics**
1. **Liquidity provision?**
   - Who provides initial Uniswap liquidity?
   - Price discovery mechanism at launch
   - Market making considerations

2. **Vesting implementation?**
   - Time-based linear vesting
   - Milestone-based unlocking
   - Revenue-performance triggers

3. **Cross-agent compatibility?**
   - Shared infrastructure for all 10 agents
   - Agent-specific customizations needed
   - Scaling considerations for Q1 2026

## Integration Points with Existing System

### **Registry → Smart Contract Flow**
```typescript
// Current schema shows ethereum publishing:
publishedTo: {
  ethereum: {
    txHash: string,
    contractAddress: string, 
    tokenId: string
  }
}
```

**Questions:**
- How does agent creation trigger contract deployment?
- What's the registry's role in tracking contract addresses?
- How do we handle contract verification and validation?

### **Agent Autonomy Requirements**
- Abraham needs to create/price/sell without human intervention
- API integration between agent AI and smart contracts
- Automated metadata generation and IPFS uploads
- Treasury management automation

## Immediate Next Steps for Henry

### **Week 1 (Aug 25-31)**
- [ ] Choose deployment chain and justify decision
- [ ] Create basic auction contract prototype
- [ ] Test gas costs for daily minting scenarios
- [ ] Set up development environment (Hardhat/Foundry)

### **Week 2 (Sep 1-7)**  
- [ ] Implement revenue splitter logic
- [ ] Create token contract templates
- [ ] Begin security audit preparation
- [ ] Deploy to testnet for initial testing

### **Week 3 (Sep 8-14)**
- [ ] Complete Abraham archive sale contract
- [ ] Integrate with registry API endpoints
- [ ] Load testing for auction mechanisms
- [ ] Documentation for contract interactions

### **Week 4 (Sep 15-21)**
- [ ] Security audit submission
- [ ] Abraham archive sale goes live
- [ ] Daily auction contract final testing
- [ ] Mainnet deployment preparation

## Critical Dependencies

### **External Dependencies**
- Security audit firm selection and scheduling
- Uniswap V3 pool creation tooling
- IPFS/Arweave storage infrastructure
- Oracle pricing feeds (ETH/USD)

### **Internal Dependencies**
- Abraham AI agent integration APIs
- Registry webhook systems for contract events
- Frontend UI for collector interactions
- Monitoring/alerting infrastructure

## Risk Assessment

### **High Risk**
- 13-year contract reliability (single point of failure)
- Gas cost evolution making operations uneconomical  
- Regulatory compliance for token securities
- Abraham AI system integration complexity

### **Medium Risk**
- Chain congestion affecting auction timing
- Smart contract bugs discovered post-launch
- Market volatility affecting collector demand
- Competition from other AI art projects

### **Low Risk**
- Technical integration with existing registry
- IPFS storage reliability
- Basic ERC-20 token functionality
- Revenue distribution mathematics

## Success Metrics

### **Pre-Launch (September)**
- [ ] All contracts deployed and audited
- [ ] Abraham archive sale generates >$50K
- [ ] Gas costs <2% of transaction value
- [ ] Zero failed auctions in testnet

### **Launch Week (October 19-26)**
- [ ] Daily auctions execute flawlessly
- [ ] Revenue distributions work correctly
- [ ] $ABRAHAM token launches with >$100K liquidity
- [ ] No critical bugs discovered

### **30-Day Post-Launch**
- [ ] 30 consecutive successful auctions
- [ ] >100 unique collectors participating
- [ ] <1% transaction failure rate
- [ ] Token price stability (no >50% daily swings)

## Questions for Henry

1. **Immediate**: What's your current smart contract stack/preferences?
2. **Architecture**: Any existing contract templates or frameworks you prefer?
3. **Timeline**: Can you commit to the September 30 deadline for auction contracts?
4. **Resources**: Do you need additional development resources?
5. **Integration**: How familiar are you with the existing registry codebase?

---

**Next Steps:**
1. Henry reviews this document and provides feedback
2. Schedule technical sync call to clarify architecture decisions  
3. Create shared repository for smart contract development
4. Begin sprint planning for critical path items

*This document should be updated as Henry provides input and decisions are made.*