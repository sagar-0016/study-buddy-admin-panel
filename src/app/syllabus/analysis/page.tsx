
import type { Metadata } from 'next';
import SyllabusAnalysis from '@/components/syllabus/syllabus-analysis';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syllabus Analysis',
};

export default function SyllabusAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Syllabus Analysis</h1>
            <p className="text-muted-foreground">
            Analyze chapter weightage to prioritize your studies effectively.
            </p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Syllabus Tracker
            </Link>
        </Button>
      </div>
      <SyllabusAnalysis />
    </div>
  );
}
