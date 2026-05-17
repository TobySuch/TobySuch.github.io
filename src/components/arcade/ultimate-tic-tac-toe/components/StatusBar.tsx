import { clsx } from 'clsx'
import type { GameState } from '../game/gameLogic'

interface StatusBarProps {
  state: GameState
  onReset: () => void
}

export function StatusBar({ state, onReset }: StatusBarProps) {
  const { gameResult, currentPlayer } = state

  return (
    <div aria-live="polite" className="text-center min-h-[4rem] flex flex-col items-center justify-center gap-3">
      {gameResult === null ? (
        <p className="text-lg font-semibold text-slate-200">
          <span
            className={clsx(
              'font-black text-xl',
              currentPlayer === 'X' ? 'text-emerald-400' : 'text-rose-400',
            )}
          >
            {currentPlayer}
          </span>
          {''}'s turn
        </p>
      ) : (
        <>
          <p className="text-xl font-bold text-white">
            {gameResult === 'draw' ? "It's a draw!" : (
              <>
                <span className={clsx(
                  'font-black',
                  gameResult === 'X' ? 'text-emerald-400' : 'text-rose-400',
                )}>
                  {gameResult}
                </span>
                {' wins!'}
              </>
            )}
          </p>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
          >
            Play again
          </button>
        </>
      )}
    </div>
  )
}
