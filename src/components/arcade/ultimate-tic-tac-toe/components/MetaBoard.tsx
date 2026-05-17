import type { GameState } from '../game/gameLogic'
import { MiniBoard } from './MiniBoard'

interface MetaBoardProps {
  state: GameState
  legalMoves: Array<[number, number]>
  onMove: (boardIdx: number, cellIdx: number) => void
}

export function MetaBoard({ state, legalMoves, onMove }: MetaBoardProps) {
  const isFreeMove = state.activeMiniBoard === null

  return (
    <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl w-[480px] max-w-[90vw]">
      {state.miniBoards.map((cells, boardIdx) => {
        const isActive = isFreeMove
          ? state.miniBoardResults[boardIdx] === null
          : state.activeMiniBoard === boardIdx

        const legalCells = legalMoves
          .filter(([b]) => b === boardIdx)
          .map(([, c]) => c)

        return (
          <MiniBoard
            key={boardIdx}
            boardIdx={boardIdx}
            cells={cells}
            result={state.miniBoardResults[boardIdx]}
            isActive={isActive}
            isFreeMove={isFreeMove}
            legalCells={legalCells}
            onCellClick={(cellIdx) => onMove(boardIdx, cellIdx)}
          />
        )
      })}
    </div>
  )
}
