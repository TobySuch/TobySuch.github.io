declare const self: DedicatedWorkerGlobalScope

import {
  type GameState,
  type BoardResult,
  type Player,
  getLegalMoves,
  applyMove,
  isTerminal,
  getWinner,
} from './gameLogic'

interface MCTSNode {
  state: GameState
  move: [number, number] | null
  parent: MCTSNode | null
  children: MCTSNode[]
  wins: number
  visits: number
  untriedMoves: Array<[number, number]>
}

const C = Math.SQRT2

function bestUcb1Child(node: MCTSNode): MCTSNode {
  let best = node.children[0]
  let bestScore = -Infinity
  const logParentVisits = Math.log(node.visits)
  for (const child of node.children) {
    const score = child.wins / child.visits + C * Math.sqrt(logParentVisits / child.visits)
    if (score > bestScore) {
      bestScore = score
      best = child
    }
  }
  return best
}

function simulate(state: GameState): BoardResult {
  let s = state
  while (!isTerminal(s)) {
    const moves = getLegalMoves(s)
    const [b, c] = moves[Math.floor(Math.random() * moves.length)]
    s = applyMove(s, b, c)
  }
  return getWinner(s)
}

function backpropagate(node: MCTSNode, result: BoardResult): void {
  let current: MCTSNode | null = node
  while (current !== null) {
    current.visits++
    if (current.move !== null) {
      // applyMove toggles currentPlayer, so the mover into this node is the opposite
      const mover: Player = current.state.currentPlayer === 'X' ? 'O' : 'X'
      if (result === mover) {
        current.wins += 1
      } else if (result === 'draw') {
        current.wins += 0.5
      }
    }
    current = current.parent
  }
}

export function mcts(rootState: GameState, iterations: number): [number, number] {
  const root: MCTSNode = {
    state: rootState,
    move: null,
    parent: null,
    children: [],
    wins: 0,
    visits: 0,
    untriedMoves: getLegalMoves(rootState),
  }

  for (let i = 0; i < iterations; i++) {
    // 1. Selection
    let node = root
    while (node.untriedMoves.length === 0 && node.children.length > 0) {
      node = bestUcb1Child(node)
    }

    // 2. Expansion
    if (node.untriedMoves.length > 0 && !isTerminal(node.state)) {
      const idx = Math.floor(Math.random() * node.untriedMoves.length)
      const [boardIdx, cellIdx] = node.untriedMoves.splice(idx, 1)[0]
      const newState = applyMove(node.state, boardIdx, cellIdx)
      const child: MCTSNode = {
        state: newState,
        move: [boardIdx, cellIdx],
        parent: node,
        children: [],
        wins: 0,
        visits: 0,
        untriedMoves: getLegalMoves(newState),
      }
      node.children.push(child)
      node = child
    }

    // 3. Simulation
    const result = simulate(node.state)

    // 4. Backpropagation
    backpropagate(node, result)
  }

  // Return the child of root with the highest visit count
  if (root.children.length === 0) {
    // Fallback: shouldn't happen for a non-terminal state, but be safe
    const moves = getLegalMoves(rootState)
    return moves[Math.floor(Math.random() * moves.length)]
  }

  let best = root.children[0]
  for (const child of root.children) {
    if (child.visits > best.visits) best = child
  }
  return best.move!
}

self.onmessage = (e: MessageEvent<{ state: GameState; iterations: number }>) => {
  const { state, iterations } = e.data
  const t0 = performance.now()
  const move = mcts(state, iterations)
  self.postMessage({
    move,
    iterations,
    timeMs: Math.round(performance.now() - t0),
  })
}
