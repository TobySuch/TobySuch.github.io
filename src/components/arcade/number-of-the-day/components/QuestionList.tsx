import type { Question } from '../game/questions';
import { QuestionCard } from './QuestionCard';

interface QuestionListProps {
  questions: Question[];
  revealed: boolean;
}

export function QuestionList({ questions, revealed }: QuestionListProps) {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {questions.map((question, index) => (
        <QuestionCard key={question.id} index={index} question={question} revealed={revealed} />
      ))}
    </div>
  );
}
