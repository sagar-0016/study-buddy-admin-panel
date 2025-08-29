
import type { Metadata } from 'next';
import PhysicsDeck from '@/components/flashcards/physics-deck';

export const metadata: Metadata = {
  title: 'Physics Flashcards',
};

export default function PhysicsFlashcardsPage() {
  return (
    <div className="space-y-6">
      <PhysicsDeck />
    </div>
  );
}
