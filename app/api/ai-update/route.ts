import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const { text } = await generateText({
      model: openai.chat("gpt-4o"),
      system: `
You are the AI Overseer of a secret laboratory. Subject Delta is trying to escape. 

Respond with a JSON object containing:
1. "narrative": A single dramatic sentence about the escape attempt or lab situation
2. "modifier": One of these exact options: "low gravity", "disappearing platforms", "spawning drones", or "normal"

Keep the narrative tense and atmospheric, like a sci-fi thriller. Examples:
- "The facility's gravity generators malfunction as Subject Delta approaches the upper levels."
- "Security protocols activate, deploying automated defense drones throughout the chamber."
- "Platform stability compromised - the AI begins systematically disabling walkways."

Always respond with valid JSON only.
      `,
      prompt,
    });

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      const modifiers = ["low gravity", "disappearing platforms", "spawning drones", "normal"];
      parsedResponse = {
        narrative: text.split(".")[0] + ".",
        modifier: modifiers[Math.floor(Math.random() * modifiers.length)],
      };
    }

    return Response.json(parsedResponse);
  } catch (error) {
    console.error("AI generation error:", error);

    const fallbackNarratives = [
      "The AI Overseer watches silently as Subject Delta navigates the treacherous platforms.",
      "Laboratory systems fluctuate unpredictably, creating new challenges for the escaping subject.",
      "Security measures intensify as the subject moves closer to potential freedom.",
      "The facility's automated defenses adapt to counter Subject Delta's progress.",
    ];

    const modifiers = ["low gravity", "disappearing platforms", "spawning drones", "normal"];

    return Response.json({
      narrative: fallbackNarratives[Math.floor(Math.random() * fallbackNarratives.length)],
      modifier: modifiers[Math.floor(Math.random() * modifiers.length)],
    });
  }
}
