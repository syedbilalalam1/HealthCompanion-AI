import { HealthData, HealthReport } from "@/types/health"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIRequestParams {
  messages: Message[]
  context: string
}

interface AIResponse {
  content: string
}

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const MODEL = "mistralai/mistral-7b-instruct"
const API_URL = "https://openrouter.ai/api/v1/chat/completions"

// Helper function to check if API key is configured
const checkApiKey = () => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your .env.local file.")
  }
}

export async function getHealthRecommendations(healthData: HealthData): Promise<HealthReport> {
  try {
    checkApiKey()

    const prompt = `As a health and fitness expert, analyze the following health data and provide personalized recommendations:

Health Data:
- Height: ${healthData.height}cm
- Weight: ${healthData.weight}kg
- BMI: ${healthData.bmi}
- Age: ${healthData.age}
- Gender: ${healthData.gender}
- Activity Level: ${healthData.activityLevel}
- Goal: ${healthData.goal} weight
- Sleep Hours: ${healthData.sleepHours}
- Stress Level: ${healthData.stressLevel}/10

Please provide:
1. A brief health summary
2. A detailed daily meal plan with 3 meals and 2 snacks
3. Specific exercise recommendations based on their goal and activity level
4. Lifestyle recommendations for sleep, stress management, and overall well-being

Format the response as a JSON object with the following structure:
{
  "summary": "A brief summary of their health status and recommendations",
  "mealPlan": [
    "Breakfast: [detailed breakfast recommendation]",
    "Morning Snack: [detailed snack recommendation]",
    "Lunch: [detailed lunch recommendation]",
    "Afternoon Snack: [detailed snack recommendation]",
    "Dinner: [detailed dinner recommendation]"
  ],
  "exercises": [
    "Specific exercise 1 with duration and frequency",
    "Specific exercise 2 with duration and frequency",
    "Specific exercise 3 with duration and frequency",
    "Specific exercise 4 with duration and frequency"
  ],
  "lifestyle": [
    "Sleep recommendation",
    "Stress management tip",
    "Hydration advice",
    "General wellness tip"
  ]
}`

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://posturefix.app",
        "X-Title": "Posture Fix",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    try {
      const parsedResponse = JSON.parse(aiResponse)
      
      if (!parsedResponse.summary || !Array.isArray(parsedResponse.mealPlan) || 
          !Array.isArray(parsedResponse.exercises) || !Array.isArray(parsedResponse.lifestyle)) {
        throw new Error("Invalid response format from AI")
      }

      return parsedResponse as HealthReport
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      throw new Error("Invalid response format from AI")
    }
  } catch (error) {
    console.error("Error getting health recommendations:", error)
    throw error
  }
}

export async function getAIResponse({ messages, context }: AIRequestParams): Promise<AIResponse> {
  try {
    checkApiKey()

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://posturefix.app",
        "X-Title": "Posture Fix Health Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: context
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API request failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content
    }
  } catch (error) {
    console.error("Error in AI response:", error)
    throw error
  }
} 