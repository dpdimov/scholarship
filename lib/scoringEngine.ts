import { AssessmentConfig, getStyleDefinitions } from '@/config/assessmentConfig'
import { GeneratedScenario } from './assessmentGenerator'

export interface CategoryScore {
  category: string
  dimension: string
  rawScore: number
  normalizedScore: number // 0 to 1
  questionCount: number
}

export interface DimensionScore {
  dimension: string
  category1: string
  category2: string
  category1Score: number
  category2Score: number
  dimensionBalance: number // -1 to +1
  totalQuestions: number
}

export interface AssessmentScore {
  assessmentId: string
  categoryScores: CategoryScore[]
  dimensionScores: DimensionScore[]
  coordinates: {
    x: number // Dimension 1: -1 to +1
    y: number // Dimension 2: -1 to +1
  }
  totalQuestions: number
  completedAt: string
}

export interface ScoringResponse {
  questionId: string
  value: number // 0-10 slider value
  leftCategory: string
  rightCategory: string
  preferredCategory: string
  preferenceStrength: number // 0-5
  dimension: string
}

// Convert slider value (0-10) to preference direction and strength
export function calculatePreference(
  sliderValue: number,
  scenario: GeneratedScenario
): {
  preferredCategory: string | null
  preferenceStrength: number
  leftCategory: string
  rightCategory: string
} {
  const leftCategory = scenario.leftCategory
  const rightCategory = scenario.rightCategory

  if (sliderValue === 5) {
    return { preferredCategory: null, preferenceStrength: 0, leftCategory, rightCategory }
  }

  if (sliderValue < 5) {
    return {
      preferredCategory: leftCategory,
      preferenceStrength: 5 - sliderValue,
      leftCategory,
      rightCategory
    }
  }

  return {
    preferredCategory: rightCategory,
    preferenceStrength: sliderValue - 5,
    leftCategory,
    rightCategory
  }
}

// Calculate final assessment scores
export function calculateAssessmentScores(
  scenarios: GeneratedScenario[],
  responses: { questionId: string; value: number }[],
  config: AssessmentConfig
): AssessmentScore {
  const scoringResponses: ScoringResponse[] = []

  for (const response of responses) {
    const scenario = scenarios.find(s => s.id === response.questionId)
    if (!scenario) continue

    const preference = calculatePreference(response.value, scenario)

    scoringResponses.push({
      questionId: response.questionId,
      value: response.value,
      leftCategory: preference.leftCategory,
      rightCategory: preference.rightCategory,
      preferredCategory: preference.preferredCategory || 'neutral',
      preferenceStrength: preference.preferenceStrength,
      dimension: scenario.dimension
    })
  }

  const categoryScores = calculateCategoryScores(scoringResponses, config)
  const dimensionScores = calculateDimensionScores(categoryScores, config)
  const coordinates = calculateCoordinates(dimensionScores, config)

  // Debug logging
  console.log('=== Scoring Debug ===')
  console.log('Responses:', scoringResponses.map(r => ({
    q: r.questionId,
    val: r.value,
    preferred: r.preferredCategory,
    strength: r.preferenceStrength,
    dim: r.dimension
  })))
  console.log('Category scores:', categoryScores.map(c => ({
    cat: c.category,
    dim: c.dimension,
    raw: c.rawScore,
    norm: c.normalizedScore.toFixed(3),
    count: c.questionCount
  })))
  console.log('Dimension scores:', dimensionScores.map(d => ({
    dim: d.dimension,
    cat1: `${d.category1}=${d.category1Score.toFixed(3)}`,
    cat2: `${d.category2}=${d.category2Score.toFixed(3)}`,
    balance: d.dimensionBalance.toFixed(3)
  })))
  console.log('Coordinates:', { x: coordinates.x.toFixed(3), y: coordinates.y.toFixed(3) })

  return {
    assessmentId: config.id,
    categoryScores,
    dimensionScores,
    coordinates,
    totalQuestions: responses.length,
    completedAt: new Date().toISOString()
  }
}

