
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getBrainstormingTopics, addBrainstormingSubmission } from '@/lib/brainstorming';
import type { BrainstormingTopic } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Send, Loader2, BookCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const SubmissionDialog = ({ topic, children }: { topic: BrainstormingTopic, children: React.ReactNode }) => {
    const [userThoughts, setUserThoughts] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!userThoughts) return;
        setIsSaving(true);
        try {
            await addBrainstormingSubmission({
                topicId: topic.id,
                topicQuestion: topic.question,
                thoughts: userThoughts
            });
            toast({ title: "Success!", description: "Your thoughts have been submitted." });
            setIsOpen(false);
            setUserThoughts('');
        } catch (error) {
            toast({ title: "Error", description: "Could not submit your thoughts.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{topic.question}</DialogTitle>
                    <DialogDescription>
                        Jot down your initial thoughts, key concepts, formulas, and your approach to solving this problem.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea 
                        placeholder="Your thoughts here..."
                        rows={10}
                        value={userThoughts}
                        onChange={(e) => setUserThoughts(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSubmit} disabled={isSaving || !userThoughts}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit for Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};


export default function BrainstormingTool() {
    const [topics, setTopics] = useState<BrainstormingTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            const fetchedTopics = await getBrainstormingTopics();
            setTopics(fetchedTopics);
            setIsLoading(false);
        };
        fetchTopics();
    }, []);


    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }
    
    if (topics.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[40vh]">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Brainstorming Topics Found</h3>
                <p className="text-muted-foreground">Come back later for more thought-provoking questions.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {topics.map(topic => (
                 <SubmissionDialog key={topic.id} topic={topic}>
                    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <p className="text-base font-semibold leading-relaxed pr-4">{topic.question}</p>
                                <Badge variant="secondary">{topic.subject}</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </SubmissionDialog>
            ))}
        </div>
    );
}
