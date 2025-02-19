export interface HealthData {
  height: number
  weight: number
  bmi: number
  age: number
  gender: string
  activityLevel: string
  goal: string
  sleepHours: number
  stressLevel: number
  recommendations?: HealthReport
  lastUpdated?: string
}

export interface HealthReport {
  summary: string
  mealPlan: string[]
  exercises: string[]
  lifestyle: string[]
} 