interface NumberTileProps {
  value: number;
  index: number;
  revealed: boolean;
  variant: 'big' | 'small';
}

export function NumberTile({ value, index, revealed, variant }: NumberTileProps) {
  const variantClasses =
    variant === 'big'
      ? 'border-amber-700 bg-amber-900/40 text-amber-300'
      : 'border-slate-800 bg-slate-900 text-blue-300';

  return (
    <div
      className={[
        'flex h-20 w-20 items-center justify-center rounded-xl border text-3xl font-black tabular-nums shadow-lg transition-all duration-500 ease-out sm:h-24 sm:w-24 sm:text-4xl',
        revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        variantClasses,
      ].join(' ')}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {value}
    </div>
  );
}
