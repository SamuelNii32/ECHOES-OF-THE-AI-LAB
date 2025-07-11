"use client"

import { useState } from "react"
import { DifficultyManager, type DifficultyLevel } from "@/lib/difficulty-manager"

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: DifficultyLevel) => void
}

export function DifficultySelector({ onDifficultySelect }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null)
  const difficulties = DifficultyManager.getAllDifficulties()

  const handleSelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty)
  }

  const handleConfirm = () => {
    if (selectedDifficulty) {
      onDifficultySelect(selectedDifficulty)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="max-w-4xl p-8 border border-green-400 bg-black/90">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-green-300">ECHOES OF THE AI LAB</h1>

          <div className="space-y-2 mb-8">
            <p className="text-xl text-green-300">{"> SELECT CONTAINMENT PROTOCOL"}</p>
            <p className="text-sm text-green-500">{"> Choose your difficulty level, Subject Delta"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {difficulties.map((diff) => (
              <div
                key={diff.name}
                onClick={() => handleSelect(diff.name as DifficultyLevel)}
                className={`
                  p-6 border-2 cursor-pointer transition-all duration-300 hover:scale-105
                  ${
                    selectedDifficulty === diff.name
                      ? `border-[${diff.color}] bg-[${diff.color}]/10 shadow-lg shadow-[${diff.color}]/20`
                      : "border-gray-600 hover:border-gray-400"
                  }
                `}
                style={{
                  borderColor: selectedDifficulty === diff.name ? diff.color : undefined,
                  backgroundColor: selectedDifficulty === diff.name ? `${diff.color}20` : undefined,
                }}
              >
                <h3 className="text-2xl font-bold mb-4" style={{ color: diff.color }}>
                  {diff.displayName}
                </h3>

                <p className="text-gray-300 mb-4 text-sm">{diff.description}</p>

                <div className="space-y-2 text-xs text-left">
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span style={{ color: diff.color }}>
                      {diff.timeMultiplier > 1 ? "+" : ""}
                      {Math.round((diff.timeMultiplier - 1) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drone Speed:</span>
                    <span style={{ color: diff.color }}>
                      {diff.droneSpeedMultiplier > 1 ? "+" : ""}
                      {Math.round((diff.droneSpeedMultiplier - 1) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drone Count:</span>
                    <span style={{ color: diff.color }}>
                      {diff.droneCountModifier > 0 ? "+" : ""}
                      {diff.droneCountModifier}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lives:</span>
                    <span style={{ color: diff.color }}>{diff.livesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Interference:</span>
                    <span style={{ color: diff.color }}>{diff.aiInterferenceInterval / 1000}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedDifficulty && (
            <div className="space-y-4">
              <div className="p-4 border border-green-400 bg-green-400/10">
                <p className="text-green-300 mb-2">
                  {"> PROTOCOL SELECTED: "}
                  <span
                    className="font-bold"
                    style={{ color: DifficultyManager.getDifficulty(selectedDifficulty).color }}
                  >
                    {DifficultyManager.getDifficulty(selectedDifficulty).displayName}
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  {DifficultyManager.getDifficulty(selectedDifficulty).description}
                </p>
              </div>

              <button
                onClick={handleConfirm}
                className="px-8 py-4 border-2 border-green-400 bg-transparent text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 font-mono text-lg font-bold"
              >
                {"> INITIALIZE EXPERIMENT"}
              </button>
            </div>
          )}

          <div className="mt-8 text-xs text-gray-500 space-y-1">
            <p>{"> ARROW KEYS: Move | SPACE/W/↑: Jump | Q/E: High Jump"}</p>
            <p>{"> Collect all orbs to advance | Avoid drones | Use power-ups wisely"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
