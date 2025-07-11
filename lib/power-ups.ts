import { DifficultyManager, type DifficultyLevel } from "./difficulty-manager"

export interface PowerUp {
  x: number
  y: number
  type: "high_jump" | "speed_boost" | "shield"
  collected: boolean
  glowPhase: number
  size: number
}

export class PowerUpManager {
  powerUps: PowerUp[] = []

  constructor() {}

  spawnPowerUps(levelNumber: number, difficulty: DifficultyLevel = "medium") {
    this.powerUps = []

    // Base power-up positions
    const basePowerUps: Omit<PowerUp, "collected" | "glowPhase" | "size">[] = []

    if (levelNumber === 1) {
      basePowerUps.push({ x: 400, y: 200, type: "high_jump" }, { x: 125, y: 120, type: "speed_boost" })
    } else if (levelNumber === 2) {
      basePowerUps.push(
        { x: 300, y: 220, type: "high_jump" },
        { x: 500, y: 220, type: "speed_boost" },
        { x: 400, y: 90, type: "shield" },
      )
    } else if (levelNumber === 3) {
      basePowerUps.push(
        { x: 180, y: 240, type: "high_jump" },
        { x: 380, y: 220, type: "speed_boost" },
        { x: 580, y: 240, type: "shield" },
        { x: 250, y: 40, type: "high_jump" },
      )
    }

    // Spawn power-ups based on difficulty
    for (const basePowerUp of basePowerUps) {
      if (DifficultyManager.shouldSpawnPowerUp(difficulty)) {
        this.powerUps.push({
          ...basePowerUp,
          collected: false,
          glowPhase: 0,
          size: 16,
        })
      }
    }

    // Add extra power-ups for beginner difficulty
    if (difficulty === "beginner" && levelNumber >= 2) {
      this.powerUps.push({
        x: 50 + Math.random() * 700,
        y: 100 + Math.random() * 200,
        type: Math.random() < 0.5 ? "shield" : "speed_boost",
        collected: false,
        glowPhase: 0,
        size: 16,
      })
    }
  }

  update(deltaTime: number) {
    for (const powerUp of this.powerUps) {
      if (!powerUp.collected) {
        powerUp.glowPhase += deltaTime * 0.008
      }
    }
  }

  checkCollection(playerBounds: any): PowerUp[] {
    const collected: PowerUp[] = []

    for (const powerUp of this.powerUps) {
      if (!powerUp.collected) {
        const distance = Math.sqrt(
          Math.pow(playerBounds.x + playerBounds.width / 2 - powerUp.x, 2) +
            Math.pow(playerBounds.y + playerBounds.height / 2 - powerUp.y, 2),
        )

        if (distance < powerUp.size + 16) {
          powerUp.collected = true
          collected.push(powerUp)
        }
      }
    }

    return collected
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const powerUp of this.powerUps) {
      if (!powerUp.collected) {
        const glowIntensity = Math.sin(powerUp.glowPhase) * 0.5 + 0.5

        // Different colors for different power-ups
        let color = "#ff00ff" // Default magenta
        if (powerUp.type === "high_jump")
          color = "#00ffff" // Cyan
        else if (powerUp.type === "speed_boost")
          color = "#ffff00" // Yellow
        else if (powerUp.type === "shield") color = "#ff8800" // Orange

        ctx.shadowColor = color
        ctx.shadowBlur = 12 * glowIntensity
        ctx.fillStyle = color

        // Draw power-up as a diamond shape
        ctx.save()
        ctx.translate(powerUp.x, powerUp.y)
        ctx.rotate(Math.PI / 4 + powerUp.glowPhase * 0.5)
        ctx.fillRect(-powerUp.size / 2, -powerUp.size / 2, powerUp.size, powerUp.size)
        ctx.restore()

        ctx.shadowBlur = 0
      }
    }
  }
}
