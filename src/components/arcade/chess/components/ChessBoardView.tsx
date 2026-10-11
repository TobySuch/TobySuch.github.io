import { useState, useEffect, type CSSProperties } from 'react'
import { Chessboard } from 'react-chessboard'
import type { Square } from 'chess.js'
import type { PromotionPiece, UseChessGameReturn } from '../hooks/useChessGame'
import { PromotionDialog } from './PromotionDialog'

interface ChessBoardViewProps {
  game: UseChessGameReturn
}

const LAST_MOVE_STYLE: CSSProperties = { backgroundColor: 'rgba(250, 204, 21, 0.4)' }
const SELECTED_STYLE: CSSProperties = { backgroundColor: 'rgba(96, 165, 250, 0.5)' }
const CHECK_STYLE: CSSProperties = {
  background: 'radial-gradient(circle, rgba(244, 63, 94, 0.9) 0%, rgba(244, 63, 94, 0.5) 40%, transparent 75%)',
}
const TARGET_STYLE: CSSProperties = {
  background: 'radial-gradient(circle, rgba(15, 23, 42, 0.35) 22%, transparent 24%)',
}
const CAPTURE_STYLE: CSSProperties = {
  background: 'radial-gradient(circle, transparent 62%, rgba(15, 23, 42, 0.35) 64%)',
}

export function ChessBoardView({ game }: ChessBoardViewProps) {
  const [selected, setSelected] = useState<Square | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null)

  // Any position change (either side moving, undo, reset) invalidates the selection.
  useEffect(() => {
    setSelected(null)
    setPendingPromotion(null)
  }, [game.fen])

  const targets = selected ? game.legalMovesFrom(selected) : []

  const attemptMove = (from: Square, to: Square): boolean => {
    if (game.needsPromotion(from, to)) {
      setPendingPromotion({ from, to })
      // Snap the piece back; the dialog completes the move.
      return false
    }
    const ok = game.tryMove(from, to)
    setSelected(null)
    return ok
  }

  const isOwnPiece = (pieceType: string | undefined) => (
    !!pieceType && game.canHumanMove && pieceType[0] === game.turn
  )

  const squareStyles: Record<string, CSSProperties> = {}
  if (game.lastMove) {
    squareStyles[game.lastMove.from] = LAST_MOVE_STYLE
    squareStyles[game.lastMove.to] = LAST_MOVE_STYLE
  }
  if (game.inCheck) {
    const king = game.kingSquare(game.turn)
    if (king) squareStyles[king] = { ...squareStyles[king], ...CHECK_STYLE }
  }
  if (selected) squareStyles[selected] = SELECTED_STYLE
  for (const m of targets) {
    squareStyles[m.to] = { ...squareStyles[m.to], ...(m.captured ? CAPTURE_STYLE : TARGET_STYLE) }
  }

  return (
    <div className="relative w-full">
      <Chessboard
        options={{
          id: 'arcade-chess',
          position: game.fen,
          boardOrientation: game.orientation === 'w' ? 'white' : 'black',
          squareStyles,
          lightSquareStyle: { backgroundColor: '#e2e8f0' },
          darkSquareStyle: { backgroundColor: '#7c8ca5' },
          boardStyle: { borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
          allowDragging: game.canHumanMove,
          allowDrawingArrows: true,
          canDragPiece: ({ piece }) => isOwnPiece(piece.pieceType),
          onPieceDrag: ({ square }) => setSelected(square as Square | null),
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!targetSquare || sourceSquare === targetSquare) return false
            return attemptMove(sourceSquare as Square, targetSquare as Square)
          },
          onSquareClick: ({ piece, square }) => {
            const sq = square as Square
            if (selected && targets.some(m => m.to === sq)) {
              attemptMove(selected, sq)
            } else if (isOwnPiece(piece?.pieceType) && sq !== selected) {
              setSelected(sq)
            } else {
              setSelected(null)
            }
          },
        }}
      />
      {pendingPromotion && (
        <PromotionDialog
          color={game.turn}
          onSelect={(piece: PromotionPiece) => {
            game.tryMove(pendingPromotion.from, pendingPromotion.to, piece)
            setPendingPromotion(null)
            setSelected(null)
          }}
          onCancel={() => setPendingPromotion(null)}
        />
      )}
    </div>
  )
}
