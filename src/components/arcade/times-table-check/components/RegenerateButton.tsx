interface RegenerateButtonProps {
  onClick: () => void;
}

export function RegenerateButton({ onClick }: RegenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
    >
      New grid
    </button>
  );
}
