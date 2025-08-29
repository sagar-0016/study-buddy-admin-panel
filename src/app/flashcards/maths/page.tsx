
import type { Metadata } from 'next';
import MathsDeck from '@/components/flashcards/maths-deck';

export const metadata: Metadata = {
  title: 'Maths Flashcards',
};

export default function MathsFlashcardsPage() {
  return (
    <div className="space-y-6">
      <MathsDeck />
    </div>
  );
}
