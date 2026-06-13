import { useState, useCallback, useEffect, useRef } from 'react'
import {
  type GameState,
  type Player,
  createInitialState,
  applyMove,
  getLegalMoves,
  isTerminal,
} from '../game/gameLogic'

export interface UseGameReturn {
  state: GameState
  mode: 'two-player' | 'vs-ai'
  aiPlayer: Player
  aiIterations: number
  aiEpsilon: number
  isAiThinking: boolean
  makeMove: (boardIdx: number, cellIdx: number) => void
  resetGame: () => void
  setMode: (mode: 'two-player' | 'vs-ai') => void
  setAiParams: (iterations: number, epsilon: number) => void
}

const AI_PLAYER: Player = 'O'

function createWorker(): Worker {
  return new Worker(new URL('../game/mcts.worker.ts', import.meta.url), { type: 'module' })
}

export function useGame(): UseGameReturn {
  const [state, setState] = useState<GameState>(createInitialState)
  const [mode, setModeState] = useState<'two-player' | 'vs-ai'>('two-player')
  const [aiIterations, setAiIterationsState] = useState<number>(2000)
  const [aiEpsilon, setAiEpsilonState] = useState<number>(0)
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = createWorker()
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // Trigger AI move when it becomes the AI's turn
  useEffect(() => {
    if (
      mode !== 'vs-ai' ||
      state.currentPlayer !== AI_PLAYER ||
      isTerminal(state) ||
      isAiThinking
    ) return

    const worker = workerRef.current
    if (!worker) return

    setIsAiThinking(true)

    worker.onmessage = (e: MessageEvent<{ move: [number, number] }>) => {
      const [b, c] = e.data.move
      setState(prev => {
        const legal = getLegalMoves(prev)
        if (!legal.some(([lb, lc]) => lb === b && lc === c)) return prev
        return applyMove(prev, b, c)
      })
      setIsAiThinking(false)
    }

    worker.postMessage({ state, iterations: aiIterations, epsilon: aiEpsilon })
  // aiIterations intentionally omitted: difficulty can't change mid-game in the current UI
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, mode, isAiThinking])

  const makeMove = useCallback((boardIdx: number, cellIdx: number) => {
    if (isAiThinking) return
    setState(prev => {
      const legal = getLegalMoves(prev)
      if (!legal.some(([b, c]) => b === boardIdx && c === cellIdx)) return prev
      return applyMove(prev, boardIdx, cellIdx)
    })
  }, [isAiThinking])

  const resetGame = useCallback(() => {
    // Terminate old worker to cancel any in-flight computation
    workerRef.current?.terminate()
    workerRef.current = createWorker()
    setIsAiThinking(false)
    setState(createInitialState())
  }, [])

  const setMode = useCallback((m: 'two-player' | 'vs-ai') => {
    setModeState(m)
  }, [])

  const setAiParams = useCallback((iterations: number, epsilon: number) => {
    setAiIterationsState(iterations)
    setAiEpsilonState(epsilon)
  }, [])

  return {
    state,
    mode,
    aiPlayer: AI_PLAYER,
    aiIterations,
    aiEpsilon,
    isAiThinking,
    makeMove,
    resetGame,
    setMode,
    setAiParams,
  }
}
