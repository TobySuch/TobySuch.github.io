import type { GameState } from '../game/gameLogic'
import { MiniBoard } from './MiniBoard'

interface MetaBoardProps {
  state: GameState
  legalMoves: Array<[number, number]>
  onMove: (boardIdx: number, cellIdx: number) => void
}

const COL_GROUPS = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]
const ROW_GROUPS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]

function ColLabels() {
  return (
    <div className="w-[480px] max-w-[90vw] flex gap-3 px-3">
      {COL_GROUPS.map((group, i) => (
        <div key={i} className="flex-1 flex gap-0.5 px-0.5">
          {group.map((l) => (
            <div key={l} className="flex-1 text-center text-xs font-mono font-semibold text-slate-400">
              {l}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function RowLabels({ align }: { align: 'left' | 'right' }) {
  return (
    <div className="flex flex-col gap-3 py-3 w-6">
      {ROW_GROUPS.map((group, i) => (
        <div key={i} className="flex-1 flex flex-col gap-0.5 py-0.5">
          {group.map((l) => (
            <div
              key={l}
              className={
                'flex-1 flex items-center text-xs font-mono font-semibold text-slate-400' +
                (align === 'left' ? ' justify-end pr-1' : ' justify-start pl-1')
              }
            >
              {l}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function MetaBoard({ state, legalMoves, onMove }: MetaBoardProps) {
  const isFreeMove = state.activeMiniBoard === null

  return (
    <div className="flex flex-col items-center">
      {/* Top column labels */}
      <div className="flex">
        <div className="w-6" />
        <ColLabels />
        <div className="w-6" />
      </div>

      {/* Middle: row labels + board + row labels */}
      <div className="flex items-stretch">
        <RowLabels align="left" />
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
        <RowLabels align="right" />
      </div>

      {/* Bottom column labels */}
      <div className="flex">
        <div className="w-6" />
        <ColLabels />
        <div className="w-6" />
      </div>
    </div>
  )
}
