export type Player = 'X' | 'O'
export type CellValue = Player | null
export type BoardResult = Player | 'draw' | null

export interface GameState {
  miniBoards: CellValue[][]
  miniBoardResults: BoardResult[]
  activeMiniBoard: number | null
  currentPlayer: Player
  gameResult: BoardResult
}

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export function checkBoardWinner(cells: CellValue[]): BoardResult {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a] as Player
    }
  }
  if (cells.includes(null)) return null
  return 'draw'
}

function checkMetaWinner(results: BoardResult[]): BoardResult {
  for (const [a, b, c] of WIN_LINES) {
    if (results[a] && results[a] !== 'draw' && results[a] === results[b] && results[a] === results[c]) {
      return results[a] as Player
    }
  }
  return null
}

export function createInitialState(): GameState {
  return {
    miniBoards: Array.from({ length: 9 }, () => Array<CellValue>(9).fill(null)),
    miniBoardResults: Array<BoardResult>(9).fill(null),
    activeMiniBoard: null,
    currentPlayer: 'X',
    gameResult: null,
  }
}

export function cloneState(state: GameState): GameState {
  return {
    miniBoards: state.miniBoards.map(b => [...b]),
    miniBoardResults: [...state.miniBoardResults],
    activeMiniBoard: state.activeMiniBoard,
    currentPlayer: state.currentPlayer,
    gameResult: state.gameResult,
  }
}

export function getLegalMoves(state: GameState): Array<[number, number]> {
  if (state.gameResult !== null) return []

  const moves: Array<[number, number]> = []

  if (state.activeMiniBoard !== null) {
    const boardIdx = state.activeMiniBoard
    for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
      if (state.miniBoards[boardIdx][cellIdx] === null) {
        moves.push([boardIdx, cellIdx])
      }
    }
  } else {
    for (let boardIdx = 0; boardIdx < 9; boardIdx++) {
      if (state.miniBoardResults[boardIdx] !== null) continue
      for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
        if (state.miniBoards[boardIdx][cellIdx] === null) {
          moves.push([boardIdx, cellIdx])
        }
      }
    }
  }

  return moves
}

export function applyMove(state: GameState, boardIdx: number, cellIdx: number): GameState {
  const next = cloneState(state)

  next.miniBoards[boardIdx][cellIdx] = state.currentPlayer
  next.miniBoardResults[boardIdx] = checkBoardWinner(next.miniBoards[boardIdx])

  next.gameResult = checkMetaWinner(next.miniBoardResults)

  if (next.gameResult === null && next.miniBoardResults.every(r => r !== null)) {
    next.gameResult = 'draw'
  }

  // Cell played determines the target mini-board for the next move
  next.activeMiniBoard = next.miniBoardResults[cellIdx] !== null ? null : cellIdx

  next.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X'

  return next
}

export function isTerminal(state: GameState): boolean {
  return state.gameResult !== null
}

export function getWinner(state: GameState): BoardResult {
  return state.gameResult
}
