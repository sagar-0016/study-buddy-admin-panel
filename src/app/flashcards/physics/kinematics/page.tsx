
import type { Metadata } from 'next';
import KinematicsDeck from '@/components/flashcards/physics/kinematics-deck';

export const metadata: Metadata = {
  title: 'Kinematics Flashcards',
};

export default function KinematicsFlashcardsPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <KinematicsDeck />
    </div>
  );
}
