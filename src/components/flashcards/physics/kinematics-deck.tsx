
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { kinematicsFlashcards } from '@/lib/flashcards/kinematics';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, RotateCw, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { updateDeckProgress } from '@/lib/progress';

type CardStatus = 'done' | 'later';

// Custom hook for localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}


// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const DECK_ID = 'kinematics';
const DECK_SUBJECT = 'Physics';

export default function KinematicsDeck() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useLocalStorage<Record<string, CardStatus>>('kinematics-statuses', {});
  const [shuffledCards, setShuffledCards] = useLocalStorage('kinematics-shuffled-deck', []);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Initial shuffle if the deck is new
    if (shuffledCards.length === 0) {
      setShuffledCards(shuffleArray(kinematicsFlashcards));
    }
  }, [shuffledCards.length, setShuffledCards]);


  const availableCards = useMemo(() => {
    return shuffledCards.filter((card) => cardStatuses[card.id] !== 'done');
  }, [shuffledCards, cardStatuses]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= availableCards.length && availableCards.length > 0) {
      setCurrentIndex(availableCards.length - 1);
    }
  }, [availableCards.length, currentIndex]);
  
  const currentCard = availableCards[currentIndex];
  
  const flipCard = () => setIsFlipped(prev => !prev);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    setIsFlipped(false);
    if (direction === 'next' && currentIndex < availableCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, availableCards.length]);

  const handleMarkAs = (status: CardStatus) => {
    if (!currentCard) return;
    
    const newStatuses = { ...cardStatuses, [currentCard.id]: status };
    setCardStatuses(newStatuses);
    setIsFlipped(false);
    
    // Update progress in Firestore if marked as done
    if (status === 'done') {
        const completedCount = Object.values(newStatuses).filter(s => s === 'done').length;
        updateDeckProgress(DECK_ID, completedCount, kinematicsFlashcards.length, DECK_SUBJECT);

        // Check for completion
        const newAvailableCards = shuffledCards.filter(c => newStatuses[c.id] !== 'done');
        if(newAvailableCards.length === 0){
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 8000);
        }
    }
  };

  const resetProgress = () => {
    setCardStatuses({});
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffledCards(shuffleArray(kinematicsFlashcards));
    setShowConfetti(false);
    updateDeckProgress(DECK_ID, 0, kinematicsFlashcards.length, DECK_SUBJECT);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        flipCard();
      } else if (e.key === 'ArrowRight') {
        handleNavigation('next');
      } else if (e.key === 'ArrowLeft') {
        handleNavigation('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigation]);

  const completedCount = useMemo(() => {
      return Object.values(cardStatuses).filter(s => s === 'done').length;
  }, [cardStatuses]);

  const progress = kinematicsFlashcards.length > 0 ? (completedCount / kinematicsFlashcards.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full min-h-[75vh]">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight">Kinematics Flashcards</h1>
          <p className="text-muted-foreground">Review your understanding of motion.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={resetProgress}>
            <RotateCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/flashcards/physics">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Physics
            </Link>
          </Button>
        </div>
      </header>
      
      <div className="mb-6 space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">
            {completedCount} / {kinematicsFlashcards.length} cards completed
        </p>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        {currentCard ? (
          <>
            <div className="w-full max-w-2xl h-[350px] [perspective:1000px]">
              <div 
                className={cn(
                  "relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
                  isFlipped && "[transform:rotateY(180deg)]"
                )}
                onClick={flipCard}
              >
                {/* Front */}
                <Card className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-6 cursor-pointer">
                  <CardContent className="text-center">
                    <p className="text-xl font-semibold">{currentCard.question}</p>
                    <span className="text-xs text-muted-foreground absolute bottom-4">Click to reveal answer</span>
                  </CardContent>
                   {cardStatuses[currentCard.id] === 'later' && (
                        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 dark:bg-yellow-900/50 dark:text-yellow-300">
                           <Clock className="w-3 h-3"/> Marked for Later
                        </div>
                    )}
                </Card>
                {/* Back */}
                <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center p-6 cursor-pointer bg-primary/10">
                   <CardContent className="text-center">
                    <p className="text-lg font-medium">{currentCard.answer}</p>
                     <span className="text-xs text-muted-foreground absolute bottom-4">Click to see question</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
              <Button variant="outline" size="icon" onClick={() => handleNavigation('prev')} disabled={currentIndex === 0}>
                <ArrowLeft />
              </Button>
              <span className="text-muted-foreground font-semibold tabular-nums">
                {currentIndex + 1} / {availableCards.length}
              </span>
              <Button variant="outline" size="icon" onClick={() => handleNavigation('next')} disabled={currentIndex === availableCards.length - 1}>
                <ArrowRight />
              </Button>
            </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => handleMarkAs('done')}>
                <Check className="mr-2" /> Got it! (Mark as Done)
              </Button>
               <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => handleMarkAs('later')}>
                <Clock className="mr-2" /> Review Later
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
            <p className="text-muted-foreground mb-6">You've completed all the flashcards in this deck.</p>
            <Button onClick={resetProgress}>
                <RotateCw className="mr-2 h-4 w-4" /> Study Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
