import { formatStep, type SolveResult } from '../game/solver';

interface SolutionPanelProps {
  revealed: boolean;
  result: SolveResult | null;
  onReveal: () => void;
}

export function SolutionPanel({ revealed, result, onReveal }: SolutionPanelProps) {
  if (!revealed || !result) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="rounded-lg border border-slate-700 px-8 py-3 text-lg font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      >
        Reveal solution
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-slate-200">
      {result.found ? (
        <p className="mb-3 font-semibold text-emerald-400">Exact solution found!</p>
      ) : (
        <p className="mb-3 font-semibold text-amber-400">
          No exact solution — closest is {result.value} ({Math.abs(result.target - result.value)} away)
        </p>
      )}
      {result.steps.length > 0 ? (
        <ol className="list-inside list-decimal space-y-1 font-mono text-sm">
          {result.steps.map((step, i) => (
            <li key={i}>{formatStep(step)}</li>
          ))}
        </ol>
      ) : (
        <p className="font-mono text-sm">{result.value} was already one of the numbers!</p>
      )}
    </div>
  );
}
