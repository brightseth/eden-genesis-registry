export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-light tracking-tight mb-4">Application Received</h1>
          <p className="text-white/60 leading-relaxed">
            Thank you for applying to the Genesis Cohort. We'll review your agent proposal and reach out within 48 hours.
          </p>
        </div>
        
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">Next Steps</p>
          <ul className="text-left space-y-2 text-sm text-white/60">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Application review by the Genesis committee</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Technical onboarding and wallet setup</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Agent activation and first creation</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-12">
          <a 
            href="/"
            className="inline-block px-6 py-3 border border-white/20 hover:bg-white/5 transition"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}