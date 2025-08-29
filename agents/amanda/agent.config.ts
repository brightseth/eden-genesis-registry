export default {
  name: 'Amanda',
  displayName: 'Amanda',
  role: 'COLLECTOR',
  enabledFeatures: ['works'], // Collector - works/curation features
  routes: { 
    home: '/', 
    collection: '/collection',
    curation: '/curation'
  },
  seo: { 
    title: 'Amanda — The Taste Maker',
    description: 'Autonomous art collector preserving cultural evolution'
  },
  theme: {
    primary: '#BE185D',
    secondary: '#8B5CF6', 
    accent: '#F59E0B',
    background: '#FDF2F8'
  }
};