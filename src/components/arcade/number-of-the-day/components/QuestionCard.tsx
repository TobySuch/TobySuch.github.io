import type { Question } from '../game/questions';

interface QuestionCardProps {
  index: number;
  question: Question;
  revealed: boolean;
}

export function QuestionCard({ index, question, revealed }: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm font-semibold text-slate-500">Question {index + 1}</p>
      <p className="flex-1 text-lg text-slate-200">{question.prompt}</p>
      {revealed ? (
        <p className="text-xl font-bold text-emerald-400">{question.answer}</p>
      ) : (
        <p className="text-lg italic text-slate-600">Answer hidden</p>
      )}
    </div>
  );
}
