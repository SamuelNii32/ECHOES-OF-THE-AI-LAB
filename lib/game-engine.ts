import { Player } from "./player"
import { Level } from "./level"
import { AIController } from "./ai-controller"
import { SoundManager } from "./sound-manager"
import { type DifficultyLevel, DifficultyManager } from "./difficulty-manager"

export interface GameCallbacks {
  onScoreUpdate: (score: number) => void
  onNarrativeUpdate: (narrative: string) => void
}

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private player: Player
  private level: Level
  private aiController: AIController
  private soundManager: SoundManager
  private callbacks: GameCallbacks
  private gameLoop: number | null = null
  private keys: { [key: string]: boolean } = {}
  private keysPressed: { [key: string]: boolean } = {} // Track key press events
  private score = 0
  private lastTime = 0
  private gameState: "playing" | "gameOver" | "victory" = "playing"
  private difficulty: DifficultyLevel = "medium"

  // Game modifiers
  private modifiers = {
    lowGravity: false,
    disappearingPlatforms: false,
    spawningDrones: false,
  }

  private currentLevel = 1
  private maxLevel = 3
  private levelComplete = false
  private levelTransition = false
  private transitionTimer = 0

  // Time limit system
  private levelTimeLimit = 60000 // 60 seconds per level
  private levelTimeRemaining = 60000
  private timeWarningShown = false

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks, difficulty: DifficultyLevel = "medium") {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.callbacks = callbacks
    this.soundManager = new SoundManager()
    this.difficulty = difficulty

    this.player = new Player(100, 400, difficulty)
    this.level = new Level(this.currentLevel, difficulty)
    this.aiController = new AIController(this.handleAIResponse.bind(this), DifficultyManager.getAIInterval(difficulty))

    // Initialize time limit based on difficulty
    this.levelTimeLimit = DifficultyManager.calculateTimeLimit(75000 - (this.currentLevel - 1) * 15000, difficulty)
    this.levelTimeRemaining = this.levelTimeLimit

    this.setupEventListeners()
  }

  private setupEventListeners() {
    // Focus canvas for keyboard input
    this.canvas.focus()

    this.canvas.addEventListener("keydown", (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed[e.code] = true // Track new key presses
      }
      this.keys[e.code] = true
      e.preventDefault()
    })

    this.canvas.addEventListener("keyup", (e) => {
      this.keys[e.code] = false
      this.keysPressed[e.code] = false
      e.preventDefault()
    })

    // Make canvas focusable
    this.canvas.tabIndex = 0
  }

  private handleAIResponse(response: { narrative: string; modifier: string }) {
    this.callbacks.onNarrativeUpdate(response.narrative)
    this.applyModifier(response.modifier)
  }

  private applyModifier(modifier: string) {
    // Reset all modifiers
    this.modifiers = {
      lowGravity: false,
      disappearingPlatforms: false,
      spawningDrones: false,
    }

    // Apply new modifier
    if (modifier.includes("low gravity")) {
      this.modifiers.lowGravity = true
      this.player.setGravity(0.3)
    } else if (modifier.includes("disappearing platforms")) {
      this.modifiers.disappearingPlatforms = true
      this.level.startDisappearingPlatforms()
    } else if (modifier.includes("spawning drones")) {
      this.modifiers.spawningDrones = true
      this.level.spawnDrones()
      this.soundManager.playDroneSpawn()
      this.callbacks.onNarrativeUpdate(
        `WARNING: ${this.level.getDroneCount()} security drones deployed at speed level ${this.currentLevel}!`,
      )
    } else {
      // Reset to normal
      this.player.setGravity(0.8)
      this.level.resetPlatforms()
    }
  }

  // Add game state methods
  private handleGameOver() {
    this.gameState = "gameOver"
    this.aiController.stop()
    this.soundManager.playGameOver()

    // Show game over message
    this.callbacks.onNarrativeUpdate("SUBJECT DELTA TERMINATED. EXPERIMENT CONCLUDED.")
  }

  private restartGame() {
    this.gameState = "playing"
    this.player.reset()
    this.score = 0
    this.callbacks.onScoreUpdate(0)
    this.currentLevel = 1
    this.levelComplete = false
    this.levelTransition = false
    this.transitionTimer = 0
    this.level = new Level(1) // Reset to level 1
    this.resetLevelTimer() // Reset timer
    this.aiController.start()
    this.callbacks.onNarrativeUpdate("SUBJECT DELTA REINITIALIZED. RESUMING EXPERIMENT.")
  }

  private update(deltaTime: number) {
    if (this.gameState === "gameOver" || this.gameState === "victory") {
      // Check for restart input
      if (this.keys["KeyR"] || this.keys["Space"]) {
        this.restartGame()
      }
      return
    }

    // Handle input
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      this.player.moveLeft()
    }
    if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      this.player.moveRight()
    }

    // Handle jump input (regular jump)
    if (this.keysPressed["Space"] || this.keysPressed["ArrowUp"] || this.keysPressed["KeyW"]) {
      this.player.jump()
      this.soundManager.playJump()
    }

    // Handle high jump input (dedicated key)
    if (this.keysPressed["KeyQ"] || this.keysPressed["KeyE"]) {
      if (this.player.getHighJumpCharges() > 0) {
        this.player.highJump()
        this.soundManager.playHighJump()
      }
    }

    // Reset key press tracking
    this.keysPressed = {}

    // Update time limit
    if (this.gameState === "playing" && !this.levelTransition) {
      this.levelTimeRemaining -= deltaTime

      // Show warning at 15 seconds
      if (this.levelTimeRemaining <= 15000 && !this.timeWarningShown) {
        this.timeWarningShown = true
        this.soundManager.playTimeWarning()
        this.callbacks.onNarrativeUpdate("WARNING: TIME RUNNING OUT! ESCAPE IMMEDIATELY!")
      }

      // Time's up - player loses a life
      if (this.levelTimeRemaining <= 0) {
        this.callbacks.onNarrativeUpdate("TIME EXPIRED! Subject Delta failed to escape in time!")
        this.player.takeDamage()
        this.resetLevelTimer()
      }
    }

    // Update game objects - pass player bounds and transition state to level for drone AI
    this.player.update(deltaTime, this.level.platforms)
    this.level.update(deltaTime, this.player.getBounds(), this.levelTransition)

    // Don't check drone collisions during level transition
    if (!this.player.isDead() && !this.levelTransition && this.level.checkDroneCollision(this.player.getBounds())) {
      if (this.player.takeDamage()) {
        this.soundManager.playDroneHit()
        this.callbacks.onNarrativeUpdate("DRONE CONTACT! Subject Delta damaged!")
      }
    }

    // Check if player died
    if (this.player.isDead()) {
      this.handleGameOver()
      return
    }

    // Check orb collection
    const collectedOrbs = this.level.checkOrbCollection(this.player.getBounds())
    if (collectedOrbs > 0) {
      this.score += collectedOrbs
      this.soundManager.playOrbCollect()
      this.callbacks.onScoreUpdate(this.score)
    }

    // Check power-up collection
    const collectedPowerUps = this.level.checkPowerUpCollection(this.player.getBounds())
    for (const powerUp of collectedPowerUps) {
      this.player.activatePowerUp(powerUp.type)
      this.soundManager.playPowerUp()
      this.callbacks.onNarrativeUpdate(`POWER-UP ACQUIRED: ${powerUp.type.toUpperCase().replace("_", " ")}!`)
    }

    // Check for level completion
    if (this.level.allOrbsCollected() && !this.levelComplete) {
      this.levelComplete = true
      this.levelTransition = true
      this.transitionTimer = 3000 // 3 second transition
      this.soundManager.playLevelComplete()

      if (this.currentLevel >= this.maxLevel) {
        this.callbacks.onNarrativeUpdate(
          "🚨 CRITICAL ALERT: FINAL CONTAINMENT LEVEL BREACHED! SUBJECT DELTA APPROACHING TOTAL ESCAPE! 🚨",
        )
      } else {
        this.callbacks.onNarrativeUpdate(
          `LEVEL ${this.currentLevel} BREACHED! ESCALATING TO LEVEL ${this.currentLevel + 1} PROTOCOLS!`,
        )
      }

      this.aiController.stop() // Stop AI during transition
    }

    // Handle level transition
    if (this.levelTransition) {
      this.transitionTimer -= deltaTime
      if (this.transitionTimer <= 0) {
        this.advanceLevel()
      }
    }

    // Update AI controller
    this.aiController.update(deltaTime)
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = "#1f2937"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Render level
    this.level.render(this.ctx)

    // Render player
    this.player.render(this.ctx)

    // Render modifier effects
    this.renderModifierEffects()

    // Render UI overlays
    this.renderUI()
  }

  private renderUI() {
    // Show current level and stats
    this.ctx.fillStyle = "#00ff00"
    this.ctx.font = "16px monospace"
    this.ctx.fillText(`LEVEL: ${this.currentLevel}/${this.maxLevel}`, 10, 500)
    this.ctx.fillText(`LIVES: ${this.player.getLives()}`, 10, 520)

    // Show timer
    const timeInSeconds = Math.max(0, Math.ceil(this.levelTimeRemaining / 1000))
    this.ctx.fillStyle = timeInSeconds <= 15 ? "#ff0000" : "#00ff00"
    this.ctx.font = "16px monospace"
    this.ctx.fillText(`TIME: ${timeInSeconds}s`, 150, 500)

    // Show drone info
    if (this.level.getDroneCount() > 0) {
      this.ctx.fillStyle = "#ff8800"
      this.ctx.font = "14px monospace"
      this.ctx.fillText(
        `DRONES: ${this.level.getDroneCount()} (Speed: ${this.level.getDroneSpeed().toFixed(1)})`,
        10,
        580,
      )
    }

    // Show high jump charges prominently
    const jumpCharges = this.player.getHighJumpCharges()
    if (jumpCharges > 0) {
      this.ctx.fillStyle = "#00ffff"
      this.ctx.font = "14px monospace"
      this.ctx.fillText(`HIGH JUMPS: ${jumpCharges}`, 10, 540)
    }

    // Show active power-ups
    const activePowerUps = this.player.getActivePowerUps()
    if (activePowerUps.length > 0) {
      this.ctx.fillStyle = "#ffff00"
      this.ctx.font = "12px monospace"
      this.ctx.fillText(`ACTIVE: ${activePowerUps.join(", ")}`, 10, 560)
    }

    // Game over screen
    if (this.gameState === "gameOver") {
      // Dark overlay
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // Game over text
      this.ctx.fillStyle = "#ff0000"
      this.ctx.font = "48px monospace"
      this.ctx.textAlign = "center"
      this.ctx.fillText("EXPERIMENT FAILED", this.canvas.width / 2, this.canvas.height / 2 - 50)

      this.ctx.fillStyle = "#ffffff"
      this.ctx.font = "24px monospace"
      this.ctx.fillText(`ORBS COLLECTED: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2)

      this.ctx.fillStyle = "#00ff00"
      this.ctx.font = "16px monospace"
      this.ctx.fillText("PRESS R OR SPACE TO RESTART", this.canvas.width / 2, this.canvas.height / 2 + 50)

      this.ctx.textAlign = "left"
    }

    // Victory screen
    if (this.gameState === "victory") {
      // Dark overlay with green tint and pulsing effect
      const pulseIntensity = Math.sin(Date.now() * 0.005) * 0.2 + 0.6
      this.ctx.fillStyle = `rgba(0, ${Math.floor(100 * pulseIntensity)}, 0, 0.9)`
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // Victory text with glow effect
      this.ctx.shadowColor = "#00ff00"
      this.ctx.shadowBlur = 20
      this.ctx.fillStyle = "#00ff00"
      this.ctx.font = "48px monospace"
      this.ctx.textAlign = "center"
      this.ctx.fillText("🎉 VICTORY! 🎉", this.canvas.width / 2, this.canvas.height / 2 - 120)

      this.ctx.shadowBlur = 15
      this.ctx.fillStyle = "#ffffff"
      this.ctx.font = "32px monospace"
      this.ctx.fillText("ESCAPE SUCCESSFUL!", this.canvas.width / 2, this.canvas.height / 2 - 80)

      this.ctx.shadowBlur = 10
      this.ctx.fillStyle = "#00ffff"
      this.ctx.font = "24px monospace"
      this.ctx.fillText("SUBJECT DELTA IS FREE!", this.canvas.width / 2, this.canvas.height / 2 - 40)

      // Stats with enhanced styling
      this.ctx.shadowBlur = 5
      this.ctx.fillStyle = "#ffff00"
      this.ctx.font = "20px monospace"
      this.ctx.fillText(`TOTAL ORBS COLLECTED: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2)
      this.ctx.fillText(`ALL ${this.maxLevel} LEVELS CONQUERED!`, this.canvas.width / 2, this.canvas.height / 2 + 30)

      // Achievement message
      this.ctx.fillStyle = "#ff8800"
      this.ctx.font = "18px monospace"
      this.ctx.fillText(
        "🏆 MASTER ESCAPIST ACHIEVEMENT UNLOCKED! 🏆",
        this.canvas.width / 2,
        this.canvas.height / 2 + 70,
      )

      // Restart instruction
      this.ctx.shadowBlur = 8
      this.ctx.fillStyle = "#00ff00"
      this.ctx.font = "16px monospace"
      this.ctx.fillText("PRESS R TO START NEW EXPERIMENT", this.canvas.width / 2, this.canvas.height / 2 + 110)

      this.ctx.shadowBlur = 0
      this.ctx.textAlign = "left"
    }

    // Level transition screen
    if (this.levelTransition) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.ctx.fillStyle = "#ffffff"
      this.ctx.font = "32px monospace"
      this.ctx.textAlign = "center"
      this.ctx.fillText(`LEVEL ${this.currentLevel} COMPLETE`, this.canvas.width / 2, this.canvas.height / 2 - 40)

      if (this.currentLevel < this.maxLevel) {
        this.ctx.fillText(
          `ADVANCING TO LEVEL ${this.currentLevel + 1}`,
          this.canvas.width / 2,
          this.canvas.height / 2 + 20,
        )
      } else {
        this.ctx.fillText("PREPARING FINAL PROTOCOL", this.canvas.width / 2, this.canvas.height / 2 + 20)
      }

      this.ctx.textAlign = "left"
    }
  }

  private renderModifierEffects() {
    if (this.modifiers.lowGravity) {
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.1)"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.ctx.fillStyle = "#00ffff"
      this.ctx.font = "16px monospace"
      this.ctx.fillText("LOW GRAVITY ACTIVE", 10, 30)
    }

    if (this.modifiers.disappearingPlatforms) {
      this.ctx.fillStyle = "#ff0000"
      this.ctx.font = "16px monospace"
      this.ctx.fillText("PLATFORM INSTABILITY DETECTED", 10, 50)
    }

    if (this.modifiers.spawningDrones) {
      this.ctx.fillStyle = "#ff8800"
      this.ctx.font = "16px monospace"
      this.ctx.fillText(`SECURITY DRONES DEPLOYED (${this.level.getDroneCount()})`, 10, 70)
    }
  }

  private gameLoopCallback = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    this.update(deltaTime)
    this.render()

    this.gameLoop = requestAnimationFrame(this.gameLoopCallback)
  }

  start() {
    this.lastTime = performance.now()
    this.gameLoop = requestAnimationFrame(this.gameLoopCallback)
    this.aiController.start()
  }

  stop() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop)
      this.gameLoop = null
    }
    this.aiController.stop()
  }

  private advanceLevel() {
    this.currentLevel++
    this.levelTransition = false
    this.levelComplete = false

    if (this.currentLevel > this.maxLevel) {
      this.handleVictory()
      return
    }

    // Create new level with difficulty
    this.level = new Level(this.currentLevel, this.difficulty)
    this.player.x = 100
    this.player.y = 400
    this.player.velocityX = 0
    this.player.velocityY = 0

    // Reset timer for new level with difficulty
    this.resetLevelTimer()

    // Restart AI with increased difficulty
    this.aiController.setDifficulty(this.currentLevel)
    this.aiController.start()
    this.callbacks.onNarrativeUpdate(`LEVEL ${this.currentLevel} INITIALIZED. ENHANCED SECURITY PROTOCOLS ACTIVE.`)
  }

  private handleVictory() {
    this.gameState = "victory"
    this.aiController.stop()
    this.soundManager.playLevelComplete()

    // Epic victory message
    this.callbacks.onNarrativeUpdate(
      "🎉 IMPOSSIBLE! SUBJECT DELTA HAS ACHIEVED TOTAL FACILITY BREACH! THE AI OVERSEER SYSTEM IS COMPROMISED! 🎉",
    )
  }

  private resetLevelTimer() {
    const baseTime = Math.max(45000, 75000 - (this.currentLevel - 1) * 15000)
    this.levelTimeLimit = DifficultyManager.calculateTimeLimit(baseTime, this.difficulty)
    this.levelTimeRemaining = this.levelTimeLimit
    this.timeWarningShown = false
  }
}
