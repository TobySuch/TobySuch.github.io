import { clsx } from 'clsx'
import type { Color } from 'chess.js'
import type { GameResult, ResultReason } from '../hooks/useChessGame'

interface StatusBarProps {
  turn: Color
  inCheck: boolean
  result: GameResult | null
  isEngineThinking: boolean
  engineError: string | null
  onRetryEngine: () => void
  onPlayAgain: () => void
}

const COLOR_NAME: Record<Color, string> = { w: 'White', b: 'Black' }

const DRAW_REASON: Partial<Record<ResultReason, string>> = {
  'stalemate': 'Stalemate',
  'insufficient-material': 'Insufficient material',
  'threefold-repetition': 'Threefold repetition',
  'fifty-move-rule': 'Fifty-move rule',
}

function ColorName({ color }: { color: Color }) {
  return (
    <span className={clsx('font-black', color === 'w' ? 'text-slate-100' : 'text-slate-400')}>
      {COLOR_NAME[color]}
    </span>
  )
}

export function StatusBar({ turn, inCheck, result, isEngineThinking, engineError, onRetryEngine, onPlayAgain }: StatusBarProps) {
  if (result) {
    return (
      <div aria-live="polite" className="text-center min-h-[4rem] flex flex-col items-center justify-center gap-3">
        <p className="text-xl font-bold text-white">
          {result.winner === 'draw' ? (
            <>Draw · <span className="text-slate-300">{DRAW_REASON[result.reason]}</span></>
          ) : (
            <>
              <ColorName color={result.winner} /> wins
              <span className="text-slate-400 font-semibold">
                {' · '}{result.reason === 'checkmate' ? 'Checkmate' : `${COLOR_NAME[result.winner === 'w' ? 'b' : 'w']} resigned`}
              </span>
            </>
          )}
        </p>
        <button
          onClick={onPlayAgain}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
        >
          Play again
        </button>
      </div>
    )
  }

  return (
    <div aria-live="polite" className="text-center min-h-[4rem] flex flex-col items-center justify-center gap-2">
      {engineError ? (
        <>
          <p className="text-sm font-semibold text-rose-400">{engineError}</p>
          <button
            onClick={onRetryEngine}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
          >
            Retry
          </button>
        </>
      ) : isEngineThinking ? (
        <p className="text-lg font-semibold text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          Computer is thinking...
        </p>
      ) : (
        <p className="text-lg font-semibold text-slate-200">
          <ColorName color={turn} /> to move
          {inCheck && <span className="ml-2 text-rose-400 font-bold">Check!</span>}
        </p>
      )}
    </div>
  )
}
