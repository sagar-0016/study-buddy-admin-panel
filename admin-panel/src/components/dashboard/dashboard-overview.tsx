
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getSyllabusProgress } from "@/lib/syllabus";
import { getProgressData } from "@/lib/progress";
import { getRevisionProgress } from "@/lib/revisions";
import { getPyqProgressStats } from "@/lib/pyq";
import { syllabusData } from "@/lib/data";
import { BookCheck, ClipboardList, Notebook, BrainCircuit } from "lucide-react";

const ProgressCard = ({ title, icon: Icon, value, total, isLoading, unit = 'topics' }: { title: string, icon: React.ElementType, value: number, total: number, isLoading: boolean, unit?: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {value} of {total} {unit} completed
                        </p>
                        <Progress value={percentage} className="mt-4 h-2" />
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default function DashboardOverview() {
  const [syllabusProgress, setSyllabusProgress] = useState({ completed: 0, total: 0 });
  const [flashcardProgress, setFlashcardProgress] = useState({ completed: 0, total: 0 });
  const [pyqProgress, setPyqProgress] = useState({ completed: 0, total: 0 });
  const [revisionProgress, setRevisionProgress] = useState({ completed: 0, total: 0 });
  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(true);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);
  const [isLoadingPyqs, setIsLoadingPyqs] = useState(true);
  const [isLoadingRevisions, setIsLoadingRevisions] = useState(true);

  useEffect(() => {
    const fetchSyllabusData = async () => {
      setIsLoadingSyllabus(true);
      const progress = await getSyllabusProgress();
      const completedCount = progress.filter(p => p.completed).length;

      let totalTopics = 0;
      Object.values(syllabusData).forEach(subject => {
        subject.chapters.forEach(chapter => {
          totalTopics += chapter.topics.length;
        });
      });
      setSyllabusProgress({ completed: completedCount, total: totalTopics });
      setIsLoadingSyllabus(false);
    };

    const fetchFlashcardData = async () => {
      setIsLoadingFlashcards(true);
      const progress = await getProgressData();
      const completed = progress.reduce((acc, curr) => acc + curr.completed, 0);
      const total = progress.reduce((acc, curr) => acc + curr.total, 0);
      setFlashcardProgress({ completed, total });
      setIsLoadingFlashcards(false);
    };
    
    const fetchPyqData = async () => {
      setIsLoadingPyqs(true);
      const stats = await getPyqProgressStats();
      setPyqProgress({ completed: stats.completed, total: stats.total });
      setIsLoadingPyqs(false);
    }

    const fetchRevisionData = async () => {
        setIsLoadingRevisions(true);
        const { mastered, total } = await getRevisionProgress();
        setRevisionProgress({ completed: mastered, total: total });
        setIsLoadingRevisions(false);
    }

    fetchSyllabusData();
    fetchFlashcardData();
    fetchRevisionData();
    fetchPyqData();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ProgressCard 
            title="Syllabus Completion"
            icon={BookCheck}
            value={syllabusProgress.completed}
            total={syllabusProgress.total}
            isLoading={isLoadingSyllabus}
            unit="topics"
        />
        <ProgressCard 
            title="Flashcard Completion"
            icon={Notebook}
            value={flashcardProgress.completed}
            total={flashcardProgress.total}
            isLoading={isLoadingFlashcards}
            unit="cards"
        />
        <ProgressCard 
            title="PYQ Completion"
            icon={ClipboardList}
            value={pyqProgress.completed}
            total={pyqProgress.total}
            isLoading={isLoadingPyqs}
            unit="chapters"
        />
        <ProgressCard 
            title="Revisions Mastered"
            icon={BrainCircuit}
            value={revisionProgress.completed}
            total={revisionProgress.total}
            isLoading={isLoadingRevisions}
            unit="topics"
        />
    </div>
  );
}
