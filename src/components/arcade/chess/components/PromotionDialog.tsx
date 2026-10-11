import { useEffect } from 'react'
import { defaultPieces } from 'react-chessboard'
import type { Color } from 'chess.js'
import type { PromotionPiece } from '../hooks/useChessGame'

interface PromotionDialogProps {
  color: Color
  onSelect: (piece: PromotionPiece) => void
  onCancel: () => void
}

const CHOICES: { piece: PromotionPiece; label: string }[] = [
  { piece: 'q', label: 'Queen' },
  { piece: 'r', label: 'Rook' },
  { piece: 'b', label: 'Bishop' },
  { piece: 'n', label: 'Knight' },
]

export function PromotionDialog({ color, onSelect, onCancel }: PromotionDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/70 rounded-lg"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-label="Choose promotion piece"
        className="flex flex-col items-center gap-3 rounded-xl bg-slate-800 p-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-sm font-semibold text-slate-300">Promote to</p>
        <div className="flex gap-2">
          {CHOICES.map(({ piece, label }, i) => {
            const render = defaultPieces[`${color}${piece.toUpperCase()}`]
            return (
              <button
                key={piece}
                autoFocus={i === 0}
                aria-label={label}
                title={label}
                onClick={() => onSelect(piece)}
                className="w-16 h-16 p-1 rounded-lg bg-slate-200 hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
              >
                {render?.()}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
