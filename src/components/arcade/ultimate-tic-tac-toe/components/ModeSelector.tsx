import { clsx } from 'clsx'
import { useState } from 'react'

interface ModeSelectorProps {
  onStart: (mode: 'two-player' | 'vs-ai') => void
}

const DIFFICULTY_LABELS = ['Easy', 'Medium', 'Hard', 'Expert']

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'two-player' | 'vs-ai'>('two-player')

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight">Ultimate</h1>
        <h1 className="text-4xl font-black text-white tracking-tight">Tic-Tac-Toe</h1>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setSelectedMode('two-player')}
          className={clsx(
            'px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2',
            selectedMode === 'two-player'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
          )}
        >
          Two Player
        </button>
        <button
          disabled
          title="AI coming soon"
          className="px-6 py-3 rounded-lg font-semibold bg-slate-800 text-slate-500 cursor-not-allowed"
        >
          vs AI{' '}
          <span className="text-xs font-normal">(coming soon)</span>
        </button>
      </div>

      <div className="w-full max-w-xs opacity-40 pointer-events-none select-none">
        <p className="text-sm text-slate-400 mb-2 text-center">AI Difficulty</p>
        <input type="range" min={0} max={3} defaultValue={1} disabled className="w-full" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          {DIFFICULTY_LABELS.map(label => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selectedMode)}
        className="px-10 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg text-white transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2 cursor-pointer"
      >
        Start Game
      </button>
    </div>
  )
}
