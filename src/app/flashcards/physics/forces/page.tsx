import type { Metadata } from 'next';
import ForcesDeck from '@/components/flashcards/physics/forces-deck';

export const metadata: Metadata = {
  title: 'Forces & Newton\'s Laws Flashcards',
};

export default function ForcesFlashcardsPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <ForcesDeck />
    </div>
  );
}