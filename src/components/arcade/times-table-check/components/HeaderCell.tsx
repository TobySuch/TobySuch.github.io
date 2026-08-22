interface HeaderCellProps {
  value: number;
}

export function HeaderCell({ value }: HeaderCellProps) {
  return (
    <div className="flex h-20 w-20 items-center justify-center text-3xl font-black tabular-nums text-white sm:h-24 sm:w-24 sm:text-4xl">
      {value}
    </div>
  );
}
