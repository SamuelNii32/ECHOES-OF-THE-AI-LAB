"use client"

import { useEffect, useRef, useState } from "react"
import { Game } from "@/lib/game-engine"
import { Terminal } from "@/components/terminal"
import { GameUI } from "@/components/game-ui"
import { DifficultySelector } from "@/components/difficulty-selector"
import type { DifficultyLevel } from "@/lib/difficulty-manager"

export default function EchoesOfTheAILab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficultySelected, setDifficultySelected] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("medium")
  const [score, setScore] = useState(0)
  const [narrative, setNarrative] = useState("")
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    if (canvasRef.current && gameStarted && difficultySelected) {
      gameRef.current = new Game(
        canvasRef.current,
        {
          onScoreUpdate: setScore,
          onNarrativeUpdate: setNarrative,
        },
        selectedDifficulty,
      )
      gameRef.current.start()

      return () => {
        if (gameRef.current) {
          gameRef.current.stop()
        }
      }
    }
  }, [gameStarted, difficultySelected, selectedDifficulty])

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty)
    setDifficultySelected(true)
    setShowIntro(true) // Show intro after difficulty selection
  }

  const startGame = () => {
    setShowIntro(false)
    setGameStarted(true)
  }

  // Show difficulty selector first
  if (!difficultySelected) {
    return <DifficultySelector onDifficultySelect={handleDifficultySelect} />
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="max-w-2xl p-8 border border-green-400 bg-black/90">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold mb-6 text-green-300">ECHOES OF THE AI LAB</h1>
            <div className="p-4 border border-yellow-400 bg-yellow-400/10 mb-6">
              <p className="text-yellow-300 font-bold">DIFFICULTY: {selectedDifficulty.toUpperCase()}</p>
              <p className="text-sm text-gray-300">
                {selectedDifficulty === "beginner" && "Enhanced containment protocols with extended time limits"}
                {selectedDifficulty === "medium" && "Standard laboratory security measures"}
                {selectedDifficulty === "hard" && "Maximum security protocols - escape at your own risk"}
              </p>
            </div>
            <div className="space-y-2 text-left">
              <p className="typing-animation">{"> SYSTEM INITIALIZING..."}</p>
              <p className="typing-animation delay-1000">{"> SUBJECT DELTA DETECTED"}</p>
              <p className="typing-animation delay-2000">{"> WARNING: CONTAINMENT BREACH IMMINENT"}</p>
              <p className="typing-animation delay-3000">{"> ESCAPE IS NOT PERMITTED"}</p>
              <p className="typing-animation delay-4000">{"> AI OVERSEER: ONLINE"}</p>
              <p className="typing-animation delay-5000">{`> INITIATING ${selectedDifficulty.toUpperCase()} PROTOCOL...`}</p>
            </div>
            <button
              onClick={startGame}
              className="mt-8 px-6 py-3 border border-green-400 bg-transparent text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 font-mono"
            >
              {"> BEGIN ESCAPE SEQUENCE"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Game Canvas */}
        <div className="flex-1 flex items-center justify-center bg-black p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-green-400 bg-gray-800"
            tabIndex={0}
          />
        </div>

        {/* Side Panel */}
        <div className="lg:w-96 flex flex-col">
          <GameUI score={score} difficulty={selectedDifficulty} />
          <Terminal narrative={narrative} />
        </div>
      </div>

      {/* Game Instructions */}
      <div className="absolute top-4 left-4 text-green-400 text-sm">
        <p>ARROW KEYS: Move | SPACE/W/↑: Jump | Q/E: High Jump | ESC: Pause</p>
        <p className="text-yellow-400">DIFFICULTY: {selectedDifficulty.toUpperCase()}</p>
      </div>
    </div>
  )
}
