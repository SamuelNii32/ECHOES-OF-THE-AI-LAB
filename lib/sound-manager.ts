export class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled = true

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.warn("Audio not supported")
      this.enabled = false
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = "square"): OscillatorNode | null {
    if (!this.audioContext || !this.enabled) return null

    const oscillator = this.audioContext.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    return oscillator
  }

  private createGain(volume = 0.1): GainNode | null {
    if (!this.audioContext || !this.enabled) return null

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    return gainNode
  }

  playJump() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(400, "sine")
    const gainNode = this.createGain(0.1)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Quick frequency sweep up
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.15)
  }

  playHighJump() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(500, "sine")
    const gainNode = this.createGain(0.15)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Higher pitch sweep
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.25)
  }

  playOrbCollect() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(800, "sine")
    const gainNode = this.createGain(0.08)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Pleasant chime
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  playPowerUp() {
    if (!this.audioContext || !this.enabled) return

    // Multi-tone power-up sound
    const frequencies = [600, 800, 1000, 1200]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.createOscillator(freq, "sine")
        const gainNode = this.createGain(0.06)

        if (!oscillator || !gainNode) return

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.1)

        oscillator.start()
        oscillator.stop(this.audioContext!.currentTime + 0.1)
      }, index * 50)
    })
  }

  playDroneHit() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(200, "sawtooth")
    const gainNode = this.createGain(0.12)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Harsh damage sound
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  playDroneSpawn() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(150, "sawtooth")
    const gainNode = this.createGain(0.1)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Menacing drone spawn
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.5)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  playLevelComplete() {
    if (!this.audioContext || !this.enabled) return

    // Victory fanfare
    const melody = [523, 659, 784, 1047] // C, E, G, C
    melody.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.createOscillator(freq, "sine")
        const gainNode = this.createGain(0.1)

        if (!oscillator || !gainNode) return

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3)

        oscillator.start()
        oscillator.stop(this.audioContext!.currentTime + 0.3)
      }, index * 200)
    })
  }

  playGameOver() {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.createOscillator(300, "sawtooth")
    const gainNode = this.createGain(0.15)

    if (!oscillator || !gainNode) return

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Descending game over sound
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 1.0)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 1.0)
  }

  playTimeWarning() {
    if (!this.audioContext || !this.enabled) return

    // Urgent beeping
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = this.createOscillator(1000, "square")
        const gainNode = this.createGain(0.08)

        if (!oscillator || !gainNode) return

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.1)

        oscillator.start()
        oscillator.stop(this.audioContext!.currentTime + 0.1)
      }, i * 150)
    }
  }
}
