
import type { Metadata } from 'next';
import LectureLibrary from '@/components/lectures/lecture-library';

export const metadata: Metadata = {
  title: 'Lectures',
};

export default function LecturesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lecture Library</h1>
        <p className="text-muted-foreground">
          Find and watch lectures from your favorite channels.
        </p>
      </div>
      <LectureLibrary />
    </div>
  );
}
