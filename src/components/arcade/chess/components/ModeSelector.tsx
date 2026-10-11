import { clsx } from 'clsx'
import { useState } from 'react'
import type { Color } from 'chess.js'
import type { GameMode } from '../hooks/useChessGame'
import { ENGINE_ENABLED } from '../engine/featureFlag'

interface ModeSelectorProps {
  onStart: (mode: GameMode, humanColor: Color) => void
}

type ColorChoice = Color | 'random'

const COLOR_CHOICES: { value: ColorChoice; label: string }[] = [
  { value: 'w', label: 'White' },
  { value: 'random', label: 'Random' },
  { value: 'b', label: 'Black' },
]

const toggleClass = (active: boolean) => clsx(
  'px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer',
  'focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-700',
  active ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
)

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('two-player')
  const [colorChoice, setColorChoice] = useState<ColorChoice>('w')

  const handleStart = () => {
    const color: Color = colorChoice === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : colorChoice
    onStart(selectedMode, color)
  }

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-12">
      <h1 className="text-4xl font-black text-white tracking-tight">Chess</h1>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => setSelectedMode('two-player')} className={toggleClass(selectedMode === 'two-player')}>
          Two Player
        </button>
        <button
          onClick={() => setSelectedMode('vs-engine')}
          disabled={!ENGINE_ENABLED}
          className={toggleClass(selectedMode === 'vs-engine')}
        >
          vs Computer
          {!ENGINE_ENABLED && <span className="block text-xs font-normal">coming soon</span>}
        </button>
      </div>

      <div className={clsx('w-full max-w-xs', selectedMode !== 'vs-engine' && 'opacity-40 pointer-events-none select-none')}>
        <p className="text-sm text-slate-400 mb-2 text-center">Play as</p>
        <div className="flex justify-center gap-2">
          {COLOR_CHOICES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setColorChoice(value)}
              tabIndex={selectedMode === 'vs-engine' ? 0 : -1}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2',
                colorChoice === value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        className="px-10 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg text-white transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2 cursor-pointer"
      >
        Start Game
      </button>
    </div>
  )
}
