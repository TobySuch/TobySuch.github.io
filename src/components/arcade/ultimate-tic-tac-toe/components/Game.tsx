import { useState, useEffect } from 'react'
import { useGame } from '../hooks/useGame'
import { getLegalMoves } from '../game/gameLogic'
import { ModeSelector } from './ModeSelector'
import { MetaBoard } from './MetaBoard'
import { StatusBar } from './StatusBar'
import { trackGameStart, trackGameQuit, trackGameComplete } from '../utils/analytics'

export function Game() {
  const game = useGame()
  const [gameStarted, setGameStarted] = useState(false)

  const isHumanTurn = game.mode === 'two-player' || game.state.currentPlayer !== game.aiPlayer
  const legalMoves = (isHumanTurn && !game.isAiThinking) ? getLegalMoves(game.state) : []

  useEffect(() => {
    if (gameStarted && game.state.gameResult !== null) {
      trackGameComplete(game.mode, game.aiIterations, game.state.gameResult)
    }
  }, [game.state.gameResult])

  const handleReset = () => {
    if (gameStarted && game.state.gameResult === null) {
      trackGameQuit(game.mode, game.aiIterations)
    }
    game.resetGame()
    setGameStarted(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <ModeSelector onStart={(mode, iterations) => {
          game.setMode(mode)
          game.setAiIterations(iterations)
          trackGameStart(mode, iterations)
          setGameStarted(true)
        }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <StatusBar state={game.state} onReset={handleReset} isAiThinking={game.isAiThinking} />
      <MetaBoard
        state={game.state}
        legalMoves={legalMoves}
        onMove={game.makeMove}
      />
      <button
        onClick={handleReset}
        className="text-sm text-slate-500 hover:text-slate-300 transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2 rounded"
      >
        ← Menu
      </button>
    </div>
  )
}
