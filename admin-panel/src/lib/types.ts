import { Timestamp } from 'firebase/firestore';

export interface NavLink {
    href: string;
    label: string;
    icon: React.ElementType;
}

export interface Doubt {
    id: string;
    text: string;
    subject: string;
    imageUrl?: string;
    isAddressed: boolean;
    isCleared: boolean;
    createdAt: Timestamp;
    addressedText?: string;
}

export interface TechnicalHelp {
    id: string;
    text: string;
    category: string;
    imageUrl?: string;
    isAddressed: boolean;
    isCleared: boolean;
    createdAt: Timestamp;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  videoUrl: string;
  thumbnailUrl: string;
  channel?: string;
  duration?: string;
  createdAt: Timestamp;
}

export interface Activity {
    id: string;
    user: string;
    type: 'Doubt' | 'Help Request' | 'Mood' | 'Suggestion';
    status: 'Pending' | 'Addressed' | 'Happy' | 'Sad';
    date: Timestamp;
}

export interface MoodEntry {
    id: string;
    mood: string;
    createdAt: Timestamp;
}

export interface Flashcard {
    id: string;
    question: string;
    answer: string;
}

export interface FlashcardDeck {
    id: string;
    title: string;
    description: string;
    category: 'physics' | 'chemistry' | 'maths' | 'main';
    status: 'available' | 'coming soon';
    icon: string;
    href: string;
    cardCount: number;
    difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
}
