
import { DocumentData, Timestamp } from 'firebase/firestore';
import {
  BarChart3,
  BookCheck,
  BrainCircuit,
  Clapperboard,
  ClipboardList,
  FileQuestion,
  Flame,
  Home,
  Layers,
  Lightbulb,
  ListChecks,
  MessageSquareQuote,
  MessageSquareWarning,
  Notebook,
  Smile,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const userNavLinks: NavLink[] = [
  { href: "/", label: "Syllabus", icon: BookCheck },
  { href: "/questions", label: "Questions", icon: ClipboardList },
  { href: "/flashcards", label: "Flashcards", icon: Notebook },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/revisions", label: "Revisions", icon: BrainCircuit },
  { href: "/lectures", label: "Lectures", icon: Clapperboard },
  { href: "/tricky-topics", label: "Tricky Topics", icon: Flame },
  { href: "/doubts", label: "Doubt Centre", icon: MessageSquareQuote },
  { href: "/help", label: "Help", icon: MessageSquareWarning },
  { href: "/feedback", label: "AI Feedback", icon: Lightbulb },
];

export const adminNavLinks: NavLink[] = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/mood-helper", label: "Mood Helper", icon: Smile },
    { href: "/admin/suggested-changes", label: "Suggested Changes", icon: Lightbulb },
    { href: "/admin/content", label: "Content", icon: ListChecks },
    { href: "/admin/lectures", label: "Lectures", icon: Clapperboard },
    { href: "/admin/flashcards", label: "Flashcards", icon: Layers },
    { href: "/admin/doubts", label: "Doubts", icon: FileQuestion },
    { href: "/admin/help", label: "Help Requests", icon: MessageSquareWarning },
];


export type SyllabusChapter = {
    name: string;
    weightage: number;
    unit: string;
}

export type Chapter = {
  title: string;
  topics: SyllabusChapter[];
};

export type Subject = {
  label: string;
  chapters: Chapter[];
};

export type Syllabus = {
  physics: Subject;
  chemistry: Subject;
  maths: Subject;
};

export type ChartData = {
  [key: string]: string | number;
}[];

export type BarChartData = {
  subject: string;
  score: number;
}[];

export interface Question extends DocumentData {
  id: string;
  questionText: string;
  questionImageURL?: string;
  answerType: 'options' | 'text';
  options?: string[];
  correctAnswer: string;
  isAttempted: boolean;
  subject: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export type Flashcard = {
    id: number;
    question: string;
    answer: string;
};

export type ProgressData = {
  id: string;
  completed: number;
  total: number;
  subject: string;
};

export type SyllabusTopic = {
  id: string;
  completed: boolean;
};

export interface RevisionTopic extends DocumentData {
  id: string;
  subject: string;
  chapterName: string;
  topicName: string;
  hints: string;
  hintsImageURL?: string;
  recallSuccess: number;
  recallFails: number;
  lastReviewed: Timestamp;
}

export type PyqProgress = {
  id: string;
  completed: boolean;
};

export interface Lecture extends DocumentData {
  id: string;
  title: string;
  description: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  videoUrl: string;
  thumbnailUrl: string;
  channel: string;
  duration: string;
}

export interface Doubt extends DocumentData {
    id: string;
    text: string;
    subject: string;
    imageUrl?: string;
    isAddressed: boolean;
    isCleared: boolean;
    createdAt: Timestamp;
    addressedText?: string;
}

export interface TechnicalHelp extends DocumentData {
    id: string;
    text: string;
    category: string;
    imageUrl?: string;
    isAddressed: boolean;
    isCleared: boolean;
    createdAt: Timestamp;
}

export interface BrainstormingTopic extends DocumentData {
    id: string;
    subject: string;
    question: string;
    guideline: string;
}

export interface BrainstormingSubmission extends DocumentData {
    id: string;
    topicId: string;
    topicQuestion: string;
    thoughts: string;
    submittedAt: Timestamp;
}
