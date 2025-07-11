import { DifficultyManager, type DifficultyLevel } from "./difficulty-manager"

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export class Player {
  private x: number
  private y: number
  private width = 32
  private height = 32
  private velocityX = 0
  private velocityY = 0
  private speed = 5
  private jumpPower = 15
  private gravity = 0.8
  private onGround = false
  private lives = 3
  private invulnerable = false
  private invulnerabilityTimer = 0

  // Add power-up properties
  private highJumpCharges = 0
  private speedBoostActive = false
  private speedBoostTimer = 0
  private shieldActive = false
  private shieldTimer = 0

  // Double-tap detection for high jump
  private lastJumpTime = 0
  private doubleTapWindow = 300 // 300ms window for double tap

  // Add getter for lives
  getLives(): number {
    return this.lives
  }

  // Add method to check if player is dead
  isDead(): boolean {
    return this.lives <= 0
  }

  // Add method to take damage
  takeDamage(): boolean {
    if (this.invulnerable || this.shieldActive) return false

    this.lives--
    this.invulnerable = true
    this.invulnerabilityTimer = 3000 // Increased to 3 seconds for better recovery

    // Respawn at starting position
    this.x = 100
    this.y = 400
    this.velocityX = 0
    this.velocityY = 0

    return true // Damage was taken
  }

  // Add method to reset for new game
  reset(difficulty?: DifficultyLevel) {
    this.x = 100
    this.y = 400
    this.velocityX = 0
    this.velocityY = 0
    this.lives = difficulty ? DifficultyManager.getStartingLives(difficulty) : 3
    this.invulnerable = false
    this.invulnerabilityTimer = 0
    this.highJumpCharges = 0
    this.speedBoostActive = false
    this.speedBoostTimer = 0
    this.shieldActive = false
    this.shieldTimer = 0
    this.lastJumpTime = 0
  }

  constructor(x: number, y: number, difficulty: DifficultyLevel = "medium") {
    this.x = x
    this.y = y
    this.lives = DifficultyManager.getStartingLives(difficulty)
  }

  moveLeft() {
    const speed = this.speedBoostActive ? this.speed * 1.5 : this.speed
    this.velocityX = -speed
  }

  moveRight() {
    const speed = this.speedBoostActive ? this.speed * 1.5 : this.speed
    this.velocityX = speed
  }

  // Regular jump
  jump() {
    const currentTime = Date.now()
    const timeSinceLastJump = currentTime - this.lastJumpTime

    if (this.onGround) {
      this.velocityY = -this.jumpPower
      this.onGround = false

      // Check for double-tap within the window
      if (timeSinceLastJump < this.doubleTapWindow && this.highJumpCharges > 0) {
        this.velocityY = -this.jumpPower * 1.6
        this.highJumpCharges--
      }

      this.lastJumpTime = currentTime
    }
  }

  // High jump with dedicated key
  highJump() {
    if (this.onGround && this.highJumpCharges > 0) {
      this.velocityY = -this.jumpPower * 1.6
      this.highJumpCharges--
      this.onGround = false
    }
  }

  setGravity(gravity: number) {
    this.gravity = gravity
  }

  activatePowerUp(type: string) {
    if (type === "high_jump") {
      this.highJumpCharges++
    } else if (type === "speed_boost") {
      this.speedBoostActive = true
      this.speedBoostTimer = 8000 // 8 seconds
    } else if (type === "shield") {
      this.shieldActive = true
      this.shieldTimer = 15000 // 15 seconds
    }
  }

  getActivePowerUps(): string[] {
    const active = []
    if (this.highJumpCharges > 0) active.push(`HIGH JUMP x${this.highJumpCharges}`)
    if (this.speedBoostActive) active.push("SPEED BOOST")
    if (this.shieldActive) active.push("SHIELD")
    return active
  }

  update(deltaTime: number, platforms: any[], drones: any[] = []) {
    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerabilityTimer -= deltaTime
      if (this.invulnerabilityTimer <= 0) {
        this.invulnerable = false
      }
    }

    // Update power-up timers
    if (this.speedBoostActive) {
      this.speedBoostTimer -= deltaTime
      if (this.speedBoostTimer <= 0) {
        this.speedBoostActive = false
      }
    }

    if (this.shieldActive) {
      this.shieldTimer -= deltaTime
      if (this.shieldTimer <= 0) {
        this.shieldActive = false
      }
    }

    // Apply gravity
    this.velocityY += this.gravity

    // Update position
    this.x += this.velocityX
    this.y += this.velocityY

    // Apply friction
    this.velocityX *= 0.8

    // Check platform collisions
    this.onGround = false
    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        // Landing on top of platform
        if (this.velocityY > 0 && this.y < platform.y) {
          this.y = platform.y - this.height
          this.velocityY = 0
          this.onGround = true
        }
      }
    }

    // Keep player in bounds
    if (this.x < 0) this.x = 0
    if (this.x + this.width > 800) this.x = 800 - this.width

    // Death by falling
    if (this.y > 600) {
      this.takeDamage()
    }
  }

  private checkCollision(platform: any): boolean {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    )
  }

  render(ctx: CanvasRenderingContext2D) {
    // Flash when invulnerable
    if (this.invulnerable && Math.floor(Date.now() / 200) % 2) {
      return // Skip rendering to create flashing effect
    }

    // Draw player with power-up effects
    let playerColor = "#00ff00"
    if (this.shieldActive)
      playerColor = "#ff8800" // Orange shield
    else if (this.speedBoostActive)
      playerColor = "#ffff00" // Yellow speed
    else if (this.highJumpCharges > 0) playerColor = "#00ffff" // Cyan when you have jump charges

    ctx.fillStyle = playerColor
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Add glow effect
    ctx.shadowColor = playerColor
    ctx.shadowBlur = this.shieldActive ? 15 : 10
    ctx.fillStyle = this.shieldActive ? "#ffcc88" : "#88ff88"
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8)
    ctx.shadowBlur = 0

    // Add visual indicator for high jump charges
    if (this.highJumpCharges > 0) {
      ctx.fillStyle = "#00ffff"
      ctx.font = "12px monospace"
      ctx.fillText(`${this.highJumpCharges}`, this.x + this.width + 5, this.y + 15)
    }
  }

  // Returns the rectangle used for collisions
  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  getHighJumpCharges(): number {
    return this.highJumpCharges
  }
}
