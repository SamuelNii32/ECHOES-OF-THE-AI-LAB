import { DifficultyManager, type DifficultyLevel } from "@/lib/difficulty-manager"

interface GameUIProps {
  score: number
  difficulty: DifficultyLevel
}

export function GameUI({ score, difficulty }: GameUIProps) {
  const difficultySettings = DifficultyManager.getDifficulty(difficulty)

  return (
    <div className="bg-gray-800 border-l border-green-400 p-4 border-b">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-green-300 mb-2">ECHOES OF THE AI LAB</h2>
          <div className="text-green-400">SUBJECT: DELTA</div>
          <div className="text-sm font-bold mt-1" style={{ color: difficultySettings.color }}>
            {difficultySettings.displayName} MODE
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-green-400">ORBS COLLECTED:</span>
            <span className="text-green-300 font-bold text-xl">{score}</span>
          </div>

          <div className="w-full bg-gray-700 h-2 rounded">
            <div
              className="bg-green-400 h-2 rounded transition-all duration-300"
              style={{ width: `${Math.min(score * 5, 100)}%` }}
            />
          </div>

          <div className="text-xs text-center text-green-400">
            ESCAPE PROGRESS: {Math.min(Math.floor(score * 5), 100)}%
          </div>
        </div>

        <div className="text-xs text-green-400 space-y-1">
          <div>{"> CONTAINMENT LEVEL: ACTIVE"}</div>
          <div>{"> AI INTERFERENCE: ESCALATING"}</div>
          <div style={{ color: difficultySettings.color }}>{`> PROTOCOL: ${difficultySettings.displayName}`}</div>
          <div className="text-red-400">{`> LIVES: ${difficultySettings.livesCount} MAX`}</div>
          <div className="text-yellow-400">
            {`> TIME BONUS: ${difficultySettings.timeMultiplier > 1 ? "+" : ""}${Math.round((difficultySettings.timeMultiplier - 1) * 100)}%`}
          </div>
          <div className="text-orange-400">
            {`> DRONE SPEED: ${difficultySettings.droneSpeedMultiplier > 1 ? "+" : ""}${Math.round((difficultySettings.droneSpeedMultiplier - 1) * 100)}%`}
          </div>
          <div className="text-cyan-400">{"> HIGH JUMP: Q/E OR DOUBLE-TAP JUMP"}</div>
          <div className="text-green-400">{"> SOUND: ENABLED FOR FULL EXPERIENCE"}</div>
        </div>
      </div>
    </div>
  )
}
