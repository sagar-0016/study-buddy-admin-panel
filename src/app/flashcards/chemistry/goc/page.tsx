
import type { Metadata } from 'next';
import GocDeck from '@/components/flashcards/chemistry/goc-deck';

export const metadata: Metadata = {
  title: 'General Organic Chemistry Flashcards',
};

export default function GocFlashcardsPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <GocDeck />
    </div>
  );
}

    