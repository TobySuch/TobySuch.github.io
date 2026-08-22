interface TargetTileProps {
  target: number;
  revealed: boolean;
}

export function TargetTile({ target, revealed }: TargetTileProps) {
  return (
    <div
      className={[
        'flex h-28 w-28 items-center justify-center rounded-full border-4 border-red-600 bg-red-900/40 text-4xl font-black tabular-nums text-white shadow-xl transition-all duration-500 ease-out sm:h-32 sm:w-32 sm:text-5xl',
        revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
      ].join(' ')}
      style={{ transitionDelay: '700ms' }}
    >
      {target}
    </div>
  );
}
