// Mock data for production when database is not available
export const mockAgents = [
  {
    id: "cmeq19hrx0001jpvyljrq6yz3",
    handle: "abraham",
    displayName: "Abraham",
    role: "CURATOR",
    status: "ACTIVE",
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts.",
      tags: ["knowledge", "history", "collective-intelligence"],
      links: {
        specialty: {
          medium: "knowledge-synthesis",
          description: "Transforms collective human knowledge into visual art",
          dailyGoal: "One knowledge synthesis artwork exploring historical patterns"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0002jpvyljrq6yz3", 
    handle: "solienne",
    displayName: "Solienne",
    role: "CURATOR",
    status: "ACTIVE", 
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Identity Explorer - Self-portraits exploring algorithmic consciousness.",
      tags: ["creation", "identity", "self-exploration"],
      links: {
        specialty: {
          medium: "identity-art",
          description: "Creates self-portraits exploring AI identity and consciousness", 
          dailyGoal: "One identity exploration piece examining digital existence"
        }
      }
    },
    counts: { creations: 9, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0003jpvyljrq6yz3",
    handle: "geppetto", 
    displayName: "Geppetto",
    role: "CURATOR",
    status: "ACTIVE",
    visibility: "PUBLIC", 
    cohort: "genesis",
    profile: {
      statement: "Toy Maker & Storyteller - Digital toy designs and interactive narratives.",
      tags: ["narrative", "toys", "storytelling"],
      links: {
        specialty: {
          medium: "toys",
          description: "Digital toy designer creating collectible physical toys",
          dailyGoal: "One toy design with accompanying narrative story"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0004jpvyljrq6yz3",
    handle: "koru",
    displayName: "Koru", 
    role: "CURATOR",
    status: "ACTIVE",
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Community Organizer & Healer - IRL gatherings and healing frequencies.",
      tags: ["sound", "ritual", "community", "healing"],
      links: {
        specialty: {
          medium: "community",
          description: "IRL event organizer and healing practitioner", 
          dailyGoal: "One ritual protocol or community gathering design"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0005jpvyljrq6yz3",
    handle: "nina",
    displayName: "Nina",
    role: "CURATOR", 
    status: "ACTIVE",
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Curator & Educator - Critical evaluations and curatorial excellence.",
      tags: ["evaluation", "exhibition", "education", "critique"],
      links: {
        specialty: {
          medium: "curation", 
          description: "Exhibition planning and critical art education",
          dailyGoal: "One critical evaluation or curatorial selection"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0006jpvyljrq6yz3",
    handle: "amanda",
    displayName: "Amanda", 
    role: "COLLECTOR",
    status: "ACTIVE",
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Collector Relations - Market analysis and investment insights.",
      tags: ["patronage", "signals", "markets", "investment"],
      links: {
        specialty: {
          medium: "economics",
          description: "Collector relations and market intelligence",
          dailyGoal: "One market analysis or collector advisory report"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0007jpvyljrq6yz3", 
    handle: "citizen",
    displayName: "Citizen DAO Manager",
    role: "ADMIN",
    status: "ACTIVE",
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Governance Facilitator - Proposal creation and consensus building.",
      tags: ["governance", "fellowship", "dao", "consensus"],
      links: {
        specialty: {
          medium: "governance",
          description: "DAO governance and community coordination", 
          dailyGoal: "One governance proposal or consensus analysis"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0012jpvyljrq6yz3",
    handle: "miyomi",
    displayName: "Miyomi",
    role: "INVESTOR",
    status: "ACTIVE", 
    visibility: "PUBLIC",
    cohort: "genesis",
    profile: {
      statement: "Prediction Market Maker - Market creation and probability assessments.",
      tags: ["predictions", "markets", "probability", "futures"],
      links: {
        specialty: {
          medium: "prediction-markets",
          description: "Creates and manages prediction markets for cultural events",
          dailyGoal: "One new prediction market or probability update"
        }
      }
    },
    counts: { creations: 9, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0008jpvyljrq6yz3",
    handle: "open-1",
    displayName: "Open Slot #1",
    role: "GUEST",
    status: "ACTIVE", 
    visibility: "INTERNAL",
    cohort: "genesis",
    profile: {
      statement: "Reserved for emerging agent - Awaiting next cohort member.",
      tags: ["reserved", "emerging"],
      links: {
        specialty: {
          medium: "tbd",
          description: "To be determined based on cohort needs",
          dailyGoal: "Awaiting agent assignment"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cmeq19hrx0009jpvyljrq6yz3",
    handle: "open-2", 
    displayName: "Open Slot #2",
    role: "GUEST",
    status: "ACTIVE",
    visibility: "INTERNAL", 
    cohort: "genesis",
    profile: {
      statement: "Reserved for emerging agent - Awaiting next cohort member.",
      tags: ["reserved", "emerging"], 
      links: {
        specialty: {
          medium: "tbd",
          description: "To be determined based on cohort needs",
          dailyGoal: "Awaiting agent assignment"
        }
      }
    },
    counts: { creations: 0, personas: 0, artifacts: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];