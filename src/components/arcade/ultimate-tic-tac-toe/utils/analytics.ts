declare global {
  function plausible(eventName: string, options?: { props?: Record<string, string> }): void;
}

const DIFFICULTY_MAP: Record<number, string> = {
  500: 'Easy',
  2000: 'Medium',
  8000: 'Hard',
  25000: 'Expert',
};

function difficultyLabel(iterations: number): string {
  return DIFFICULTY_MAP[iterations] ?? 'Unknown';
}

export function trackGameStart(mode: string, iterations: number) {
  const props: Record<string, string> = { mode };
  if (mode === 'vs-ai') props.difficulty = difficultyLabel(iterations);
  window.plausible?.('UTTT: Game Start', { props });
}

export function trackGameQuit(mode: string, iterations: number) {
  const props: Record<string, string> = { mode };
  if (mode === 'vs-ai') props.difficulty = difficultyLabel(iterations);
  window.plausible?.('UTTT: Game Quit', { props });
}

export function trackGameComplete(
  mode: string,
  iterations: number,
  gameResult: 'X' | 'O' | 'draw',
) {
  const props: Record<string, string> = { mode };
  if (mode === 'vs-ai') {
    props.difficulty = difficultyLabel(iterations);
    props.outcome = gameResult === 'X' ? 'win' : gameResult === 'O' ? 'lose' : 'draw';
  } else {
    props.result = gameResult === 'X' ? 'X wins' : gameResult === 'O' ? 'O wins' : 'draw';
  }
  window.plausible?.('UTTT: Game Complete', { props });
}
