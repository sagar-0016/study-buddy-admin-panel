
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, MessageSquare, Image as ImageIcon, CheckCircle2, AlertCircle, HelpCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getDoubts, addDoubt, markDoubtAsCleared } from '@/lib/doubts';
import type { Doubt } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const AddDoubtDialog = ({ onDoubtAdded, children }: { onDoubtAdded: () => void, children: React.ReactNode }) => {
    const [text, setText] = useState('');
    const [subject, setSubject] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const canSubmit = useMemo(() => text && subject, [text, subject]);

    const resetForm = () => {
        setText('');
        setSubject('');
        setImageFile(null);
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSaving(true);
        try {
            await addDoubt({
                text,
                subject,
                imageFile: imageFile || undefined
            });
            toast({ title: "Success!", description: "Your doubt has been submitted." });
            onDoubtAdded();
            setIsOpen(false);
            resetForm();
        } catch (error) {
             toast({ title: "Error", description: "Could not submit your doubt.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Ask a New Doubt</DialogTitle>
                    <DialogDescription>
                        Clearly describe your question. Attach an image if it helps.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select onValueChange={setSubject} value={subject}>
                            <SelectTrigger id="subject">
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Maths">Maths</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="doubt-text">Your Question</Label>
                        <Textarea id="doubt-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Explain your doubt in detail here..." rows={5} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Attach Image (Optional)</Label>
                        <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                     <Button onClick={handleSubmit} disabled={isSaving || !canSubmit}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit Doubt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DoubtCard = ({ doubt, onCleared }: { doubt: Doubt, onCleared: (id: string) => void }) => {
    const getStatus = () => {
        if (doubt.isCleared) return { text: 'Cleared by you', icon: CheckCircle2, color: 'text-green-600' };
        if (doubt.isAddressed) return { text: 'Addressed', icon: AlertCircle, color: 'text-yellow-600' };
        return { text: 'Pending', icon: HelpCircle, color: 'text-muted-foreground' };
    };

    const { text, icon: Icon, color } = getStatus();

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardDescription>
                        {formatDistanceToNow(doubt.createdAt.toDate(), { addSuffix: true })}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                         <Badge variant={doubt.subject === 'Physics' ? 'default' : doubt.subject === 'Chemistry' ? 'destructive' : 'secondary'}>
                            {doubt.subject}
                        </Badge>
                        <Badge variant={doubt.isCleared ? 'default' : doubt.isAddressed ? 'outline' : 'secondary'} className="flex items-center gap-1">
                            <Icon className={`h-3 w-3 ${color}`} />
                            {text}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{doubt.text}</p>
                {doubt.imageUrl && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button type="button" className="mt-4 rounded-lg overflow-hidden border w-full max-w-xs group relative">
                                <Image src={doubt.imageUrl} alt="Doubt image" width={300} height={200} className="object-cover w-full" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon className="h-8 w-8 text-white" />
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                             <Image src={doubt.imageUrl} alt="Doubt image" width={800} height={600} className="rounded-lg object-contain" />
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
            {doubt.isAddressed && !doubt.isCleared && (
                 <CardFooter>
                    <Button onClick={() => onCleared(doubt.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Cleared
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};


export default function DoubtCentre() {
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchDoubts = useCallback(async () => {
        setIsLoading(true);
        const fetchedDoubts = await getDoubts();
        setDoubts(fetchedDoubts);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDoubts();
    }, [fetchDoubts]);
    
    const handleMarkCleared = async (id: string) => {
        try {
            await markDoubtAsCleared(id);
            setDoubts(prev => prev.map(d => d.id === id ? { ...d, isCleared: true } : d));
            toast({ title: 'Success', description: 'Doubt marked as cleared.' });
        } catch(error) {
            toast({ title: 'Error', description: 'Could not update the doubt status.', variant: 'destructive' });
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            );
        }

        if (doubts.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[40vh]">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Doubts Here</h3>
                    <p className="text-muted-foreground">Looks like you're all clear! Ask a new question to get started.</p>
                </div>
            );
        }
        
        return (
            <div className="space-y-4">
                {doubts.map(doubt => (
                    <DoubtCard key={doubt.id} doubt={doubt} onCleared={handleMarkCleared} />
                ))}
            </div>
        )
    }

    return (
         <div className="relative">
             {renderContent()}

            <div className="fixed bottom-8 right-8 z-50">
               <AddDoubtDialog onDoubtAdded={fetchDoubts}>
                    <Button className="rounded-full h-14 w-14 p-4 shadow-lg flex items-center justify-center">
                        <Plus className="h-6 w-6" />
                        <span className="sr-only">Ask a new doubt</span>
                    </Button>
               </AddDoubtDialog>
           </div>
        </div>
    );
}
