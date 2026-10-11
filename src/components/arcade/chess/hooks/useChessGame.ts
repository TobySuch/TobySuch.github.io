import { useState, useCallback, useEffect, useRef } from 'react'
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js'
import { ENGINE_ENABLED } from '../engine/featureFlag'
import { getEngineMove } from '../engine/engineClient'

export type GameMode = 'two-player' | 'vs-engine'

export type ResultReason =
  | 'checkmate'
  | 'stalemate'
  | 'insufficient-material'
  | 'threefold-repetition'
  | 'fifty-move-rule'
  | 'resignation'

export interface GameResult {
  winner: Color | 'draw'
  reason: ResultReason
}

export type PromotionPiece = Extract<PieceSymbol, 'q' | 'r' | 'b' | 'n'>

export interface UseChessGameReturn {
  fen: string
  turn: Color
  inCheck: boolean
  history: Move[]
  lastMove: Move | null
  result: GameResult | null
  mode: GameMode
  humanColor: Color
  orientation: Color
  isEngineThinking: boolean
  engineError: string | null
  canHumanMove: boolean
  canUndo: boolean
  start: (mode: GameMode, humanColor: Color) => void
  tryMove: (from: Square, to: Square, promotion?: PromotionPiece) => boolean
  needsPromotion: (from: Square, to: Square) => boolean
  legalMovesFrom: (square: Square) => Move[]
  kingSquare: (color: Color) => Square | null
  undo: () => void
  resign: () => void
  reset: () => void
  flip: () => void
  retryEngine: () => void
}

const other = (c: Color): Color => (c === 'w' ? 'b' : 'w')

function detectResult(chess: Chess): GameResult | null {
  // Checkmate is reported against the side to move, so the winner is the side that just moved.
  if (chess.isCheckmate()) return { winner: other(chess.turn()), reason: 'checkmate' }
  if (chess.isStalemate()) return { winner: 'draw', reason: 'stalemate' }
  if (chess.isInsufficientMaterial()) return { winner: 'draw', reason: 'insufficient-material' }
  if (chess.isThreefoldRepetition()) return { winner: 'draw', reason: 'threefold-repetition' }
  if (chess.isDrawByFiftyMoves()) return { winner: 'draw', reason: 'fifty-move-rule' }
  return null
}

function safeMove(chess: Chess, from: string, to: string, promotion?: string): Move | null {
  try {
    return chess.move(promotion ? { from, to, promotion } : { from, to })
  } catch {
    // chess.js v1 throws on illegal moves
    return null
  }
}

export function useChessGame(): UseChessGameReturn {
  const [chess] = useState(() => new Chess())
  // chess.js mutates in place; bump this to re-render after each mutation.
  const [version, setVersion] = useState(0)
  const bump = useCallback(() => setVersion(v => v + 1), [])

  const [mode, setMode] = useState<GameMode>('two-player')
  const [humanColor, setHumanColor] = useState<Color>('w')
  const [orientation, setOrientation] = useState<Color>('w')
  const [resignedBy, setResignedBy] = useState<Color | null>(null)
  const [isEngineThinking, setIsEngineThinking] = useState(false)
  const [engineError, setEngineError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const engineColor = other(humanColor)
  const vsEngine = ENGINE_ENABLED && mode === 'vs-engine'
  const turn = chess.turn()
  const history = chess.history({ verbose: true })
  const result: GameResult | null = resignedBy
    ? { winner: other(resignedBy), reason: 'resignation' }
    : detectResult(chess)

  const canHumanMove = result === null && !isEngineThinking && (!vsEngine || turn === humanColor)
  // In vs-engine, undo must be able to rewind to a position where the human is to move.
  const minHistoryForUndo = vsEngine && engineColor === 'w' ? 2 : 1
  const canUndo = result === null && !isEngineThinking && history.length >= minHistoryForUndo

  const cancelEngine = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsEngineThinking(false)
    setEngineError(null)
  }, [])

  useEffect(() => () => abortRef.current?.abort(), [])

  // Ask the engine for a move whenever it's its turn.
  useEffect(() => {
    if (!vsEngine || turn !== engineColor || result !== null || isEngineThinking || engineError) return

    const controller = new AbortController()
    abortRef.current = controller
    const requestFen = chess.fen()
    setIsEngineThinking(true)

    getEngineMove(requestFen, controller.signal)
      .then(uci => {
        if (controller.signal.aborted || chess.fen() !== requestFen) return
        const applied = safeMove(chess, uci.slice(0, 2), uci.slice(2, 4), uci[4])
        if (!applied) setEngineError(`Engine returned an illegal move (${uci})`)
        bump()
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setEngineError(err instanceof Error ? err.message : 'Engine request failed')
      })
      .finally(() => {
        if (abortRef.current === controller) {
          abortRef.current = null
          setIsEngineThinking(false)
        }
      })
  // `turn` and `result` are derived from `chess`, which changes with `version`.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, vsEngine, engineColor, isEngineThinking, engineError])

  const tryMove = useCallback((from: Square, to: Square, promotion?: PromotionPiece) => {
    if (!canHumanMove) return false
    const move = safeMove(chess, from, to, promotion)
    if (move) bump()
    return move !== null
  }, [chess, canHumanMove, bump])

  const needsPromotion = useCallback((from: Square, to: Square) => (
    chess.moves({ square: from, verbose: true }).some(m => m.to === to && m.promotion)
  ), [chess, version]) // eslint-disable-line react-hooks/exhaustive-deps

  const legalMovesFrom = useCallback((square: Square) => (
    chess.moves({ square, verbose: true })
  ), [chess, version]) // eslint-disable-line react-hooks/exhaustive-deps

  const kingSquare = useCallback((color: Color) => (
    chess.findPiece({ type: 'k', color })[0] ?? null
  ), [chess, version]) // eslint-disable-line react-hooks/exhaustive-deps

  const undo = useCallback(() => {
    if (!canUndo) return
    cancelEngine()
    chess.undo()
    // Against the engine, keep rewinding until it's the human's move again.
    while (vsEngine && chess.turn() === engineColor && chess.history().length > 0) {
      chess.undo()
    }
    bump()
  }, [chess, canUndo, vsEngine, engineColor, cancelEngine, bump])

  const resign = useCallback(() => {
    if (result !== null) return
    cancelEngine()
    setResignedBy(vsEngine ? humanColor : turn)
  }, [result, vsEngine, humanColor, turn, cancelEngine])

  const reset = useCallback(() => {
    cancelEngine()
    chess.reset()
    setResignedBy(null)
    bump()
  }, [chess, cancelEngine, bump])

  const start = useCallback((m: GameMode, color: Color) => {
    reset()
    setMode(m)
    setHumanColor(m === 'vs-engine' ? color : 'w')
    setOrientation(m === 'vs-engine' ? color : 'w')
  }, [reset])

  const flip = useCallback(() => setOrientation(o => other(o)), [])
  const retryEngine = useCallback(() => setEngineError(null), [])

  return {
    fen: chess.fen(),
    turn,
    inCheck: chess.inCheck(),
    history,
    lastMove: history.at(-1) ?? null,
    result,
    mode,
    humanColor,
    orientation,
    isEngineThinking,
    engineError,
    canHumanMove,
    canUndo,
    start,
    tryMove,
    needsPromotion,
    legalMovesFrom,
    kingSquare,
    undo,
    resign,
    reset,
    flip,
    retryEngine,
  }
}