// Calculate raw and normalized scores for each category
function calculateCategoryScores(
  responses: ScoringResponse[],
  config: AssessmentConfig
): CategoryScore[] {
  const categoryTotals: Record<string, { total: number; dimension: string }> = {}

  // Initialize from config dimensions
  for (const dim of config.dimensions) {
    for (const cat of dim.categories) {
      categoryTotals[cat] = { total: 0, dimension: dim.name }
    }
  }

  // Sum preferences
  for (const response of responses) {
    if (response.preferredCategory !== 'neutral' && categoryTotals[response.preferredCategory]) {
      categoryTotals[response.preferredCategory].total += response.preferenceStrength
    }
  }

  const categoryScores: CategoryScore[] = []

  for (const [category, data] of Object.entries(categoryTotals)) {
    const categoryAppearances = responses.filter(
      r => r.leftCategory === category || r.rightCategory === category
    ).length

    const rawScore = data.total
    const maxPossible = categoryAppearances * 5
    const normalizedScore = maxPossible > 0 ? rawScore / maxPossible : 0

    categoryScores.push({
      category,
      dimension: data.dimension,
      rawScore,
      normalizedScore,
      questionCount: categoryAppearances
    })
  }

  return categoryScores
}

// Calculate dimension-level scores from category scores
function calculateDimensionScores(
  categoryScores: CategoryScore[],
  config: AssessmentConfig
): DimensionScore[] {
  return config.dimensions.map(dimension => {
    const [category1Name, category2Name] = dimension.categories
    const category1Score = categoryScores.find(cs => cs.category === category1Name)
    const category2Score = categoryScores.find(cs => cs.category === category2Name)

    const cat1 = category1Score?.normalizedScore || 0
    const cat2 = category2Score?.normalizedScore || 0
    const totalQuestions = (category1Score?.questionCount || 0) + (category2Score?.questionCount || 0)

    let dimensionBalance = 0
    if (cat1 + cat2 > 0) {
      dimensionBalance = (cat2 - cat1) / (cat1 + cat2)
    }

    return {
      dimension: dimension.name,
      category1: category1Name,
      category2: category2Name,
      category1Score: cat1,
      category2Score: cat2,
      dimensionBalance,
      totalQuestions
    }
  })
}

// Calculate X/Y coordinates from dimension scores
function calculateCoordinates(
  dimensionScores: DimensionScore[],
  config: AssessmentConfig
): { x: number; y: number } {
  if (config.dimensions.length < 2) {
    return { x: 0, y: 0 }
  }

  const dim1 = dimensionScores.find(d => d.dimension === config.dimensions[0].name)
  const dim2 = dimensionScores.find(d => d.dimension === config.dimensions[1].name)

  return {
    x: dim1?.dimensionBalance || 0,
    y: dim2?.dimensionBalance || 0
  }
}

// Interpret coordinates as one of 9 style positions
export function interpretCoordinates(
  coordinates: { x: number; y: number },
  config: AssessmentConfig
): {
  position: string
  style: string
  description: string
  traits: string[]
} {
  const { x, y } = coordinates
  const neutralThreshold = 0.1

  const xCat = Math.abs(x) <= neutralThreshold ? 'neutral' : x > 0 ? 'positive' : 'negative'
  const yCat = Math.abs(y) <= neutralThreshold ? 'neutral' : y > 0 ? 'positive' : 'negative'

  let styleKey: string
  if (xCat === 'neutral' && yCat === 'neutral') styleKey = 'center'
  else if (xCat === 'neutral' && yCat === 'positive') styleKey = 'borderNorth'
  else if (xCat === 'neutral' && yCat === 'negative') styleKey = 'borderSouth'
  else if (xCat === 'negative' && yCat === 'neutral') styleKey = 'borderWest'
  else if (xCat === 'positive' && yCat === 'neutral') styleKey = 'borderEast'
  else if (xCat === 'positive' && yCat === 'positive') styleKey = 'quadrant1'
  else if (xCat === 'negative' && yCat === 'positive') styleKey = 'quadrant2'
  else if (xCat === 'negative' && yCat === 'negative') styleKey = 'quadrant3'
  else styleKey = 'quadrant4' // positive x, negative y

  const styles = getStyleDefinitions(config)
  const styleInfo = styles[styleKey as keyof typeof styles]

  return {
    position: styleKey,
    style: styleInfo?.name || styleKey,
    description: styleInfo?.description || '',
    traits: styleInfo?.traits || []
  }
}
