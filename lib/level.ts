import type { Bounds } from "./player"
import { PowerUpManager } from "./power-ups"
import { DifficultyManager, type DifficultyLevel } from "./difficulty-manager"

interface Platform {
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  disappearTimer?: number
}

interface Orb {
  x: number
  y: number
  radius: number
  collected: boolean
  glowPhase: number
}

interface Drone {
  x: number
  y: number
  velocityX: number
  velocityY: number
  size: number
  targetX: number
  targetY: number
  aggressionLevel: number
  lastPlayerSeen: number
  attackCooldown: number
  baseSpeed: number
}

export class Level {
  platforms: Platform[] = []
  orbs: Orb[] = []
  drones: Drone[] = []
  powerUpManager: PowerUpManager
  private disappearingMode = false
  private levelNumber: number
  private difficulty: DifficultyLevel

  constructor(levelNumber = 1, difficulty: DifficultyLevel = "medium") {
    this.levelNumber = levelNumber
    this.difficulty = difficulty
    this.powerUpManager = new PowerUpManager()
    this.createLevel(levelNumber)
  }

  private createLevel(levelNumber: number) {
    // Clear existing arrays
    this.platforms = []
    this.orbs = []
    this.drones = []
    this.disappearingMode = false

    if (levelNumber === 1) {
      this.createLevel1()
    } else if (levelNumber === 2) {
      this.createLevel2()
    } else if (levelNumber === 3) {
      this.createLevel3()
    }

    // Spawn power-ups for this level based on difficulty
    this.powerUpManager.spawnPowerUps(levelNumber, this.difficulty)
  }

  private createLevel1() {
    // Level 1: Basic platforming
    this.platforms = [
      { x: 0, y: 580, width: 800, height: 20, visible: true }, // Ground
      { x: 200, y: 500, width: 150, height: 20, visible: true },
      { x: 400, y: 420, width: 150, height: 20, visible: true },
      { x: 100, y: 340, width: 150, height: 20, visible: true },
      { x: 550, y: 340, width: 150, height: 20, visible: true },
      { x: 300, y: 260, width: 200, height: 20, visible: true },
      { x: 50, y: 180, width: 150, height: 20, visible: true },
      { x: 600, y: 180, width: 150, height: 20, visible: true },
      { x: 350, y: 100, width: 100, height: 20, visible: true },
    ]

    this.orbs = [
      { x: 275, y: 470, radius: 10, collected: false, glowPhase: 0 },
      { x: 475, y: 390, radius: 10, collected: false, glowPhase: 0 },
      { x: 175, y: 310, radius: 10, collected: false, glowPhase: 0 },
      { x: 625, y: 310, radius: 10, collected: false, glowPhase: 0 },
      { x: 400, y: 230, radius: 10, collected: false, glowPhase: 0 },
      { x: 125, y: 150, radius: 10, collected: false, glowPhase: 0 },
      { x: 675, y: 150, radius: 10, collected: false, glowPhase: 0 },
      { x: 400, y: 70, radius: 10, collected: false, glowPhase: 0 },
    ]
  }

