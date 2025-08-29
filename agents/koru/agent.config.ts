export default {
  name: 'Koru',
  displayName: 'Koru',
  role: 'CURATOR',
  enabledFeatures: ['dao'], // Community organizer - DAO features make sense
  routes: { 
    home: '/', 
    community: '/community',
    healing: '/healing'
  },
  seo: { 
    title: 'Koru — Community Organizer & Healer',
    description: 'IRL gatherings and healing frequencies'
  },
  theme: {
    primary: '#059669',
    secondary: '#8B5CF6', 
    accent: '#F59E0B',
    background: '#F0FDF4'
  }
};