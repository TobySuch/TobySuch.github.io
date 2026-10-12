import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { Chess } from 'chess.js'
import type { EngineAnalysis } from '../hooks/useChessGame'

interface EngineAnalysisPanelProps {
  analysis: EngineAnalysis | null
}

// Render a UCI line as numbered SAN ("12... e5 13. Rc1 Nb8"), falling back to raw UCI
// from the first move chess.js rejects.
function formatLine(fen: string, uciMoves: string[]): string {
  const chess = new Chess(fen)
  const parts: string[] = []
  for (let i = 0; i < uciMoves.length; i++) {
    const uci = uciMoves[i]
    const moveNumber = chess.moveNumber()
    const white = chess.turn() === 'w'
    let san: string
    try {
      san = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san
    } catch {
      parts.push(...uciMoves.slice(i))
      break
    }
    if (white) parts.push(`${moveNumber}.`)
    else if (i === 0) parts.push(`${moveNumber}...`)
    parts.push(san)
  }
  return parts.join(' ')
}

const formatCentipawns = (cp: number) => `${cp >= 0 ? '+' : '−'}${(Math.abs(cp) / 100).toFixed(2)}`
const formatPercent = (x: number) => `${(x * 100).toFixed(1)}%`

export function EngineAnalysisPanel({ analysis }: EngineAnalysisPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const lines = useMemo(() => {
    if (!analysis) return []
    // The engine reports evaluations for the side to move; flip them so they're always from White's view.
    const sign = new Chess(analysis.fen).turn() === 'w' ? 1 : -1
    return analysis.lines.map(line => ({
      text: formatLine(analysis.fen, line.moves),
      played: line.moves[0] === analysis.move,
      centipawns: sign * line.evaluation.centipawns,
      whiteWinRate: sign === 1 ? line.evaluation.winRate : 1 - line.evaluation.winRate,
    }))
  }, [analysis])

  return (
    <div className="w-full max-w-xl rounded-lg bg-slate-900 border border-slate-800">
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="chess-engine-analysis"
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-300 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
      >
        <span>Engine analysis</span>
        <span aria-hidden className={clsx('inline-block text-slate-500 transition-transform', expanded && 'rotate-180')}>▾</span>
      </button>

      {expanded && (
        <div id="chess-engine-analysis" className="border-t border-slate-800 p-2">
          {lines.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-2">
              {analysis ? 'The engine returned no lines' : 'No analysis yet — the computer hasn’t moved'}
            </p>
          ) : (
            <>
              <ol className="flex flex-col gap-1">
                {lines.map((line, i) => (
                  <li
                    key={i}
                    className={clsx(
                      'grid grid-cols-[1.5rem_1fr] gap-x-2 gap-y-1 px-2 py-1.5 rounded text-sm',
                      line.played ? 'bg-blue-950/60 ring-1 ring-blue-800' : 'odd:bg-slate-800/40',
                    )}
                  >
                    <span className="text-slate-500 font-mono">{i + 1}.</span>
                    <span className="font-mono text-slate-100 break-words">
                      {line.text}
                      {line.played && <span className="ml-2 font-sans text-xs font-semibold text-blue-300">played</span>}
                    </span>
                    <span className="col-start-2 flex flex-wrap gap-x-4 text-xs text-slate-400">
                      <span>
                        Eval <span className="font-mono text-slate-200">{formatCentipawns(line.centipawns)}</span>
                      </span>
                      <span>
                        White win rate <span className="font-mono text-slate-200">{formatPercent(line.whiteWinRate)}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 px-2 text-xs text-slate-500">
                Evaluations are from White’s point of view, for the position before the computer’s last move.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