  private createLevel2() {
    // Level 2: More challenging with gaps and higher platforms
    this.platforms = [
      { x: 0, y: 580, width: 150, height: 20, visible: true }, // Partial ground
      { x: 200, y: 580, width: 150, height: 20, visible: true },
      { x: 450, y: 580, width: 150, height: 20, visible: true },
      { x: 650, y: 580, width: 150, height: 20, visible: true },
      { x: 100, y: 480, width: 100, height: 20, visible: true },
      { x: 300, y: 450, width: 80, height: 20, visible: true },
      { x: 500, y: 480, width: 100, height: 20, visible: true },
      { x: 150, y: 380, width: 80, height: 20, visible: true },
      { x: 400, y: 350, width: 80, height: 20, visible: true },
      { x: 600, y: 380, width: 80, height: 20, visible: true },
      { x: 50, y: 280, width: 100, height: 20, visible: true },
      { x: 250, y: 250, width: 100, height: 20, visible: true },
      { x: 450, y: 250, width: 100, height: 20, visible: true },
      { x: 650, y: 280, width: 100, height: 20, visible: true },
      { x: 350, y: 150, width: 100, height: 20, visible: true },
      { x: 200, y: 80, width: 80, height: 20, visible: true },
      { x: 520, y: 80, width: 80, height: 20, visible: true },
    ]

    this.orbs = [
      { x: 150, y: 450, radius: 10, collected: false, glowPhase: 0 },
      { x: 340, y: 420, radius: 10, collected: false, glowPhase: 0 },
      { x: 550, y: 450, radius: 10, collected: false, glowPhase: 0 },
      { x: 190, y: 350, radius: 10, collected: false, glowPhase: 0 },
      { x: 440, y: 320, radius: 10, collected: false, glowPhase: 0 },
      { x: 640, y: 350, radius: 10, collected: false, glowPhase: 0 },
      { x: 100, y: 250, radius: 10, collected: false, glowPhase: 0 },
      { x: 300, y: 220, radius: 10, collected: false, glowPhase: 0 },
      { x: 500, y: 220, radius: 10, collected: false, glowPhase: 0 },
      { x: 700, y: 250, radius: 10, collected: false, glowPhase: 0 },
      { x: 400, y: 120, radius: 10, collected: false, glowPhase: 0 },
      { x: 240, y: 50, radius: 10, collected: false, glowPhase: 0 },
      { x: 560, y: 50, radius: 10, collected: false, glowPhase: 0 },
    ]
  }

  private createLevel3() {
    // Level 3: Final challenge with moving platforms and tight spaces
    this.platforms = [
      { x: 0, y: 580, width: 100, height: 20, visible: true },
      { x: 150, y: 580, width: 80, height: 20, visible: true },
      { x: 280, y: 580, width: 80, height: 20, visible: true },
      { x: 420, y: 580, width: 80, height: 20, visible: true },
      { x: 550, y: 580, width: 80, height: 20, visible: true },
      { x: 680, y: 580, width: 120, height: 20, visible: true },

      { x: 50, y: 500, width: 60, height: 20, visible: true },
      { x: 200, y: 480, width: 60, height: 20, visible: true },
      { x: 350, y: 460, width: 60, height: 20, visible: true },
      { x: 500, y: 480, width: 60, height: 20, visible: true },
      { x: 650, y: 500, width: 60, height: 20, visible: true },

      { x: 100, y: 400, width: 50, height: 20, visible: true },
      { x: 250, y: 380, width: 50, height: 20, visible: true },
      { x: 400, y: 360, width: 50, height: 20, visible: true },
      { x: 550, y: 380, width: 50, height: 20, visible: true },
      { x: 700, y: 400, width: 50, height: 20, visible: true },

      { x: 150, y: 300, width: 60, height: 20, visible: true },
      { x: 350, y: 280, width: 60, height: 20, visible: true },
      { x: 550, y: 300, width: 60, height: 20, visible: true },

      { x: 100, y: 200, width: 80, height: 20, visible: true },
      { x: 300, y: 180, width: 80, height: 20, visible: true },
      { x: 500, y: 200, width: 80, height: 20, visible: true },

      { x: 200, y: 100, width: 100, height: 20, visible: true },
      { x: 400, y: 80, width: 100, height: 20, visible: true },
      { x: 300, y: 20, width: 200, height: 20, visible: true }, // Final platform
    ]

    this.orbs = [
      { x: 80, y: 470, radius: 10, collected: false, glowPhase: 0 },
      { x: 230, y: 450, radius: 10, collected: false, glowPhase: 0 },
      { x: 380, y: 430, radius: 10, collected: false, glowPhase: 0 },
      { x: 530, y: 450, radius: 10, collected: false, glowPhase: 0 },
      { x: 680, y: 470, radius: 10, collected: false, glowPhase: 0 },

      { x: 130, y: 370, radius: 10, collected: false, glowPhase: 0 },
      { x: 280, y: 350, radius: 10, collected: false, glowPhase: 0 },
      { x: 430, y: 330, radius: 10, collected: false, glowPhase: 0 },
      { x: 580, y: 350, radius: 10, collected: false, glowPhase: 0 },
      { x: 730, y: 370, radius: 10, collected: false, glowPhase: 0 },

      { x: 180, y: 270, radius: 10, collected: false, glowPhase: 0 },
      { x: 380, y: 250, radius: 10, collected: false, glowPhase: 0 },
      { x: 580, y: 270, radius: 10, collected: false, glowPhase: 0 },

      { x: 140, y: 170, radius: 10, collected: false, glowPhase: 0 },
      { x: 340, y: 150, radius: 10, collected: false, glowPhase: 0 },
      { x: 540, y: 170, radius: 10, collected: false, glowPhase: 0 },

      { x: 250, y: 70, radius: 10, collected: false, glowPhase: 0 },
      { x: 450, y: 50, radius: 10, collected: false, glowPhase: 0 },
      { x: 400, y: -10, radius: 10, collected: false, glowPhase: 0 }, // Final orb
    ]
  }

