import Link from 'next/link'
import AboutSection from '@/components/AboutSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <div className="bg-navy-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Scholarship Navigator
          </h1>
          <p className="text-lg md:text-xl text-navy-100 max-w-2xl mx-auto leading-relaxed">
            A thinking partner for academics exploring scholarly identity and the rigour of conceptual architecture.
          </p>
        </div>
      </div>

      {/* Entry points */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Chat */}
          <Link
            href="/chat"
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all border border-gray-100 hover:border-navy-200"
          >
            <div className="w-12 h-12 bg-navy-600/10 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-navy-600 transition-colors">
              Start a Conversation
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Chat with your AI thinking partner. Choose between <strong>Scholarly Reflection</strong> on your identity and direction, or <strong>Conceptual Compass</strong> for auditing your concepts and contribution.
            </p>
          </Link>

          {/* Scholarly Identity Assessment */}
          <Link
            href="/assess/scholarly-identity"
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all border border-gray-100 hover:border-navy-200"
          >
            <div className="w-12 h-12 bg-navy-600/10 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-navy-600 transition-colors">
              Scholarly Identity
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Map yourself across four styles of scholarship — Theoretical, Integrative, Craft, and Clinical.
            </p>
            <span className="inline-block mt-3 text-xs text-gray-400">8 scenarios &middot; 4-6 min</span>
          </Link>

          {/* Conceptual Contribution Assessment */}
          <Link
            href="/assess/conceptual-contribution"
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all border border-gray-100 hover:border-navy-200"
          >
            <div className="w-12 h-12 bg-navy-600/10 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-navy-600 transition-colors">
              Conceptual Contribution
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Map your approach across four contribution spaces — Refining, Extending, Enriching, and Broadening.
            </p>
            <span className="inline-block mt-3 text-xs text-gray-400">8 scenarios &middot; 4-6 min</span>
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            The self-assessments present you with research scenarios and ask you to indicate your
            preference between two contrasting approaches. Your responses are mapped onto a 2D
            coordinate space that reveals your scholarly tendencies.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            After completing an assessment, you can continue into a conversation with your AI thinking
            partner, which will use your results as a starting point for deeper reflection.
          </p>
          <p className="text-gray-500 text-xs">
            These are reflective tools, not diagnostic instruments. No data is collected or stored.
          </p>
        </div>

        {/* Sources */}
        <div className="mt-12 max-w-2xl mx-auto">
          <AboutSection />
        </div>
      </div>
    </div>
  )
}
