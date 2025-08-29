
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { syllabusData } from '@/lib/data';
import type { Subject, Chapter, SyllabusChapter } from '@/lib/types';
import { getSyllabusProgress, updateSyllabusTopicStatus } from '@/lib/syllabus';
import { getPyqProgress, updatePyqStatus } from '@/lib/pyq';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SubjectSyllabus({ subject }: { subject: Subject }) {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
        setIsLoading(true);
        const progressData = await getSyllabusProgress();
        const initialState: Record<string, boolean> = {};
        progressData.forEach(item => {
            initialState[item.id] = item.completed;
        });
        setCheckedState(initialState);
        setIsLoading(false);
    };
    fetchProgress();
  }, [subject]);

  const handleCheckboxChange = async (topicKey: string, checked: boolean) => {
    // Optimistically update UI
    setCheckedState(prevState => ({ ...prevState, [topicKey]: checked }));
    
    // Update Firestore
    await updateSyllabusTopicStatus(topicKey, checked);
  };

  const { completedTopics, totalTopics, progress } = useMemo(() => {
    let completed = 0;
    let total = 0;
    subject.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => {
        total++;
        const key = `${subject.label}-${chapter.title}-${topic.name}`;
        if (checkedState[key]) {
          completed++;
        }
      });
    });
    return {
      completedTopics: completed,
      totalTopics: total,
      progress: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [checkedState, subject]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="space-y-2">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">{completedTopics} / {totalTopics} topics</span>
        </div>
        <Progress value={progress} />
      </div>

      <Accordion type="multiple" className="w-full">
        {subject.chapters.map((chapter: Chapter) => (
          <AccordionItem key={chapter.title} value={chapter.title}>
            <AccordionTrigger>{chapter.title}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {chapter.topics.map(topic => {
                  const topicKey = `${subject.label}-${chapter.title}-${topic.name}`;
                  return (
                    <div key={topic.name} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={topicKey}
                        checked={checkedState[topicKey] || false}
                        onCheckedChange={(checked) => handleCheckboxChange(topicKey, !!checked)}
                      />
                      <Label htmlFor={topicKey} className="w-full font-normal cursor-pointer">
                        {topic.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function PyqTracker({ subject }: { subject: Subject }) {
    const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            const progressData = await getPyqProgress();
            const initialState: Record<string, boolean> = {};
            progressData.forEach(item => {
                initialState[item.id] = item.completed;
            });
            setCheckedState(initialState);
            setIsLoading(false);
        };
        fetchProgress();
    }, [subject]);
    
    const handleCheckboxChange = async (pyqKey: string, checked: boolean) => {
        setCheckedState(prevState => ({ ...prevState, [pyqKey]: checked }));
        await updatePyqStatus(pyqKey, checked);
    };

     if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        );
    }

    return (
         <div className="space-y-4">
            <Accordion type="multiple" className="w-full">
                {subject.chapters.map((chapter: Chapter) => (
                    <AccordionItem key={chapter.title} value={chapter.title}>
                        <AccordionTrigger>{chapter.title}</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-3">
                                {chapter.topics.map(topic => { 
                                    const pyqKey = `${subject.label}-${chapter.title}-${topic.name}`;
                                    return (
                                        <div key={pyqKey} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                                            <Checkbox
                                                id={pyqKey}
                                                checked={checkedState[pyqKey] || false}
                                                onCheckedChange={(checked) => handleCheckboxChange(pyqKey, !!checked)}
                                            />
                                            <Label htmlFor={pyqKey} className="w-full font-normal cursor-pointer">
                                                {topic.name}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function PyqSection() {
    return (
        <Tabs defaultValue="physics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="physics">Physics</TabsTrigger>
                <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                <TabsTrigger value="maths">Maths</TabsTrigger>
            </TabsList>
            <TabsContent value="physics" className="p-4">
                <PyqTracker subject={syllabusData.physics} />
            </TabsContent>
            <TabsContent value="chemistry" className="p-4">
                <PyqTracker subject={syllabusData.chemistry} />
            </TabsContent>
            <TabsContent value="maths" className="p-4">
                <PyqTracker subject={syllabusData.maths} />
            </TabsContent>
        </Tabs>
    )
}

export default function SyllabusTracker() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0 sm:p-4">
          <Tabs defaultValue="physics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
              <TabsTrigger value="maths">Maths</TabsTrigger>
              <TabsTrigger value="pyq" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" /> PYQs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="physics" className="p-4">
              <SubjectSyllabus subject={syllabusData.physics} />
            </TabsContent>
            <TabsContent value="chemistry" className="p-4">
              <SubjectSyllabus subject={syllabusData.chemistry} />
            </TabsContent>
            <TabsContent value="maths" className="p-4">
              <SubjectSyllabus subject={syllabusData.maths} />
            </TabsContent>
            <TabsContent value="pyq" className="p-4">
              <PyqSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex flex-col items-start gap-4 p-4 bg-muted/50 border rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Note:</span> For the chapters which you have marked as completed in the syllabus, do move forward with their PYQs.
        </p>
        <Button asChild>
          <Link href="/syllabus/analysis">
              <AreaChart className="mr-2 h-4 w-4" />
              Analyse Syllabus Weightage
          </Link>
        </Button>
      </div>
    </div>
  );
}
