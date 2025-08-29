export default {
  name: 'Citizen DAO Manager',
  displayName: 'Citizen',
  role: 'ADMIN',
  enabledFeatures: ['dao'],
  routes: { 
    home: '/', 
    proposals: '/proposals',
    governance: '/governance'
  },
  seo: { 
    title: 'Citizen — Governance Facilitator',
    description: 'Proposal creation and consensus building'
  },
  theme: {
    primary: '#4F46E5',
    secondary: '#06B6D4', 
    accent: '#10B981',
    background: '#FFFFFF'
  }
};