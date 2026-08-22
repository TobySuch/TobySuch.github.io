interface AnswerCellProps {
  product: number;
  revealed: boolean;
  onReveal: () => void;
}

export function AnswerCell({ product, revealed, onReveal }: AnswerCellProps) {
  return (
    <button
      type="button"
      onClick={onReveal}
      disabled={revealed}
      aria-label={revealed ? `Answer: ${product}` : 'Reveal answer'}
      className={[
        'flex h-20 w-20 items-center justify-center text-3xl font-black tabular-nums text-cyan-300 transition-colors sm:h-24 sm:w-24 sm:text-4xl',
        revealed ? 'bg-slate-900' : 'cursor-pointer bg-slate-950 hover:bg-slate-800',
      ].join(' ')}
    >
      <span
        className={[
          'transition-opacity duration-300 ease-out',
          revealed ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {product}
      </span>
    </button>
  );
}
