import { clsx } from 'clsx'
import type { CellValue, BoardResult } from '../game/gameLogic'
import { Cell } from './Cell'

interface MiniBoardProps {
  boardIdx: number
  cells: CellValue[]
  result: BoardResult
  isActive: boolean
  isFreeMove: boolean
  legalCells: number[]
  onCellClick: (cellIdx: number) => void
}

function MiniBoardOverlay({ result }: { result: NonNullable<BoardResult> }) {
  return (
    <div
      className={clsx(
        'absolute inset-0 flex items-center justify-center rounded',
        'text-5xl font-black bg-slate-950/85',
        result === 'X' && 'text-emerald-400',
        result === 'O' && 'text-rose-400',
        result === 'draw' && 'text-slate-500',
      )}
      aria-hidden="true"
    >
      {result === 'draw' ? '—' : result}
    </div>
  )
}

export function MiniBoard({
  boardIdx,
  cells,
  result,
  isActive,
  isFreeMove,
  legalCells,
  onCellClick,
}: MiniBoardProps) {
  return (
    <div
      className={clsx(
        'relative grid grid-cols-3 gap-0.5 bg-slate-700 p-0.5 rounded',
        'border border-slate-600/60',
        isActive && !isFreeMove && 'ring-2 ring-blue-400',
        isActive && isFreeMove && 'ring-1 ring-blue-400/50',
        !isActive && result === null && 'opacity-60',
      )}
    >
      {cells.map((val, cellIdx) => (
        <Cell
          key={cellIdx}
          value={val}
          boardIdx={boardIdx}
          cellIdx={cellIdx}
          isLegal={isActive && result === null && legalCells.includes(cellIdx)}
          onClick={() => onCellClick(cellIdx)}
        />
      ))}
      {result !== null && <MiniBoardOverlay result={result} />}
    </div>
  )
}
