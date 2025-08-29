
import type { Metadata } from 'next';
import DoubtCentre from '@/components/doubts/doubt-centre';

export const metadata: Metadata = {
  title: 'Doubt Centre',
};

export default function DoubtsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Doubt Centre</h1>
        <p className="text-muted-foreground">
          Ask questions, get answers, and clear your doubts.
        </p>
      </div>
      <DoubtCentre />
    </div>
  );
}
