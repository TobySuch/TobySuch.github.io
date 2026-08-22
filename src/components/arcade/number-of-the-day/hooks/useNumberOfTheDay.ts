import { useCallback, useState } from 'react';
import { generateDailyQuestions, type Question } from '../game/questions';

interface DailyPuzzle {
  dailyNumber: number;
  questions: Question[];
}

function createDailyPuzzle(): DailyPuzzle {
  const dailyNumber = Math.floor(Math.random() * 1001);
  return { dailyNumber, questions: generateDailyQuestions(dailyNumber) };
}

export function useNumberOfTheDay() {
  const [{ dailyNumber, questions }] = useState(createDailyPuzzle);
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = useCallback(() => setRevealed((r) => !r), []);

  return { dailyNumber, questions, revealed, toggleReveal };
}
