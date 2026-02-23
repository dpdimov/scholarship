// Type definitions for assessment configuration

export interface Dimension {
  name: string
  description: string
  categories: string[]
  leftLabel: string   // label for the negative end of the axis
  rightLabel: string  // label for the positive end of the axis
}

export interface Scenario {
  id: string
  stem: string          // the research situation
  leftOption: string    // approach text for the left pole
  rightOption: string   // approach text for the right pole
  leftCategory: string  // category name for left pole
  rightCategory: string // category name for right pole
  dimension: string     // which dimension this scenario measures
}

export interface ScenarioSet {
  dimension: string
  scenarios: Scenario[]
}

export interface StyleDefinition {
  name: string
  description: string
  coordinates: {
    x: 'positive' | 'negative' | 'neutral'
    y: 'positive' | 'negative' | 'neutral'
  }
  traits: string[]
}

export interface AssessmentConfig {
  id: string
  name: string
  shortDescription: string
  dimensions: Dimension[]
  scenarioSets: ScenarioSet[]
  assessmentSettings: {
    questionsPerDimension: number
  }
  styleDefinitions: {
    quadrant1: StyleDefinition
    quadrant2: StyleDefinition
    quadrant3: StyleDefinition
    quadrant4: StyleDefinition
    borderNorth: StyleDefinition
    borderSouth: StyleDefinition
    borderWest: StyleDefinition
    borderEast: StyleDefinition
    center: StyleDefinition
  }
  metadata: {
    version: string
    lastUpdated: string
    description: string
  }
}

export interface AssessmentRegistry {
  assessments: {
    id: string
    name: string
    shortDescription: string
    version: string
    isActive: boolean
    configFile: string
    estimatedTime: string
    questionCount: number
  }[]
  defaultAssessment: string
  metadata: {
    lastUpdated: string
    totalAssessments: number
    version: string
  }
}

// Load specific assessment configuration by ID
export async function loadAssessmentConfig(assessmentId: string): Promise<AssessmentConfig> {
  const response = await fetch(`/config/assessments/${assessmentId}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load assessment config: ${response.status}`)
  }
  return response.json() as Promise<AssessmentConfig>
}

// Load assessment registry
export async function loadAssessmentRegistry(): Promise<AssessmentRegistry> {
  const response = await fetch('/config/assessments/index.json')
  if (!response.ok) {
    throw new Error(`Failed to load assessment registry: ${response.status}`)
  }
  return response.json() as Promise<AssessmentRegistry>
}

// Get style definitions from config
export function getStyleDefinitions(config: AssessmentConfig) {
  return config.styleDefinitions
}
