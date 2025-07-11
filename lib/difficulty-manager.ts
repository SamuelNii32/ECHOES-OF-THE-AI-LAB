export type DifficultyLevel = "beginner" | "medium" | "hard"

export interface DifficultySettings {
  name: string
  displayName: string
  description: string
  timeMultiplier: number // Multiplier for time limits
  droneSpeedMultiplier: number // Multiplier for drone speed
  droneCountModifier: number // Added to base drone count
  aiInterferenceInterval: number // How often AI interferes (ms)
  platformDisappearSpeed: number // How fast platforms disappear
  powerUpSpawnRate: number // Chance of power-ups spawning
  livesCount: number // Starting lives
  color: string // Theme color
}

export class DifficultyManager {
  private static difficulties: Record<DifficultyLevel, DifficultySettings> = {
    beginner: {
      name: "beginner",
      displayName: "BEGINNER",
      description: "Perfect for new test subjects",
      timeMultiplier: 1.5, // 50% more time
      droneSpeedMultiplier: 0.7, // 30% slower drones
      droneCountModifier: -1, // 1 less drone per level
      aiInterferenceInterval: 25000, // AI interferes every 25 seconds
      platformDisappearSpeed: 0.5, // Platforms disappear slower
      powerUpSpawnRate: 1.2, // 20% more power-ups
      livesCount: 5, // 5 lives instead of 3
      color: "#00ff00", // Green
    },
    medium: {
      name: "medium",
      displayName: "MEDIUM",
      description: "Standard containment protocols",
      timeMultiplier: 1.0, // Normal time
      droneSpeedMultiplier: 1.0, // Normal drone speed
      droneCountModifier: 0, // Normal drone count
      aiInterferenceInterval: 15000, // AI interferes every 15 seconds
      platformDisappearSpeed: 1.0, // Normal platform behavior
      powerUpSpawnRate: 1.0, // Normal power-ups
      livesCount: 3, // 3 lives
      color: "#ffff00", // Yellow
    },
    hard: {
      name: "hard",
      displayName: "HARD",
      description: "Maximum security protocols",
      timeMultiplier: 0.75, // 25% less time
      droneSpeedMultiplier: 1.4, // 40% faster drones
      droneCountModifier: 1, // 1 extra drone per level
      aiInterferenceInterval: 10000, // AI interferes every 10 seconds
      platformDisappearSpeed: 1.5, // Platforms disappear faster
      powerUpSpawnRate: 0.8, // 20% fewer power-ups
      livesCount: 2, // Only 2 lives
      color: "#ff0000", // Red
    },
  }

  static getDifficulty(level: DifficultyLevel): DifficultySettings {
    return this.difficulties[level]
  }

  static getAllDifficulties(): DifficultySettings[] {
    return Object.values(this.difficulties)
  }

  static calculateTimeLimit(baseTime: number, difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return Math.floor(baseTime * settings.timeMultiplier)
  }

  static calculateDroneCount(baseCount: number, difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return Math.max(1, baseCount + settings.droneCountModifier)
  }

  static calculateDroneSpeed(baseSpeed: number, difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return baseSpeed * settings.droneSpeedMultiplier
  }

  static getAIInterval(difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return settings.aiInterferenceInterval
  }

  static getPlatformDisappearSpeed(difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return settings.platformDisappearSpeed
  }

  static shouldSpawnPowerUp(difficulty: DifficultyLevel): boolean {
    const settings = this.getDifficulty(difficulty)
    return Math.random() < settings.powerUpSpawnRate
  }

  static getStartingLives(difficulty: DifficultyLevel): number {
    const settings = this.getDifficulty(difficulty)
    return settings.livesCount
  }
}
