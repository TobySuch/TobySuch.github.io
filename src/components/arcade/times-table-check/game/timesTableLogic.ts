import { shuffle, type Rng } from './mathUtils';

const MIN = 2;
const MAX = 12;

export interface TimesTablePuzzle {
  rowHeaders: [number, number, number];
  colHeaders: [number, number, number];
}

function pickThree(rng: Rng): [number, number, number] {
  const pool = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);
  const [a, b, c] = shuffle(rng, pool);
  return [a, b, c];
}

export function generatePuzzle(rng: Rng): TimesTablePuzzle {
  return {
    rowHeaders: pickThree(rng),
    colHeaders: pickThree(rng),
  };
}

export function product(puzzle: TimesTablePuzzle, row: number, col: number): number {
  return puzzle.rowHeaders[row] * puzzle.colHeaders[col];
}
