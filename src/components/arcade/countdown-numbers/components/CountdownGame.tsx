import { useEffect, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { trackRegenerate, trackRevealSolution } from '../utils/analytics';
import { NumberRow } from './NumberRow';
import { RegenerateButton } from './RegenerateButton';
import { SolutionPanel } from './SolutionPanel';
import { TargetTile } from './TargetTile';

export function CountdownGame() {
  const { puzzle, generation, regenerate, solutionRevealed, solverResult, revealSolution } =
    useCountdown();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const timer = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(timer);
  }, [generation]);

  const handleRegenerate = () => {
    trackRegenerate();
    regenerate();
  };

  const handleReveal = () => {
    if (!solutionRevealed) trackRevealSolution();
    revealSolution();
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-slate-950 p-8 pb-14 text-white">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">Countdown Numbers Round</h1>
          <p className="mt-2 text-slate-400">
            2 big numbers, 4 small numbers — reach the target with +, −, × and ÷.
          </p>
        </div>

        <NumberRow bigNumbers={puzzle.bigNumbers} smallNumbers={puzzle.smallNumbers} revealed={revealed} />
        <TargetTile target={puzzle.target} revealed={revealed} />

        <RegenerateButton onClick={handleRegenerate} />
        <SolutionPanel revealed={solutionRevealed} result={solverResult} onReveal={handleReveal} />
      </div>
    </div>
  );
}
