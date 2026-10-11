import { useState, useEffect } from 'react'
import { useChessGame } from '../hooks/useChessGame'
import { ModeSelector } from './ModeSelector'
import { ChessBoardView } from './ChessBoardView'
import { StatusBar } from './StatusBar'
import { MoveList } from './MoveList'
import { trackGameStart, trackGameQuit, trackGameComplete } from '../utils/analytics'

const controlClass =
  'px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 ' +
  'focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2'

export function Game() {
  const game = useChessGame()
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (gameStarted && game.result !== null) {
      trackGameComplete(game.mode, game.humanColor, game.result)
    }
  // Only fire on the transition into a finished game.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.result?.winner, game.result?.reason])

  const handleMenu = () => {
    if (gameStarted && game.result === null && game.history.length > 0) {
      trackGameQuit(game.mode, game.history.length)
    }
    game.reset()
    setGameStarted(false)
  }

  const handlePlayAgain = () => {
    game.start(game.mode, game.humanColor)
    trackGameStart(game.mode, game.humanColor)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <ModeSelector onStart={(mode, humanColor) => {
          game.start(mode, humanColor)
          trackGameStart(mode, humanColor)
          setGameStarted(true)
        }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4 p-4 pb-12">
      <StatusBar
        turn={game.turn}
        inCheck={game.inCheck}
        result={game.result}
        isEngineThinking={game.isEngineThinking}
        engineError={game.engineError}
        onRetryEngine={game.retryEngine}
        onPlayAgain={handlePlayAgain}
      />

      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-4">
        <div style={{ width: 'min(92vw, 70vh, 560px)' }}>
          <ChessBoardView game={game} />
        </div>
        <MoveList history={game.history} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={game.flip} className={controlClass}>Flip board</button>
        <button onClick={game.undo} disabled={!game.canUndo} className={controlClass}>Undo</button>
        <button onClick={game.resign} disabled={game.result !== null} className={controlClass}>Resign</button>
      </div>

      <button
        onClick={handleMenu}
        className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2 rounded"
      >
        ← Menu
      </button>
    </div>
  )
}
