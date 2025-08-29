
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import BrainstormingTool from './brainstorming-tool';

const QuestionCard = ({
  question,
  onAttempt,
}: {
  question: Question;
  onAttempt: (id: string, answer: string, isCorrect: boolean) => void;
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer) return;
    setShowResult(true);
    onAttempt(question.id, userAnswer, userAnswer === question.correctAnswer);
  };

  const ResultDisplay = () => {
    if (!showResult && !question.isAttempted) return null;
    const isCorrect = question.isAttempted ? question.isCorrect : userAnswer === question.correctAnswer;
    const answerToShow = question.isAttempted ? question.userAnswer : userAnswer;

    return (
        <div className={`mt-4 p-4 rounded-lg border ${isCorrect ? 'bg-green-100/80 border-green-300 dark:bg-green-900/30 dark:border-green-700' : 'bg-red-100/80 border-red-300 dark:bg-red-900/30 dark:border-red-700'}`}>
            <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" /> : <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                <h4 className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Your answer: {answerToShow}</p>
            {!isCorrect && (
                 <p className="text-sm text-muted-foreground">Correct answer: {question.correctAnswer}</p>
            )}
        </div>
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">{question.questionText}</CardTitle>
          {question.questionImageURL && (
            <Dialog>
                <DialogTrigger asChild>
                    <button type="button" className="mt-4 rounded-lg overflow-hidden border w-full md:w-1/2 group relative">
                        <Image src={question.questionImageURL} alt="Question visual aid" width={400} height={200} className="object-cover w-full" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <Image src={question.questionImageURL} alt="Question visual aid" width={800} height={600} className="rounded-lg object-contain" />
                </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {question.answerType === 'options' ? (
            <RadioGroup onValueChange={setUserAnswer} value={userAnswer} disabled={question.isAttempted}>
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`} className="font-normal">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={question.isAttempted}
            />
          )}
          <ResultDisplay />
        </CardContent>
        {!question.isAttempted && (
          <CardFooter>
            <Button type="submit" disabled={!userAnswer || showResult}>Submit Answer</Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
};

const QuestionList = ({
  questions,
  isLoading,
  onAttempt,
}: {
  questions: Question[];
  isLoading: boolean;
  onAttempt: (id: string, answer: string, isCorrect: boolean) => void;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
        <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">All Clear!</h3>
        <p className="text-muted-foreground">There are no questions in this list right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} onAttempt={onAttempt} />
      ))}
    </div>
  );
};

export default function TrickyQuestionBank() {
  const [unattemptedQuestions, setUnattemptedQuestions] = useState<Question[]>([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'tricky-questions'));
      const querySnapshot = await getDocs(q);
      const allQuestions: Question[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
      
      setUnattemptedQuestions(allQuestions.filter(q => !q.isAttempted));
      setAttemptedQuestions(allQuestions.filter(q => q.isAttempted));
    } catch (err) {
      console.error('Failed to fetch tricky questions:', err);
      setError('Could not load tricky questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAttempt = async (id: string, userAnswer: string, isCorrect: boolean) => {
    try {
      const questionDocRef = doc(db, 'tricky-questions', id);
      await updateDoc(questionDocRef, {
        isAttempted: true,
        userAnswer,
        isCorrect,
      });

      const questionToMove = unattemptedQuestions.find(q => q.id === id);
      if (questionToMove) {
        setUnattemptedQuestions(prev => prev.filter(q => q.id !== id));
        setAttemptedQuestions(prev => [{ ...questionToMove, isAttempted: true, userAnswer, isCorrect }, ...prev]);
      }
       toast({
        title: isCorrect ? "Correct!" : "Good Try!",
        description: "Your answer has been recorded.",
        variant: isCorrect ? 'default' : 'destructive',
      });
    } catch (err) {
      console.error('Failed to update tricky question:', err);
      toast({
        title: "Update Failed",
        description: "Could not save your answer. Please try again.",
        variant: "destructive",
      });
      fetchQuestions();
    }
  };

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 bg-destructive/10 border-destructive">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive-foreground">An Error Occurred</h3>
        <p className="text-destructive-foreground/80">{error}</p>
      </Card>
    );
  }

  return (
     <Tabs defaultValue="questions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="questions">Tricky Questions</TabsTrigger>
        <TabsTrigger value="brainstorm">Brainstorming Tool</TabsTrigger>
      </TabsList>
      <TabsContent value="questions" className="mt-4">
        <Tabs defaultValue="unattempted" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unattempted">Unattempted ({unattemptedQuestions.length})</TabsTrigger>
            <TabsTrigger value="attempted">Attempted ({attemptedQuestions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="unattempted" className="mt-4">
            <QuestionList
              questions={unattemptedQuestions}
              isLoading={isLoading}
              onAttempt={handleAttempt}
            />
          </TabsContent>
          <TabsContent value="attempted" className="mt-4">
            <QuestionList
              questions={attemptedQuestions}
              isLoading={isLoading}
              onAttempt={() => {}}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="brainstorm" className="mt-4">
         <BrainstormingTool />
      </TabsContent>
    </Tabs>
  );
}