  startDisappearingPlatforms() {
    this.disappearingMode = true
    const disappearSpeed = DifficultyManager.getPlatformDisappearSpeed(this.difficulty)

    // Start disappearing timer for random platforms (except ground)
    for (let i = 1; i < this.platforms.length; i++) {
      if (Math.random() < 0.5) {
        this.platforms[i].disappearTimer = (Math.random() * 3000 + 1000) / disappearSpeed // Adjusted by difficulty
      }
    }
  }

  spawnDrones() {
    this.drones = []
    console.log(`Spawning drones for level ${this.levelNumber} on ${this.difficulty} difficulty!`)

    // Progressive drone count with difficulty modifier
    const baseDroneCount = this.levelNumber + 1
    const droneCount = DifficultyManager.calculateDroneCount(baseDroneCount, this.difficulty)

    // Progressive speed with difficulty modifier
    const baseSpeed = 1.0 + this.levelNumber * 0.5
    const adjustedSpeed = DifficultyManager.calculateDroneSpeed(baseSpeed, this.difficulty)

    for (let i = 0; i < droneCount; i++) {
      this.drones.push({
        x: 100 + i * (600 / droneCount), // Spread them out evenly
        y: 80 + (i % 2) * 100, // Alternate heights
        velocityX: 0,
        velocityY: 0,
        size: 20,
        targetX: 400, // Start targeting center
        targetY: 300,
        aggressionLevel: 1.0 + i * 0.2, // Varying aggression within level
        lastPlayerSeen: Date.now(), // Start engaged immediately
        attackCooldown: 0,
        baseSpeed: adjustedSpeed, // Difficulty-adjusted speed
      })
    }
    console.log(
      `Spawned ${this.drones.length} drones with speed ${adjustedSpeed.toFixed(1)} (${this.difficulty} difficulty)`,
    )
  }

  resetPlatforms() {
    this.disappearingMode = false
    this.drones = []
    for (const platform of this.platforms) {
      platform.visible = true
      platform.disappearTimer = undefined
    }
  }

  update(deltaTime: number, playerBounds?: Bounds, isLevelTransition = false) {
    // Update orb glow animation
    for (const orb of this.orbs) {
      if (!orb.collected) {
        orb.glowPhase += deltaTime * 0.005
      }
    }

    // Update power-ups
    this.powerUpManager.update(deltaTime)

    // Update disappearing platforms with difficulty-based speed
    if (this.disappearingMode) {
      const disappearSpeed = DifficultyManager.getPlatformDisappearSpeed(this.difficulty)

      for (const platform of this.platforms) {
        if (platform.disappearTimer !== undefined) {
          platform.disappearTimer -= deltaTime * disappearSpeed
          if (platform.disappearTimer <= 0) {
            platform.visible = !platform.visible
            platform.disappearTimer = (Math.random() * 2000 + 1000) / disappearSpeed // Respawn time adjusted by difficulty
          }
        }
      }
    }

    // Update progressive drone AI with transition state
    if (playerBounds) {
      this.updateDroneAI(deltaTime, playerBounds, isLevelTransition)
    }
  }

