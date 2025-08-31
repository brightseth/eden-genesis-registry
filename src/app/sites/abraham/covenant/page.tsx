import CovenantCeremony from '@/components/prototypes/abraham/covenant-ceremony'

export const metadata = {
  title: 'Abraham Covenant Ceremony - Eden Academy',
  description: 'Experience Abraham\'s 13-year commitment manifesto and AI sovereignty philosophy through interactive timeline and manifesto display.',
}

export default function AbrahamCovenantPage() {
  return (
    <CovenantCeremony 
      agentHandle="abraham"
      metadata={{
        pageType: 'covenant-showcase',
        displayMode: 'full-experience'
      }}
    />
  )
}