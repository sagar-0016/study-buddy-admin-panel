
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna, Sigma, FlaskConical, Atom, Rocket, BrainCircuit } from 'lucide-react';

const decks = [
  {
    title: 'Biology Fundamentals',
    description: 'Dive into the building blocks of life, from cellular structures to complex biological processes.',
    icon: Dna,
    status: 'not-available',
    href: '/flashcards/not-for-you',
  },
  {
    title: 'Mathematics',
    description: 'Master algebra, geometry, and calculus concepts with interactive problem-solving flashcards.',
    icon: Sigma,
    status: 'available',
    href: '/flashcards/maths',
  },
  {
    title: 'Chemistry Basics',
    description: 'Master the periodic table, chemical reactions, and fundamental principles of chemistry.',
    icon: FlaskConical,
    status: 'available',
    href: '/flashcards/chemistry',
  },
  {
    title: 'Physics Concepts',
    description: 'Understand the fundamental laws that govern our universe, from mechanics to quantum physics.',
    icon: Atom,
    status: 'available',
    href: '/flashcards/physics',
  },
   {
    title: 'AI & Machine Learning',
    description: 'Explore the core concepts of AI, neural networks, and machine learning algorithms.',
    icon: BrainCircuit,
    status: 'not-available',
    href: '/flashcards/not-for-you',
  },
  {
    title: 'Space & Astronomy',
    description: 'Journey through the cosmos and learn about planets, stars, galaxies, and the mysteries of space.',
    icon: Rocket,
    status: 'not-available',
    href: '/flashcards/not-for-you',
  },
];

const DeckCard = ({ deck }: { deck: (typeof decks)[0] }) => {
  const isAvailable = deck.status === 'available';

  const getBadgeText = () => {
    if (deck.status === 'available') return 'Available';
    if (deck.status === 'not-for-you' || deck.status === 'not-available') return 'Not for you babe';
    return 'Coming Soon';
  };

  const cardContent = (
    <Card className={`flex flex-col h-full transition-all duration-300 ${isAvailable ? 'hover:border-primary hover:-translate-y-1 hover:shadow-lg' : 'opacity-80 hover:border-destructive hover:-translate-y-1 hover:shadow-lg'}`}>
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-full ${isAvailable ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            <deck.icon className="w-8 h-8" />
          </div>
          <Badge variant={isAvailable ? 'default' : 'destructive'}>
            {getBadgeText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex flex-col flex-grow">
        <CardTitle className="text-xl mb-2">{deck.title}</CardTitle>
        <CardDescription className="flex-grow">{deck.description}</CardDescription>
      </CardContent>
    </Card>
  );

  if (isAvailable) {
    return <Link href={deck.href}>{cardContent}</Link>;
  }
  
  return <Link href={deck.href}>{cardContent}</Link>;
};

export default function DeckSelection() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <DeckCard key={deck.title} deck={deck} />
      ))}
    </div>
  );
}
