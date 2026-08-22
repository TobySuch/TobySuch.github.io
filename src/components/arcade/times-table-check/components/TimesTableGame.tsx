import { product } from '../game/timesTableLogic';
import { useTimesTableCheck } from '../hooks/useTimesTableCheck';
import { trackRegenerate, trackRevealCell } from '../utils/analytics';
import { AnswerCell } from './AnswerCell';
import { CornerCell } from './CornerCell';
import { HeaderCell } from './HeaderCell';
import { RegenerateButton } from './RegenerateButton';

function cellBorderClasses(row: number, col: number): string {
  const classes: string[] = [];
  if (col === 0) classes.push('border-r-4 border-r-cyan-400');
  if (row === 0) classes.push('border-b-4 border-b-cyan-400');
  if (row === 0 && (col === 1 || col === 2)) {
    classes.push('border-r-2 border-slate-600');
  }
  if (col === 0 && (row === 1 || row === 2)) {
    classes.push('border-b-2 border-slate-600');
  }
  if (row >= 1 && (col === 1 || col === 2)) classes.push('border-r-2 border-r-cyan-600');
  if (col >= 1 && (row === 1 || row === 2)) classes.push('border-b-2 border-b-cyan-600');
  return classes.join(' ');
}

export function TimesTableGame() {
  const { puzzle, generation, regenerate, isRevealed, revealCell } = useTimesTableCheck();

  const handleRegenerate = () => {
    trackRegenerate();
    regenerate();
  };

  const handleReveal = (row: number, col: number) => {
    if (!isRevealed(row, col)) trackRevealCell();
    revealCell(row, col);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-slate-950 p-8 pb-14 text-white">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">Times Table Check</h1>
          <p className="mt-2 text-slate-400">
            Cover the grid, recall each answer, then click a cell to check yourself.
          </p>
        </div>

        <div key={generation} className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-800">
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => {
              const key = `${row}-${col}`;
              const borderClasses = cellBorderClasses(row, col);

              if (row === 0 && col === 0) {
                return (
                  <div key={key} className={borderClasses}>
                    <CornerCell />
                  </div>
                );
              }
              if (row === 0) {
                return (
                  <div key={key} className={borderClasses}>
                    <HeaderCell value={puzzle.colHeaders[col - 1]} />
                  </div>
                );
              }
              if (col === 0) {
                return (
                  <div key={key} className={borderClasses}>
                    <HeaderCell value={puzzle.rowHeaders[row - 1]} />
                  </div>
                );
              }
              const r = row - 1;
              const c = col - 1;
              return (
                <div key={key} className={borderClasses}>
                  <AnswerCell
                    product={product(puzzle, r, c)}
                    revealed={isRevealed(r, c)}
                    onReveal={() => handleReveal(r, c)}
                  />
                </div>
              );
            }),
          )}
        </div>

        <RegenerateButton onClick={handleRegenerate} />
      </div>
    </div>
  );
}
