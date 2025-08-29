
import type { Metadata } from 'next';
import TrickyQuestionBank from '@/components/tricky-topics/tricky-question-bank';

export const metadata: Metadata = {
  title: 'Tricky & Brainstormers',
};

export default function TrickyTopicsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Tricky Questions & Brainstormers</h1>
        <p className="text-muted-foreground">
          Challenge yourself with some of the trickiest questions.
        </p>
      </div>
      <TrickyQuestionBank />
    </div>
  );
}
