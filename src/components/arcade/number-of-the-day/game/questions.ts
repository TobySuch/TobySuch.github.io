import { digitSum, gcd, isPrime, lcm, pickOne, randomInt, shuffle, type Rng } from './mathUtils';

export interface Question {
  id: string;
  prompt: string;
  answer: string;
}

interface GeneratorDef {
  id: string;
  generate: (n: number, rng: Rng) => Question;
}

// Goes one past the max daily number (1000) so nearest-square comparisons near
// the top of the range have a correct upper neighbour to compare against.
const SQUARES = new Set<number>();
for (let i = 0; i <= 32; i++) SQUARES.add(i * i);

const CUBES = new Set<number>();
for (let i = 0; i <= 10; i++) CUBES.add(i * i * i);

const PLACE_NAMES = ['units', 'tens', 'hundreds', 'thousands'];

const GENERATORS: GeneratorDef[] = [
  {
    id: 'round-10',
    generate: (n) => ({
      id: 'round-10',
      prompt: `Round ${n} to the nearest 10.`,
      answer: String(Math.round(n / 10) * 10),
    }),
  },
  {
    id: 'round-100',
    generate: (n) => ({
      id: 'round-100',
      prompt: `Round ${n} to the nearest 100.`,
      answer: String(Math.round(n / 100) * 100),
    }),
  },
  {
    id: 'prime-composite',
    generate: (n) => ({
      id: 'prime-composite',
      prompt: `Is ${n} prime, composite, or neither?`,
      answer: n < 2 ? 'Neither (0 and 1 are not prime or composite)' : isPrime(n) ? 'Prime' : 'Composite',
    }),
  },
  {
    id: 'odd-even',
    generate: (n) => ({
      id: 'odd-even',
      prompt: `Is ${n} odd or even?`,
      answer: n % 2 === 0 ? 'Even' : 'Odd',
    }),
  },
  {
    id: 'digit-sum',
    generate: (n) => ({
      id: 'digit-sum',
      prompt: `What is the sum of the digits of ${n}?`,
      answer: String(digitSum(n)),
    }),
  },
  {
    id: 'factor-multiple',
    generate: (n, rng) => {
      const x = pickOne(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25, 50, 100]);
      const isMultiple = n % x === 0;
      const asFactor = rng() < 0.5;
      const prompt = asFactor ? `Is ${x} a factor of ${n}?` : `Is ${n} a multiple of ${x}?`;
      return { id: 'factor-multiple', prompt, answer: isMultiple ? 'Yes' : 'No' };
    },
  },
  {
    id: 'nearest-square',
    generate: (n) => {
      let nearest = 0;
      let bestDist = Infinity;
      for (const s of SQUARES) {
        const dist = Math.abs(s - n);
        if (dist < bestDist || (dist === bestDist && s > nearest)) {
          bestDist = dist;
          nearest = s;
        }
      }
      return {
        id: 'nearest-square',
        prompt: `What is the nearest square number to ${n}?`,
        answer: String(nearest),
      };
    },
  },
  {
    id: 'square-cube',
    generate: (n) => {
      const isSquare = SQUARES.has(n);
      const isCube = CUBES.has(n);
      let answer: string;
      if (isSquare && isCube) answer = 'Both a square number and a cube number';
      else if (isSquare) answer = 'Square number';
      else if (isCube) answer = 'Cube number';
      else answer = 'Neither';
      return {
        id: 'square-cube',
        prompt: `Is ${n} a square number, a cube number, or neither?`,
        answer,
      };
    },
  },
  {
    id: 'percentage',
    generate: (n, rng) => {
      const candidates = shuffle(rng, [50, 25, 20, 10, 75, 5, 1]);
      let p = 10;
      for (const candidate of candidates) {
        if ((n * candidate) % 100 === 0) {
          p = candidate;
          break;
        }
      }
      const result = (n * p) / 100;
      const clean = Number.isInteger(result);
      return {
        id: 'percentage',
        prompt: clean
          ? `What is ${p}% of ${n}?`
          : `What is ${p}% of ${n}? (Give your answer to 1 decimal place if needed.)`,
        answer: clean ? String(result) : result.toFixed(1),
      };
    },
  },
  {
    id: 'double-half',
    generate: (n, rng) => {
      if (rng() < 0.5) {
        return { id: 'double-half', prompt: `What is double ${n}?`, answer: String(n * 2) };
      }
      const half = n / 2;
      return {
        id: 'double-half',
        prompt: `What is half of ${n}?`,
        answer: Number.isInteger(half) ? String(half) : half.toFixed(1),
      };
    },
  },
  {
    id: 'negative-subtraction',
    generate: (n, rng) => {
      const k = n + randomInt(rng, 10, 500);
      return {
        id: 'negative-subtraction',
        prompt: `What is ${n} − ${k}?`,
        answer: String(n - k),
      };
    },
  },
  {
    id: 'place-value',
    generate: (n, rng) => {
      const digits = String(n);
      const maxIndex = digits.length - 1;
      const placeIndex = randomInt(rng, 0, maxIndex);
      const placeName = PLACE_NAMES[placeIndex];
      const digit = digits[digits.length - 1 - placeIndex];
      return {
        id: 'place-value',
        prompt: `What digit is in the ${placeName} place of ${n}?`,
        answer: digit,
      };
    },
  },
  {
    id: 'sequence',
    generate: (n, rng) => {
      const d = pickOne(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50]);
      const canDescend = n - 4 * d >= 0;
      const descend = canDescend && rng() < 0.5;
      const step = descend ? -d : d;
      const terms = [n, n + step, n + 2 * step];
      const next1 = n + 3 * step;
      const next2 = n + 4 * step;
      return {
        id: 'sequence',
        prompt: `Here is a sequence: ${terms.join(', ')}, __, __. What are the next two numbers?`,
        answer: `${next1}, ${next2}`,
      };
    },
  },
  {
    id: 'hcf',
    generate: (n, rng) => {
      const x = pickOne(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24]);
      return {
        id: 'hcf',
        prompt: `What is the highest common factor (HCF) of ${n} and ${x}?`,
        answer: String(gcd(n, x)),
      };
    },
  },
  {
    id: 'lcm',
    generate: (n, rng) => {
      const x = pickOne(rng, [2, 3, 4, 5, 6]);
      return {
        id: 'lcm',
        prompt: `What is the lowest common multiple (LCM) of ${n} and ${x}?`,
        answer: String(lcm(n, x)),
      };
    },
  },
];

export function generateDailyQuestions(n: number, count = 10, rng: Rng = Math.random): Question[] {
  return shuffle(rng, GENERATORS)
    .slice(0, count)
    .map((generator) => generator.generate(n, rng));
}
