"use client"

import { useEffect, useState } from "react"

interface TerminalProps {
  narrative: string
}

export function Terminal({ narrative }: TerminalProps) {
  const [logs, setLogs] = useState<string[]>([
    "> AI OVERSEER ONLINE",
    "> MONITORING SUBJECT DELTA",
    "> ADAPTIVE PROTOCOLS ENGAGED",
  ])

  useEffect(() => {
    if (narrative) {
      setLogs((prev) => [...prev, `> ${narrative}`].slice(-10)) // Keep last 10 messages
    }
  }, [narrative])

  return (
    <div className="flex-1 bg-black border-l border-green-400 p-4">
      <div className="h-full flex flex-col">
        <div className="border-b border-green-400 pb-2 mb-4">
          <h3 className="text-green-300 font-bold">AI OVERSEER TERMINAL</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className="text-green-400 text-sm animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {log}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-2 border-t border-green-400">
          <div className="text-green-400 text-xs">
            {"> STATUS: MONITORING"}
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  )
}
