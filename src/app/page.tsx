
"use client";

import SyllabusTracker from '@/components/syllabus/syllabus-tracker';

export default function HomePage() {
    return (
        <div className="space-y-6">
           <div>
            <h1 className="text-2xl font-bold tracking-tight">Syllabus Tracker</h1>
            <p className="text-muted-foreground">
              Mark your progress through the JEE syllabus. One topic at a time.
            </p>
          </div>
          <SyllabusTracker />
        </div>
      );
}
