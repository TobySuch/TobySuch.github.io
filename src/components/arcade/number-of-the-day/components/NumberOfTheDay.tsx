import { useNumberOfTheDay } from '../hooks/useNumberOfTheDay';
import { trackReveal } from '../utils/analytics';
import { NumberCard } from './NumberCard';
import { QuestionList } from './QuestionList';

export function NumberOfTheDay() {
  const { dailyNumber, questions, revealed, toggleReveal } = useNumberOfTheDay();

  const handleToggleReveal = () => {
    if (!revealed) trackReveal(dailyNumber);
    toggleReveal();
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-950 p-8 pb-14 text-white">
      <div className="flex w-full flex-col items-center gap-6">
        <h1 className="text-4xl font-black tracking-tight">Number of the Day</h1>

        <NumberCard number={dailyNumber} />

        <div className="w-full">
          <QuestionList questions={questions} revealed={revealed} />
        </div>

        <button
          onClick={handleToggleReveal}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
        >
          {revealed ? 'Hide answers' : 'Reveal all answers'}
        </button>
      </div>
    </div>
  );
}
