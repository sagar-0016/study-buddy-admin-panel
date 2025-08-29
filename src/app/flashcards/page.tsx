import type { Metadata } from 'next';
import DeckSelection from '@/components/flashcards/deck-selection';

export const metadata: Metadata = {
  title: 'Flashcards',
};

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcard Study</h1>
        <p className="text-muted-foreground">
          Master your subjects with interactive flashcards.
        </p>
      </div>
      <DeckSelection />
    </div>
  );
}
