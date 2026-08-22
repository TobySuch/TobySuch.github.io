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
  {
    slug: "number-of-the-day",
    title: "Number of the Day",
    description: "A random number and ten KS3 maths questions built around it — round it, factor it, spot the pattern.",
    icon: "🔢",
  },
  {
    slug: "countdown-numbers",
    title: "Countdown Numbers Round",
    description: "Pick 2 big and 4 small numbers, then race to reach the target using +, −, × and ÷.",
    icon: "🧮",
  },
];
