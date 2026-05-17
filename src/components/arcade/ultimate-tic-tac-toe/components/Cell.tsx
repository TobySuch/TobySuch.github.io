import { clsx } from 'clsx'
import type { CellValue } from '../game/gameLogic'

interface CellProps {
  value: CellValue
  boardIdx: number
  cellIdx: number
  isLegal: boolean
  onClick: () => void
}

export function Cell({ value, boardIdx, cellIdx, isLegal, onClick }: CellProps) {
  const disabled = !isLegal || value !== null

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Play in board ${boardIdx + 1}, cell ${cellIdx + 1}`}
      className={clsx(
        'w-full aspect-square flex items-center justify-center',
        'text-3xl font-black rounded-sm transition-colors bg-slate-800 leading-none',
        'focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1',
        value === 'X' && 'text-emerald-400',
        value === 'O' && 'text-rose-400',
        !disabled && !value && 'hover:bg-slate-600 cursor-pointer',
        disabled && 'cursor-default',
      )}
    >
      {value}
    </button>
  )
}
