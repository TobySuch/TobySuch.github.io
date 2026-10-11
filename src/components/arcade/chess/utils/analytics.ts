import type { Color } from 'chess.js'
import type { GameMode, GameResult } from '../hooks/useChessGame'

declare global {
  function plausible(eventName: string, options?: { props?: Record<string, string> }): void;
}

const COLOR_NAME: Record<Color, string> = { w: 'white', b: 'black' };

export function trackGameStart(mode: GameMode, humanColor: Color) {
  const props: Record<string, string> = { mode };
  if (mode === 'vs-engine') props.color = COLOR_NAME[humanColor];
  window.plausible?.('Chess: Game Start', { props });
}

export function trackGameQuit(mode: GameMode, moveCount: number) {
  window.plausible?.('Chess: Game Quit', { props: { mode, moves: String(moveCount) } });
}

export function trackGameComplete(mode: GameMode, humanColor: Color, result: GameResult) {
  const props: Record<string, string> = { mode, reason: result.reason };
  if (mode === 'vs-engine') {
    props.color = COLOR_NAME[humanColor];
    props.outcome = result.winner === 'draw' ? 'draw' : result.winner === humanColor ? 'win' : 'lose';
  } else {
    props.result = result.winner === 'draw' ? 'draw' : `${COLOR_NAME[result.winner]} wins`;
  }
  window.plausible?.('Chess: Game Complete', { props });
}
