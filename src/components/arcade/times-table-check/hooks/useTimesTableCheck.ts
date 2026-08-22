import { useCallback, useState } from 'react';
import { generatePuzzle, type TimesTablePuzzle } from '../game/timesTableLogic';

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function useTimesTableCheck() {
  const [puzzle, setPuzzle] = useState<TimesTablePuzzle>(() => generatePuzzle(Math.random));
  const [generation, setGeneration] = useState(0);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(() => new Set());

  const regenerate = useCallback(() => {
    setPuzzle(generatePuzzle(Math.random));
    setGeneration((g) => g + 1);
    setRevealedCells(new Set());
  }, []);

  const revealCell = useCallback((row: number, col: number) => {
    const key = cellKey(row, col);
    setRevealedCells((existing) => {
      if (existing.has(key)) return existing;
      const next = new Set(existing);
      next.add(key);
      return next;
    });
  }, []);

  const isRevealed = useCallback(
    (row: number, col: number) => revealedCells.has(cellKey(row, col)),
    [revealedCells],
  );

  return { puzzle, generation, regenerate, isRevealed, revealCell };
}