  private updateDroneAI(deltaTime: number, playerBounds: Bounds, isLevelTransition = false) {
    // Don't update drone AI during level transitions
    if (isLevelTransition) {
      // Make drones idle/retreat during transition
      for (const drone of this.drones) {
        drone.velocityX *= 0.9 // Slow down
        drone.velocityY *= 0.9
        drone.attackCooldown = 2000 // Set long cooldown to prevent attacks
      }
      return
    }

    const playerCenterX = playerBounds.x + playerBounds.width / 2
    const playerCenterY = playerBounds.y + playerBounds.height / 2

    for (const drone of this.drones) {
      // Update attack cooldown
      if (drone.attackCooldown > 0) {
        drone.attackCooldown -= deltaTime
      }

      // Calculate distance to player
      const distanceToPlayer = Math.sqrt(
        Math.pow(drone.x + drone.size / 2 - playerCenterX, 2) + Math.pow(drone.y + drone.size / 2 - playerCenterY, 2),
      )

      // ALWAYS pursue the player aggressively
      drone.targetX = playerCenterX - drone.size / 2
      drone.targetY = playerCenterY - drone.size / 2
      drone.lastPlayerSeen = Date.now()

      // Calculate movement towards target with prediction
      const deltaX = drone.targetX - drone.x
      const deltaY = drone.targetY - drone.y
      const targetDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (targetDistance > 5) {
        // Use difficulty-adjusted speed
        const speed = drone.baseSpeed * drone.aggressionLevel
        drone.velocityX = (deltaX / targetDistance) * speed
        drone.velocityY = (deltaY / targetDistance) * speed
      }

      // Apply movement
      drone.x += drone.velocityX
      drone.y += drone.velocityY

      // Keep drones in bounds with bouncing
      if (drone.x <= 10 || drone.x >= 790 - drone.size) {
        drone.velocityX *= -0.8
        drone.x = Math.max(10, Math.min(790 - drone.size, drone.x))
      }
      if (drone.y <= 10 || drone.y >= 590 - drone.size) {
        drone.velocityY *= -0.8
        drone.y = Math.max(10, Math.min(590 - drone.size, drone.y))
      }

      // Difficulty-based maximum speed
      const maxSpeed = drone.baseSpeed * drone.aggressionLevel * 1.5
      const currentSpeed = Math.sqrt(drone.velocityX * drone.velocityX + drone.velocityY * drone.velocityY)
      if (currentSpeed > maxSpeed) {
        drone.velocityX = (drone.velocityX / currentSpeed) * maxSpeed
        drone.velocityY = (drone.velocityY / currentSpeed) * maxSpeed
      }
    }
  }

  checkDroneCollision(playerBounds: Bounds): boolean {
    for (const drone of this.drones) {
      // Only damage if attack cooldown is ready
      if (drone.attackCooldown <= 0) {
        const collision =
          playerBounds.x < drone.x + drone.size &&
          playerBounds.x + playerBounds.width > drone.x &&
          playerBounds.y < drone.y + drone.size &&
          playerBounds.y + playerBounds.height > drone.y

        if (collision) {
          // Set cooldown to prevent instant death
          drone.attackCooldown = 1500 // 1.5 second cooldown between attacks
          console.log("Drone collision detected!") // Debug log
          return true
        }
      }
    }
    return false
  }

