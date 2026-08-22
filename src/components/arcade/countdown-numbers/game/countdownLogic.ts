import { randomInt, shuffle, type Rng } from './mathUtils';

export interface CountdownPuzzle {
  bigNumbers: number[];
  smallNumbers: number[];
  target: number;
}

const BIG_POOL = [25, 50, 75, 100];

export function generatePuzzle(rng: Rng): CountdownPuzzle {
  const bigNumbers = shuffle(rng, BIG_POOL).slice(0, 2);

  const smallPool: number[] = [];
  for (let n = 1; n <= 10; n++) {
    smallPool.push(n, n);
  }
  const smallNumbers = shuffle(rng, smallPool).slice(0, 4);

  const target = randomInt(rng, 101, 999);

  return { bigNumbers, smallNumbers, target };
}
