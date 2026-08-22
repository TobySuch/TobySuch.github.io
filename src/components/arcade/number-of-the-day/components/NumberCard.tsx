interface NumberCardProps {
  number: number;
}

export function NumberCard({ number }: NumberCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-xl border border-slate-800 bg-slate-900 px-8 py-4 shadow-lg">
      <p className="text-base font-semibold uppercase tracking-widest text-slate-500">Today's number</p>
      <p className="text-6xl font-black text-blue-400 tabular-nums">{number}</p>
    </div>
  );
}