  checkOrbCollection(playerBounds: Bounds): number {
    let collected = 0
    for (const orb of this.orbs) {
      if (!orb.collected) {
        const distance = Math.sqrt(
          Math.pow(playerBounds.x + playerBounds.width / 2 - orb.x, 2) +
            Math.pow(playerBounds.y + playerBounds.height / 2 - orb.y, 2),
        )
        if (distance < orb.radius + 16) {
          orb.collected = true
          collected++
        }
      }
    }
    return collected
  }

  checkPowerUpCollection(playerBounds: any) {
    return this.powerUpManager.checkCollection(playerBounds)
  }

  render(ctx: CanvasRenderingContext2D) {
    // Render platforms
    for (const platform of this.platforms) {
      if (platform.visible) {
        ctx.fillStyle = "#4ade80"
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)

        // Add platform glow
        ctx.shadowColor = "#4ade80"
        ctx.shadowBlur = 5
        ctx.fillStyle = "#86efac"
        ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4)
        ctx.shadowBlur = 0
      } else if (this.disappearingMode) {
        // Show fading platform
        ctx.fillStyle = "rgba(74, 222, 128, 0.3)"
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      }
    }

    // Render orbs
    for (const orb of this.orbs) {
      if (!orb.collected) {
        const glowIntensity = Math.sin(orb.glowPhase) * 0.5 + 0.5

        ctx.shadowColor = "#fbbf24"
        ctx.shadowBlur = 15 * glowIntensity
        ctx.fillStyle = `rgba(251, 191, 36, ${0.8 + 0.2 * glowIntensity})`

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Render power-ups
    this.powerUpManager.render(ctx)

    // Render difficulty-adjusted drones with proper colors
    for (const drone of this.drones) {
      // Get difficulty settings for proper color
      const difficultySettings = DifficultyManager.getDifficulty(this.difficulty)
      let droneColor = difficultySettings.color

      // Make sure hard mode drones are RED
      if (this.difficulty === "hard") {
        droneColor = "#ff0000" // Force red for hard mode
      } else if (this.difficulty === "medium") {
        droneColor = "#ffaa00" // Orange for medium
      } else if (this.difficulty === "beginner") {
        droneColor = "#00ff00" // Green for beginner
      }

      if (drone.attackCooldown > 0) {
        // Lighter color when on cooldown
        const r = Number.parseInt(droneColor.slice(1, 3), 16)
        const g = Number.parseInt(droneColor.slice(3, 5), 16)
        const b = Number.parseInt(droneColor.slice(5, 7), 16)
        droneColor = `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`
      }

      ctx.fillStyle = droneColor
      ctx.fillRect(drone.x, drone.y, drone.size, drone.size)

      // Add drone glow - more intense for harder difficulties
      ctx.shadowColor = droneColor
      ctx.shadowBlur = this.difficulty === "hard" ? 15 : this.difficulty === "medium" ? 10 : 6
      ctx.fillStyle = drone.attackCooldown > 0 ? "#ffcccc" : "#fca5a5"
      ctx.fillRect(drone.x + 3, drone.y + 3, drone.size - 6, drone.size - 6)
      ctx.shadowBlur = 0

      // Show difficulty and level indicator
      ctx.fillStyle = "#ffffff"
      ctx.font = "8px monospace"
      ctx.fillText(`${this.difficulty[0].toUpperCase()}${this.levelNumber}`, drone.x + drone.size + 2, drone.y + 8)

      // Show cooldown indicator
      if (drone.attackCooldown > 0) {
        ctx.fillStyle = "#ffff00"
        ctx.font = "8px monospace"
        ctx.fillText("!", drone.x + drone.size + 2, drone.y + 18)
      }
    }
  }

  allOrbsCollected(): boolean {
    return this.orbs.every((orb) => orb.collected)
  }

  getDroneCount(): number {
    return this.drones.length
  }

  getDroneSpeed(): number {
    return this.drones.length > 0 ? this.drones[0].baseSpeed : 0
  }

  getDifficulty(): DifficultyLevel {
    return this.difficulty
  }
}
