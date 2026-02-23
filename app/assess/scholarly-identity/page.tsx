'use client'

import { useState, useEffect } from 'react'
import Assessment from '@/components/assessment/Assessment'
import ResultsDisplay from '@/components/assessment/ResultsDisplay'
import { AssessmentConfig } from '@/config/assessmentConfig'
import { generateAssessmentScenarios, GeneratedScenario } from '@/lib/assessmentGenerator'
import { AssessmentScore } from '@/lib/scoringEngine'

export default function ScholarlyIdentityPage() {
  const [config, setConfig] = useState<AssessmentConfig | null>(null)
  const [scenarios, setScenarios] = useState<GeneratedScenario[] | null>(null)
  const [scores, setScores] = useState<AssessmentScore | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initAssessment = async () => {
    try {
      setScores(null)
      const response = await fetch('/config/assessments/scholarly-identity.json')
      if (!response.ok) throw new Error('Failed to load assessment config')
      const cfg: AssessmentConfig = await response.json()
      setConfig(cfg)
      setScenarios(generateAssessmentScenarios(cfg))
    } catch (err) {
      setError('Failed to load the assessment. Please refresh and try again.')
    }
  }

  useEffect(() => {
    initAssessment()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!config || !scenarios) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading assessment...</div>
      </div>
    )
  }

  if (scores) {
    return (
      <ResultsDisplay
        scores={scores}
        config={config}
        onRetake={initAssessment}
      />
    )
  }

  return (
    <Assessment
      scenarios={scenarios}
      config={config}
      onComplete={setScores}
    />
  )
}
