
import type { Metadata } from 'next';
import RevisionCentre from '@/components/revisions/revision-centre';

export const metadata: Metadata = {
  title: 'Revisions',
};

export default function RevisionsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Revision Centre</h1>
        <p className="text-muted-foreground">
          Strengthen your memory by reviewing key topics.
        </p>
      </div>
      <RevisionCentre />
    </div>
  );
}
