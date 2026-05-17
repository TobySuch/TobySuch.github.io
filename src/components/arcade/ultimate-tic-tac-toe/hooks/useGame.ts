import { useState, useCallback } from 'react'
import {
  type GameState,
  type Player,
  createInitialState,
  applyMove,
  getLegalMoves,
} from '../game/gameLogic'

export interface UseGameReturn {
  state: GameState
  mode: 'two-player' | 'vs-ai'
  aiPlayer: Player
  aiIterations: number
  isAiThinking: boolean
  makeMove: (boardIdx: number, cellIdx: number) => void
  resetGame: () => void
  setMode: (mode: 'two-player' | 'vs-ai') => void
  setAiIterations: (n: number) => void
}

export function useGame(): UseGameReturn {
  const [state, setState] = useState<GameState>(createInitialState)
  const [mode, setModeState] = useState<'two-player' | 'vs-ai'>('two-player')

  const makeMove = useCallback((boardIdx: number, cellIdx: number) => {
    setState(prev => {
      const legal = getLegalMoves(prev)
      if (!legal.some(([b, c]) => b === boardIdx && c === cellIdx)) return prev
      return applyMove(prev, boardIdx, cellIdx)
    })
  }, [])

  const resetGame = useCallback(() => {
    setState(createInitialState())
  }, [])

  const setMode = useCallback((m: 'two-player' | 'vs-ai') => {
    setModeState(m)
  }, [])

  const setAiIterations = useCallback((_n: number) => {
    // placeholder — AI not implemented yet
  }, [])

  return {
    state,
    mode,
    aiPlayer: 'O',
    aiIterations: 500,
    isAiThinking: false,
    makeMove,
    resetGame,
    setMode,
    setAiIterations,
  }
}
