import { useState } from 'react'
import { useGame } from '../hooks/useGame'
import { getLegalMoves } from '../game/gameLogic'
import { ModeSelector } from './ModeSelector'
import { MetaBoard } from './MetaBoard'
import { StatusBar } from './StatusBar'

export function Game() {
  const game = useGame()
  const [gameStarted, setGameStarted] = useState(false)

  const legalMoves = getLegalMoves(game.state)

  const handleReset = () => {
    game.resetGame()
    setGameStarted(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <ModeSelector onStart={(mode) => { game.setMode(mode); setGameStarted(true) }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <StatusBar state={game.state} onReset={handleReset} />
      <MetaBoard
        state={game.state}
        legalMoves={legalMoves}
        onMove={game.makeMove}
      />
    </div>
  )
}
