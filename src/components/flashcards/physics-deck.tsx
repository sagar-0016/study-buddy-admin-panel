"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Orbit, Wind, Atom, Waves, Thermometer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const physicsDecks = [
    {
        title: 'Kinematics',
        description: 'Study motion, including displacement, velocity, and acceleration, without considering its causes.',
        icon: Wind,
        status: 'available',
        difficulty: 'Basic',
        href: '/flashcards/physics/kinematics',
    },
    {
        title: "Forces, Newton's Laws & Friction",
        description: 'Understand the fundamental principles governing motion and the forces that resist it.',
        icon: Orbit,
        status: 'available',
        difficulty: 'Intermediate',
        href: '/flashcards/physics/forces',
    },
    {
        title: 'Thermodynamics',
        description: 'Explore heat, temperature, and the transfer of energy in physical systems.',
        icon: Thermometer,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Electricity & Magnetism',
        description: 'Delve into electric circuits, magnetic fields, and electromagnetic waves.',
        icon: Zap,
        status: 'coming-soon',
        difficulty: 'Advanced',
        href: '/flashcards/not-for-you',
    },
    {
        title: 'Optics',
        description: 'Study the behavior of light, from reflection and refraction to wave optics.',
        icon: Waves,
        status: 'coming-soon',
        difficulty: 'Intermediate',
        href: '/flashcards/not-for-you',
    },
     {
        title: 'Modern Physics',
        description: 'Grasp the concepts of relativity, quantum mechanics, and nuclear physics.',
        icon: Atom,
        status: 'coming-soon',
        difficulty: 'Advanced',
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


const DeckCard = ({ deck }: { deck: (typeof physicsDecks)[0] }) => {
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

export default function PhysicsDeck() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Physics Flashcards</h1>
        <p className="text-muted-foreground">
          Select a chapter to begin your study session.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {physicsDecks.map((deck) => (
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