export type Op = '+' | '-' | '×' | '÷';

export interface Step {
  a: number;
  op: Op;
  b: number;
  result: number;
}

export interface SolveResult {
  target: number;
  found: boolean;
  value: number;
  steps: Step[];
}

interface Reachable {
  value: number;
  steps: Step[];
}

/**
 * Standard subset-partition DP: reachable(mask) is memoized so each subset of
 * the input numbers is only combined once, however many ways it's reached.
 */
export function solve(numbers: number[], target: number): SolveResult {
  const memo = new Map<number, Reachable[]>();

  function push(out: Reachable[], value: number, op: Op, x: Reachable, y: Reachable) {
    if (value <= 0) return;
    const step: Step = { a: x.value, op, b: y.value, result: value };
    out.push({ value, steps: [...x.steps, ...y.steps, step] });
  }

  function combine(a: Reachable, b: Reachable, out: Reachable[]) {
    push(out, a.value + b.value, '+', a, b);
    if (a.value !== 1 && b.value !== 1) push(out, a.value * b.value, '×', a, b);
    if (a.value > b.value) push(out, a.value - b.value, '-', a, b);
    if (b.value > a.value) push(out, b.value - a.value, '-', b, a);
    if (b.value !== 1 && a.value % b.value === 0) push(out, a.value / b.value, '÷', a, b);
    if (a.value !== 1 && b.value % a.value === 0) push(out, b.value / a.value, '÷', b, a);
  }

  function reachableFor(mask: number): Reachable[] {
    const cached = memo.get(mask);
    if (cached) return cached;

    const results: Reachable[] = [];

    if ((mask & (mask - 1)) === 0) {
      const idx = Math.log2(mask);
      results.push({ value: numbers[idx], steps: [] });
      memo.set(mask, results);
      return results;
    }

    for (let subA = (mask - 1) & mask; subA > 0; subA = (subA - 1) & mask) {
      const subB = mask ^ subA;
      if (subA < subB) continue;
      const left = reachableFor(subA);
      const right = reachableFor(subB);
      for (const a of left) {
        for (const b of right) {
          combine(a, b, results);
        }
      }
    }

    memo.set(mask, results);
    return results;
  }

  let best: Reachable = { value: numbers[0], steps: [] };
  let bestDiff = Math.abs(target - best.value);

  function consider(candidate: Reachable) {
    const diff = Math.abs(target - candidate.value);
    if (diff < bestDiff || (diff === bestDiff && candidate.steps.length < best.steps.length)) {
      best = candidate;
      bestDiff = diff;
    }
  }

  const fullMask = (1 << numbers.length) - 1;
  for (let mask = 1; mask <= fullMask; mask++) {
    for (const candidate of reachableFor(mask)) {
      consider(candidate);
    }
    if (bestDiff === 0) break;
  }

  return { target, found: bestDiff === 0, value: best.value, steps: best.steps };
}

export function formatStep(step: Step): string {
  return `${step.a} ${step.op} ${step.b} = ${step.result}`;
}
