export class AIController {
  private intervalId: number | null = null
  private onResponse: (response: { narrative: string; modifier: string }) => void
  private lastRequestTime = 0
  private requestInterval = 15000 // 15 seconds instead of 30
  private difficulty = 1

  constructor(onResponse: (response: { narrative: string; modifier: string }) => void, difficulty = 1) {
    this.onResponse = onResponse
    this.difficulty = difficulty
    // Faster AI interference
    this.requestInterval = Math.max(10000, 15000 - (difficulty - 1) * 3000)
  }

  start() {
    this.requestAIUpdate()
    this.intervalId = window.setInterval(() => {
      this.requestAIUpdate()
    }, this.requestInterval)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  update(deltaTime: number) {
    // This can be used for any real-time AI processing if needed
  }

  setDifficulty(difficulty: number) {
    this.difficulty = difficulty
    // More aggressive: 15s, 12s, 10s
    this.requestInterval = Math.max(10000, 15000 - (difficulty - 1) * 3000)
  }

  private async requestAIUpdate() {
    try {
      const response = await fetch("/api/ai-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate a one-sentence story update and a random game modifier for level ${this.difficulty} of the AI lab escape game. Higher levels should have more dangerous modifiers. Available modifiers: low gravity, disappearing platforms, spawning drones, normal.`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.onResponse(data)
      } else {
        // Fallback response if API fails
        this.onResponse({
          narrative: "The AI systems flicker momentarily as Subject Delta continues their escape attempt.",
          modifier: "normal",
        })
      }
    } catch (error) {
      console.error("AI request failed:", error)
      // Fallback response
      this.onResponse({
        narrative: "System interference detected. Protocols adapting to Subject Delta's progress.",
        modifier:
          Math.random() < 0.3 ? "low gravity" : Math.random() < 0.6 ? "disappearing platforms" : "spawning drones",
      })
    }
  }
}
