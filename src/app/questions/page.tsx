import type { Metadata } from 'next';
import QuestionBank from '@/components/questions/question-bank';

export const metadata: Metadata = {
  title: 'Practice Questions',
};

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Practice Questions</h1>
        <p className="text-muted-foreground">
          Test your knowledge with questions from the question bank.
        </p>
      </div>
      <QuestionBank />
    </div>
  );
}
