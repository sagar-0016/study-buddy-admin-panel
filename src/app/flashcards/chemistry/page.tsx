
import type { Metadata } from 'next';
import ChemistryDeck from '@/components/flashcards/chemistry-deck';

export const metadata: Metadata = {
  title: 'Chemistry Flashcards',
};

export default function ChemistryFlashcardsPage() {
  return (
    <div className="space-y-6">
      <ChemistryDeck />
    </div>
  );
}
