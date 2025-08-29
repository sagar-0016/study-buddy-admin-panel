
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Layers, PlusCircle, Edit, Search, Loader2, Upload, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { addFlashcardDeck, getFlashcardDecks, getCardsForDeck, updateCardInDeck, addCardsToDeck, updateFlashcardDeck, deleteCardFromDeck } from "@/lib/admin/firebase-actions";
import type { FlashcardDeck, Flashcard } from "@/lib/admin/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


const DeleteCardAlert = ({ deckId, cardId, onCardDeleted }: { deckId: string, cardId: string, onCardDeleted: () => void }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCardFromDeck(deckId, cardId);
            toast({ title: "Card Deleted", description: "The flashcard has been permanently removed." });
            onCardDeleted();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete the card.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this flashcard from the deck.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Yes, delete it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


const EditCardDialog = ({ deckId, card, onCardUpdated, children }: { deckId: string, card: Flashcard, onCardUpdated: () => void, children: React.ReactNode }) => {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(card.answer);
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateCardInDeck(deckId, card.id, { question, answer });
            toast({ title: 'Success!', description: 'Flashcard has been updated.' });
            onCardUpdated();
            setIsOpen(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not update the card.', variant: 'destructive'});
        } finally {
            setIsSaving(false);
        }
    }
    
    const handleDeleted = () => {
        setIsOpen(false);
        onCardUpdated();
    }

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Flashcard</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="card-question">Question</Label>
                        <Textarea id="card-question" value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="card-answer">Answer</Label>
                        <Textarea id="card-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} />
                    </div>
                </div>
                <DialogFooter className="justify-between w-full">
                     <DeleteCardAlert deckId={deckId} cardId={card.id} onCardDeleted={handleDeleted} />
                     <div className="flex gap-2">
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                     </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AddCardsDialog = ({ deckId, onCardsAdded, children }: { deckId: string, onCardsAdded: () => void, children: React.ReactNode }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const placeholder = `[
  {
    "question": "What is the powerhouse of the cell?",
    "answer": "The mitochondria"
  },
  {
    "question": "What is 2 + 2?",
    "answer": "4"
  }
]`;

    const handleAddCards = async () => {
        let cards: { question: string, answer: string }[];
        try {
            cards = JSON.parse(jsonInput);
            if (!Array.isArray(cards) || !cards.every(c => c.question && c.answer)) {
                throw new Error("Invalid JSON structure.");
            }
        } catch (error) {
            toast({ title: "Invalid JSON", description: "Please provide a valid array of {question, answer} objects.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            await addCardsToDeck(deckId, cards);
            toast({ title: 'Success!', description: `${cards.length} cards have been added.`});
            onCardsAdded();
            setJsonInput('');
            setIsOpen(false);
        } catch (error) {
             toast({ title: 'Error', description: "Could not add the cards.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    }


    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Cards in Bulk</DialogTitle>
                    <DialogDescription>
                        Paste a JSON array of cards below. Each object must have a "question" and an "answer" key. Any "id" fields will be ignored.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea 
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={placeholder}
                        rows={15}
                        className="font-mono text-sm"
                    />
                </div>
                <DialogFooter>
                     <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddCards} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Add Cards to Deck
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ManageCardsDialog = ({ deck, onCardsUpdated, children }: { deck: FlashcardDeck, children: React.ReactNode, onCardsUpdated: () => void }) => {
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const fetchCards = async () => {
        if (!isOpen) return;
        setIsLoading(true);
        try {
            const fetchedCards = await getCardsForDeck(deck.id);
            setCards(fetchedCards);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCards();
    }, [isOpen, deck.id]);

    const handleUpdateAndRefetch = () => {
        fetchCards();
        onCardsUpdated();
    }

    const filteredCards = useMemo(() => {
        if (!searchTerm) return cards;
        const lowercasedTerm = searchTerm.toLowerCase();
        return cards.filter(card => 
            card.question.toLowerCase().includes(lowercasedTerm) ||
            card.answer.toLowerCase().includes(lowercasedTerm)
        );
    }, [cards, searchTerm]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Cards for "{deck.title}"</DialogTitle>
                    <div className="flex justify-between items-start pt-2">
                        <DialogDescription>
                            View, search, edit, and add cards to this deck.
                        </DialogDescription>
                         <AddCardsDialog deckId={deck.id} onCardsAdded={handleUpdateAndRefetch}>
                            <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Cards</Button>
                        </AddCardsDialog>
                    </div>
                </DialogHeader>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search questions or answers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <ScrollArea className="flex-grow pr-6 -mr-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                        </div>
                    ) : filteredCards.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCards.map(card => (
                                <Card key={card.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">{card.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{card.answer}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <EditCardDialog deckId={deck.id} card={card} onCardUpdated={handleUpdateAndRefetch}>
                                            <Button variant="outline" size="sm"><Edit className="mr-2 h-3 w-3" /> Edit</Button>
                                        </EditCardDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                           <h3 className="text-lg font-semibold">No Cards in this Deck</h3>
                           <p className="text-sm text-muted-foreground mt-1">Click "Add Cards" to get started.</p>
                       </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

const EditDeckDialog = ({ deck, onDeckUpdated, children }: { deck: FlashcardDeck, onDeckUpdated: () => void, children: React.ReactNode }) => {
    const [title, setTitle] = useState(deck.title);
    const [description, setDescription] = useState(deck.description);
    const [category, setCategory] = useState(deck.category);
    const [status, setStatus] = useState<'available' | 'coming soon'>(deck.status);
    const [icon, setIcon] = useState(deck.icon);
    const [href, setHref] = useState(deck.href);
    const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced' | undefined>(deck.difficulty);
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateFlashcardDeck(deck.id, { title, description, category, status, icon, href, difficulty });
            toast({ title: 'Success!', description: 'Deck has been updated.' });
            onDeckUpdated();
            setIsOpen(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not update the deck.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Deck: {deck.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="deck-title">Deck Title</Label>
                        <Input id="deck-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="deck-desc">Description</Label>
                        <Textarea id="deck-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deck-category">Category</Label>
                             <Select onValueChange={(v: any) => setCategory(v)} value={category}>
                                <SelectTrigger id="deck-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="main">Main</SelectItem>
                                    <SelectItem value="physics">Physics</SelectItem>
                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                    <SelectItem value="maths">Maths</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deck-status">Status</Label>
                            <Select onValueChange={(v: 'available' | 'coming soon') => setStatus(v)} value={status}>
                                <SelectTrigger id="deck-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="coming soon">Coming Soon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deck-icon">Icon</Label>
                            <Input id="deck-icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
                            <CardDescription className="text-xs">Current: {deck.icon}. Find others at lucide.dev</CardDescription>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="deck-href">URL Slug</Label>
                            <Input id="deck-href" value={href} onChange={(e) => setHref(e.target.value)} placeholder="e.g., kinematics" />
                            <CardDescription className="text-xs">Creates URL: /flashcards/{deck.category}/{href}</CardDescription>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deck-difficulty">Difficulty</Label>
                            <Select onValueChange={(v: any) => setDifficulty(v)} value={difficulty}>
                                <SelectTrigger id="deck-difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <div className="flex gap-2">
                         {deck.category !== 'main' && (
                             <ManageCardsDialog deck={deck} onCardsUpdated={onDeckUpdated}>
                                <Button variant="outline">Manage Cards</Button>
                            </ManageCardsDialog>
                        )}
                        <Button onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ManageDecks = () => {
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('title-asc');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const { toast } = useToast();

    const fetchDecks = async () => {
        setIsLoading(true);
        try {
            const fetchedDecks = await getFlashcardDecks();
            setDecks(fetchedDecks);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch flashcard decks.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDecks();
    }, []);
    
    const uniqueCategories = useMemo(() => {
        const categories = new Set(decks.map(deck => deck.category));
        return ['all', ...Array.from(categories)];
    }, [decks]);
    
    const filteredAndSortedDecks = useMemo(() => {
        let filtered = decks;
        
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(deck => deck.category === categoryFilter);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(deck => 
                (deck.title && deck.title.toLowerCase().includes(lowercasedTerm)) ||
                (deck.description && deck.description.toLowerCase().includes(lowercasedTerm)) ||
                (deck.category && deck.category.toLowerCase().includes(lowercasedTerm))
            );
        }

        switch (sortOrder) {
            case 'title-asc':
                return filtered.sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return filtered.sort((a, b) => b.title.localeCompare(a.title));
            case 'category':
                return filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
            case 'status':
                 return filtered.sort((a, b) => a.status.localeCompare(b.status));
            default:
                return filtered;
        }

    }, [decks, searchTerm, sortOrder, categoryFilter]);

    const getDifficultyBadgeClass = (difficulty?: string) => {
        if (!difficulty) return 'bg-muted text-muted-foreground';
        switch(difficulty.toLowerCase()) {
            case 'basic':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700/80';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/80';
            case 'advanced':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700/80';
            default:
                return 'bg-muted text-muted-foreground';
        }
    }


    if (isLoading) {
        return (
             <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                 <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search decks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueCategories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>
                    <AddDeckDialog onDeckAdded={fetchDecks}>
                        <Button className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Add New Deck</Button>
                    </AddDeckDialog>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deck Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedDecks.map((deck) => {
                         const canManageCards = deck.category !== 'main' && deck.status === 'available';
                         
                         return (
                            <TableRow key={deck.id} className={cn("transition-colors", canManageCards && 'cursor-pointer hover:bg-muted/50')} onClick={() => {
                                if (canManageCards) {
                                    // This click is handled by the DialogTrigger inside the cell now
                                }
                            }}>
                                <TableCell className="font-medium">{deck.title}</TableCell>
                                <TableCell><Badge variant="outline" className="capitalize">{deck.category}</Badge></TableCell>
                                <TableCell>
                                    {deck.difficulty && <Badge className={cn(getDifficultyBadgeClass(deck.difficulty))}>{deck.difficulty}</Badge>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={deck.status === 'available' ? 'default' : 'secondary'} className="capitalize">{deck.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <EditDeckDialog deck={deck} onDeckUpdated={fetchDecks}>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDeckDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                         );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

const AddDeckDialog = ({ onDeckAdded, children }: { onDeckAdded: () => void, children: React.ReactNode }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'physics' | 'chemistry' | 'maths' | 'main' | ''>('');
    const [status, setStatus] = useState<'available' | 'coming soon' | ''>('');
    const [icon, setIcon] = useState('');
    const [href, setHref] = useState('');
    const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced' | ''>('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setStatus('');
        setIcon('');
        setHref('');
        setDifficulty('');
    }
    
    const handleSubmit = async () => {
        if (!title || !description || !category || !status || !icon || !href || !difficulty) {
            toast({ title: 'Missing Fields', description: 'Please fill out all fields.', variant: 'destructive'});
            return;
        }
        setIsSaving(true);
        try {
            await addFlashcardDeck({ title, description, category, status, icon, href, difficulty });
            toast({ title: 'Success!', description: 'New flashcard deck has been created.' });
            onDeckAdded();
            resetForm();
            setIsOpen(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not create the deck.', variant: 'destructive'});
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Flashcard Deck</DialogTitle>
                    <DialogDescription>
                        Create a new deck (or chapter) for flashcards. You can upload cards in the next tab.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="deck-title">Deck Title</Label>
                        <Input id="deck-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., General Organic Chemistry" />
                    </div>
                        <div className="grid gap-2">
                        <Label htmlFor="deck-desc">Description</Label>
                        <Textarea id="deck-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the deck's content." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deck-category">Category</Label>
                            <Select onValueChange={(v: any) => setCategory(v)} value={category}>
                                <SelectTrigger id="deck-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="main">Main</SelectItem>
                                    <SelectItem value="physics">Physics</SelectItem>
                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                    <SelectItem value="maths">Maths</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deck-status">Status</Label>
                            <Select onValueChange={(v: any) => setStatus(v)} value={status}>
                                <SelectTrigger id="deck-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="coming soon">Coming Soon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="deck-icon">Icon</Label>
                            <Input id="deck-icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g., Atom" />
                            <CardDescription className="text-xs">Find icons at lucide.dev</CardDescription>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deck-href">URL Slug</Label>
                            <Input id="deck-href" value={href} onChange={(e) => setHref(e.target.value)} placeholder="e.g., organic-chemistry" />
                            <CardDescription className="text-xs">No spaces or special characters.</CardDescription>
                        </div>
                    </div>
                     <div className="grid grid-cols-1">
                         <div className="grid gap-2">
                            <Label htmlFor="deck-difficulty">Difficulty</Label>
                            <Select onValueChange={(v: any) => setDifficulty(v)} value={difficulty}>
                                <SelectTrigger id="deck-difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Deck
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function FlashcardsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-6 w-6" /> Flashcard Management
          </CardTitle>
          <CardDescription>
            Add, edit, and manage flashcard decks and their content.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ManageDecks />
        </CardContent>
      </Card>
    </div>
  );
}
