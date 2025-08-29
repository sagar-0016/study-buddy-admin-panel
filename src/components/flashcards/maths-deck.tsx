
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sigma, FlaskConical, Atom, BrainCircuit, Rocket, Plus, Minus, Divide, Pi, CaseUpper, Shapes, FunctionSquare, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const mathDecks = [
    {
        title: 'Algebra Basics',
        description: 'Introduction to variables, expressions, and solving linear equations step by step.',
        icon: CaseUpper,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Geometry Fundamentals',
        description: 'Explore shapes, angles, area, perimeter, and basic geometric theorems and proofs.',
        icon: Shapes,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Trigonometry',
        description: 'Master sine, cosine, tangent, and their applications in solving triangles and wave functions.',
        icon: FunctionSquare,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Calculus I',
        description: 'Learn limits, derivatives, and their applications in optimization and curve analysis.',
        icon: () => <span className="text-3xl">∫</span>,
        status: 'coming-soon',
        difficulty: 'Advanced',
        href: '/flashcards/not-for-you',
    },
     {
        title: 'Calculus II',
        description: 'Master integration techniques, series, and applications of definite integrals.',
        icon: Sigma,
        status: 'coming-soon',
        difficulty: 'Advanced',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Statistics & Probability',
        description: 'Understand data analysis, probability distributions, and statistical inference.',
        icon: Bot,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
];

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const getDifficultyClass = () => {
        switch (difficulty.toLowerCase()) {
            case 'basic': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-muted text-muted-foreground';
        }
    }
    return (
         <Badge className={`mt-4 font-semibold ${getDifficultyClass()}`}>{difficulty}</Badge>
    )
}


const DeckCard = ({ deck }: { deck: (typeof mathDecks)[0] }) => {
  const isAvailable = deck.status === 'available';
  const cardContent = (
    <Card className={cn("flex flex-col h-full transition-all duration-300", 
        isAvailable ? "hover:border-primary hover:-translate-y-1 hover:shadow-lg cursor-pointer" : "opacity-70 bg-muted/50"
    )}>
        <CardHeader className="flex-row items-start justify-between">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
                <deck.icon className="w-8 h-8" />
            </div>
             <Badge variant={isAvailable ? 'default' : 'outline'}>{isAvailable ? 'Available' : 'Coming Soon'}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <CardTitle className="text-xl mb-2">{deck.title}</CardTitle>
            <CardDescription className="flex-grow">{deck.description}</CardDescription>
            <DifficultyBadge difficulty={deck.difficulty} />
        </CardContent>
    </Card>
  );

  if (isAvailable) {
    return <Link href={deck.href}>{cardContent}</Link>
  }
  return <div>{cardContent}</div>;
};

export default function MathsDeck() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mathematics Flashcards</h1>
        <p className="text-muted-foreground">
          Select a chapter to begin your study session.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {mathDecks.map((deck) => (
            <DeckCard key={deck.title} deck={deck} />
        ))}
      </div>
      <div className="text-center pt-4">
        <Link href="/flashcards" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to all subjects
        </Link>
      </div>
    </div>
  );
}
