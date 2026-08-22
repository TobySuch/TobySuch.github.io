import { useCallback, useState } from 'react';
import { generatePuzzle, type CountdownPuzzle } from '../game/countdownLogic';
import { solve, type SolveResult } from '../game/solver';

export function useCountdown() {
  const [puzzle, setPuzzle] = useState<CountdownPuzzle>(() => generatePuzzle(Math.random));
  const [generation, setGeneration] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [solverResult, setSolverResult] = useState<SolveResult | null>(null);

  const regenerate = useCallback(() => {
    setPuzzle(generatePuzzle(Math.random));
    setGeneration((g) => g + 1);
    setSolutionRevealed(false);
    setSolverResult(null);
  }, []);

  const revealSolution = useCallback(() => {
    setSolverResult((existing) =>
      existing ?? solve([...puzzle.bigNumbers, ...puzzle.smallNumbers], puzzle.target),
    );
    setSolutionRevealed(true);
  }, [puzzle]);

  return { puzzle, generation, regenerate, solutionRevealed, solverResult, revealSolution };
}
