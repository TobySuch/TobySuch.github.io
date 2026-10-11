import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import type { Move } from 'chess.js'

interface MoveListProps {
  history: Move[]
}

export function MoveList({ history }: MoveListProps) {
  // Only affects small screens: the list is always shown from the lg breakpoint up.
  const [expanded, setExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll the list itself (not the page) so the latest move stays visible.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history.length, expanded])

  const rows: { number: number; white: string; black?: string }[] = []
  for (let i = 0; i < history.length; i += 2) {
    rows.push({ number: i / 2 + 1, white: history[i].san, black: history[i + 1]?.san })
  }

  return (
    <div className="w-full lg:w-48 flex flex-col rounded-lg bg-slate-900 border border-slate-800">
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="chess-move-list"
        className="lg:hidden flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-300 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
      >
        <span>
          Moves
          {history.length > 0 && <span className="ml-2 font-mono font-normal text-slate-500">{history.at(-1)!.san}</span>}
        </span>
        <span aria-hidden className={clsx('inline-block text-slate-500 transition-transform', expanded && 'rotate-180')}>▾</span>
      </button>

      <div
        id="chess-move-list"
        ref={scrollRef}
        className={clsx(
          'overflow-y-auto p-2 h-32 lg:h-auto lg:max-h-[min(70vh,560px)] lg:block',
          expanded ? 'block border-t border-slate-800 lg:border-t-0' : 'hidden',
        )}
      >
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-2">No moves yet</p>
        ) : (
          <ol className="text-sm font-mono">
            {rows.map(row => (
              <li key={row.number} className="grid grid-cols-[2.5rem_1fr_1fr] gap-1 px-1 py-0.5 odd:bg-slate-800/40 rounded">
                <span className="text-slate-500">{row.number}.</span>
                <span className="text-slate-100">{row.white}</span>
                <span className="text-slate-300">{row.black ?? ''}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
