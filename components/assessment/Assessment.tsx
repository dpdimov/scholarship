'use client'

import { useState } from 'react'
import ScenarioSlider from './ScenarioSlider'
import { GeneratedScenario } from '@/lib/assessmentGenerator'
import { calculateAssessmentScores, AssessmentScore } from '@/lib/scoringEngine'
import { AssessmentConfig } from '@/config/assessmentConfig'

interface AssessmentProps {
  scenarios: GeneratedScenario[]
  config: AssessmentConfig
  onComplete: (scores: AssessmentScore) => void
}

export default function Assessment({ scenarios, config, onComplete }: AssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<{ questionId: string; value: number }[]>([])

  const questionsPerPhase = Math.ceil(scenarios.length / 2)
  const currentPhase = currentIndex < questionsPerPhase ? 1 : 2
  const phaseIndex = currentPhase === 1 ? currentIndex : currentIndex - questionsPerPhase
  const phaseTotal = currentPhase === 1 ? questionsPerPhase : scenarios.length - questionsPerPhase
  const progress = ((currentIndex + 1) / scenarios.length) * 100

  const currentScenario = scenarios[currentIndex]

  const handleSubmit = (value: number) => {
    const newResponses = [...responses, { questionId: currentScenario.id, value }]
    setResponses(newResponses)

    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Assessment complete
      const scores = calculateAssessmentScores(scenarios, newResponses, config)
      onComplete(scores)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Exit link */}
        <div className="mb-4">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            &larr; Exit assessment
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {config.name}
          </h1>
          <div className="text-gray-600">
            <span className="inline-block bg-navy-600/10 text-navy-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
              Part {currentPhase} of 2
            </span>
            <div className="text-sm">
              Question {phaseIndex + 1} of {phaseTotal}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-navy-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current scenario */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <ScenarioSlider
            key={currentScenario.id}
            questionId={currentScenario.id}
            stem={currentScenario.stem}
            leftOption={currentScenario.leftOption}
            rightOption={currentScenario.rightOption}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          Use the slider or click the bars to indicate your preference, then click Next
        </div>
      </div>
    </div>
  )
}
