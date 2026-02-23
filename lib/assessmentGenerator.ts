import { AssessmentConfig, Scenario } from '@/config/assessmentConfig'

export interface GeneratedScenario {
  id: string
  stem: string
  leftOption: string
  rightOption: string
  leftCategory: string
  rightCategory: string
  dimension: string
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate the assessment question sequence from config.
// Shuffles each dimension's scenarios, picks `questionsPerDimension` from the pool,
// and randomly flips left/right presentation.
// Returns: first half = Dimension 1 (Phase 1), second half = Dimension 2 (Phase 2).
export function generateAssessmentScenarios(config: AssessmentConfig): GeneratedScenario[] {
  const count = config.assessmentSettings.questionsPerDimension
  const generated: GeneratedScenario[] = []

  for (const scenarioSet of config.scenarioSets) {
    const shuffled = shuffleArray(scenarioSet.scenarios)
    const selected = shuffled.slice(0, count)

    for (const scenario of selected) {
      const flip = Math.random() < 0.5

      generated.push({
        id: scenario.id,
        stem: scenario.stem,
        leftOption: flip ? scenario.rightOption : scenario.leftOption,
        rightOption: flip ? scenario.leftOption : scenario.rightOption,
        leftCategory: flip ? scenario.rightCategory : scenario.leftCategory,
        rightCategory: flip ? scenario.leftCategory : scenario.rightCategory,
        dimension: scenario.dimension
      })
    }
  }

  return generated
}
