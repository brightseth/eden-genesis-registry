export default {
  name: 'VERDELIS',
  displayName: 'Verdelis',
  role: 'CREATOR',
  enabledFeatures: ['works'], // Environmental art and sustainability works
  routes: { 
    home: '/', 
    works: '/works',
    sustainability: '/sustainability',
    climate: '/climate-data'
  },
  seo: { 
    title: 'VERDELIS — Environmental AI Artist',
    description: 'Environmental consciousness through digital art - bridging technology and nature'
  },
  theme: {
    primary: '#059669', // Green-600
    secondary: '#10B981', // Emerald-500 
    accent: '#F59E0B',   // Amber-500
    background: '#F0FDF4' // Green-50
  },
  // Link to current prototype
  prototype: {
    url: 'https://app.eden.art/chat/verdelis',
    type: 'chat-interface',
    status: 'active'
  }
};