import { NumberTile } from './NumberTile';

interface NumberRowProps {
  bigNumbers: number[];
  smallNumbers: number[];
  revealed: boolean;
}

export function NumberRow({ bigNumbers, smallNumbers, revealed }: NumberRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {bigNumbers.map((value, i) => (
        <NumberTile key={`big-${i}`} value={value} index={i} revealed={revealed} variant="big" />
      ))}
      {smallNumbers.map((value, i) => (
        <NumberTile
          key={`small-${i}`}
          value={value}
          index={bigNumbers.length + i}
          revealed={revealed}
          variant="small"
        />
      ))}
    </div>
  );
}
