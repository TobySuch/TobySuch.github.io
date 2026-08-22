export interface ArcadeGame {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const arcadeGames: ArcadeGame[] = [
  {
    slug: "ultimate-tic-tac-toe",
    title: "Ultimate Tic-Tac-Toe",
    description: "A strategic twist on the classic game — every move sends your opponent to a new board.",
    icon: "⭕",
  },
];
