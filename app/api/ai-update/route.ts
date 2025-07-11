import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_KEY) {
      // No key – return a harmless fallback so gameplay continues
      return Response.json({
        narrative: "The AI Overseer loses connection to its higher functions; improvising new protocol.",
        modifier: ["low gravity", "disappearing platforms", "spawning drones", "normal"][Math.floor(Math.random() * 4)],
      })
    }

    const { prompt } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o", { apiKey: OPENAI_KEY }),
      system: `You are the AI Overseer of a secret laboratory. Subject Delta is trying to escape. 
    
    Respond with a JSON object containing:
    1. "narrative": A single dramatic sentence about the escape attempt or lab situation
    2. "modifier": One of these exact options: "low gravity", "disappearing platforms", "spawning drones", or "normal"
    
    Keep the narrative tense and atmospheric, like a sci-fi thriller. Examples:
    - "The facility's gravity generators malfunction as Subject Delta approaches the upper levels."
    - "Security protocols activate, deploying automated defense drones throughout the chamber."
    - "Platform stability compromised - the AI begins systematically disabling walkways."
    
    Always respond with valid JSON only.`,
      prompt: prompt,
    })

    // Parse the AI response to extract narrative and modifier
    let parsedResponse
    try {
      parsedResponse = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      const modifiers = ["low gravity", "disappearing platforms", "spawning drones", "normal"]
      parsedResponse = {
        narrative: text.split(".")[0] + ".",
        modifier: modifiers[Math.floor(Math.random() * modifiers.length)],
      }
    }

    return Response.json(parsedResponse)
  } catch (error) {
    console.error("AI generation error:", error)

    // Fallback response
    const fallbackNarratives = [
      "The AI Overseer watches silently as Subject Delta navigates the treacherous platforms.",
      "Laboratory systems fluctuate unpredictably, creating new challenges for the escaping subject.",
      "Security measures intensify as the subject moves closer to potential freedom.",
      "The facility's automated defenses adapt to counter Subject Delta's progress.",
    ]

    const modifiers = ["low gravity", "disappearing platforms", "spawning drones", "normal"]

    return Response.json({
      narrative: fallbackNarratives[Math.floor(Math.random() * fallbackNarratives.length)],
      modifier: modifiers[Math.floor(Math.random() * modifiers.length)],
    })
  }
}
