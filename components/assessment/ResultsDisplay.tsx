'use client'

import { useRouter } from 'next/navigation'
import { AssessmentScore, interpretCoordinates } from '@/lib/scoringEngine'
import { AssessmentConfig } from '@/config/assessmentConfig'
import ResultsPlot from './ResultsPlot'

interface ResultsDisplayProps {
  scores: AssessmentScore
  config: AssessmentConfig
  onRetake: () => void
}

export default function ResultsDisplay({ scores, config, onRetake }: ResultsDisplayProps) {
  const router = useRouter()
  const interpretation = interpretCoordinates(scores.coordinates, config)

  const handleContinueToChat = () => {
    // Store results in sessionStorage for handoff to chat
    sessionStorage.setItem('assessmentResults', JSON.stringify({
      assessmentId: scores.assessmentId,
      assessmentName: config.name,
      style: interpretation.style,
      description: interpretation.description,
      traits: interpretation.traits,
      coordinates: scores.coordinates,
      position: interpretation.position
    }))
    router.push('/chat')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Results</h1>
          <p className="text-lg text-gray-600">
            Based on your responses to the {config.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plot */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Visual Summary
            </h2>
            <ResultsPlot
              x={scores.coordinates.x}
              y={scores.coordinates.y}
              config={config}
            />
          </div>

          {/* Interpretation */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Style
            </h2>
            <h3 className="text-2xl font-bold text-navy-600 mb-4">
              {interpretation.style}
            </h3>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {interpretation.description}
            </p>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Key Traits
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {interpretation.traits.map((trait, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-navy-600 rounded-full mr-3 shrink-0" />
                    <span className="text-gray-700 text-sm">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContinueToChat}
                className="w-full bg-navy-600 hover:bg-navy-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Continue to Chat &rarr;
              </button>
              <button
                onClick={onRetake}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-6 transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
