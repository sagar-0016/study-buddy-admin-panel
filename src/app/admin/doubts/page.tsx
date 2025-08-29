
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Check, Loader2, Image as ImageIcon, Edit, Send, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getDoubts, markDoubtAsAddressed, updateDoubtResponse } from "@/lib/admin/firebase-actions";
import type { Doubt } from "@/lib/admin/types";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";


const PendingDoubtCard = ({ doubt, onAddressed }: { doubt: Doubt, onAddressed: () => void }) => {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleAddress = async () => {
        if (!reply.trim()) {
            toast({ title: 'Response is empty', description: 'Please provide a response before submitting.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            await markDoubtAsAddressed(doubt.id, reply);
            toast({ title: 'Success', description: 'Doubt has been marked as addressed.' });
            onAddressed();
        } catch (error) {
            toast({ title: 'Error', description: 'Could not address the doubt.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{doubt.subject}</CardTitle>
            <CardDescription>
                {formatDistanceToNow(doubt.createdAt.toDate(), { addSuffix: true })}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-wrap">{doubt.text}</p>
        {doubt.imageUrl && (
             <Dialog>
                <DialogTrigger asChild>
                    <button type="button" className="mt-2 rounded-lg overflow-hidden border w-full max-w-xs group relative">
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
      <CardFooter className="flex-col items-start gap-4 bg-muted/50 p-4 rounded-b-lg">
        <Textarea placeholder="Type your response here..." value={reply} onChange={(e) => setReply(e.target.value)} rows={4} />
        <Button onClick={handleAddress} disabled={isSubmitting || !reply.trim()}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Response
        </Button>
      </CardFooter>
    </Card>
  );
};

const AddressedDoubtCard = ({ doubt, onResponseUpdated }: { doubt: Doubt, onResponseUpdated: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedResponse, setEditedResponse] = useState(doubt.addressedText || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const handleUpdate = async () => {
         if (!editedResponse.trim()) {
            toast({ title: 'Response is empty', description: 'Please provide a response.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateDoubtResponse(doubt.id, editedResponse);
            toast({ title: 'Success', description: 'Response has been updated.' });
            onResponseUpdated();
            setIsEditing(false);
        } catch(error) {
             toast({ title: 'Error', description: 'Could not update the response.', variant: 'destructive' });
        } finally {
             setIsSubmitting(false);
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{doubt.subject}</CardTitle>
                    <div className="flex items-center gap-2">
                         <CardDescription>
                            {formatDistanceToNow(doubt.createdAt.toDate(), { addSuffix: true })}
                        </CardDescription>
                        {doubt.isCleared ? (
                             <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Cleared by User
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Not Cleared
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground whitespace-pre-wrap">{doubt.text}</p>
                 {doubt.imageUrl && (
                     <Dialog>
                        <DialogTrigger asChild>
                            <button type="button" className="mt-2 rounded-lg overflow-hidden border w-full max-w-xs group relative">
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
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">Response:</h4>
                    {isEditing ? (
                        <Textarea value={editedResponse} onChange={(e) => setEditedResponse(e.target.value)} rows={4} />
                    ) : (
                        <p className="text-sm whitespace-pre-wrap">{doubt.addressedText}</p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                 {isEditing ? (
                    <div className="flex gap-2">
                        <Button onClick={handleUpdate} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                 ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Response
                    </Button>
                 )}
            </CardFooter>
        </Card>
    )
}


const DoubtsList = ({ type }: { type: 'pending' | 'addressed' }) => {
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDoubts = async () => {
        setIsLoading(true);
        const data = await getDoubts(type);
        setDoubts(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchDoubts();
    }, [type])


    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (doubts.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No {type} doubts</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    All clear for now!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {doubts.map(doubt => (
                type === 'pending' ?
                <PendingDoubtCard key={doubt.id} doubt={doubt} onAddressed={fetchDoubts} />
                :
                <AddressedDoubtCard key={doubt.id} doubt={doubt} onResponseUpdated={fetchDoubts} />
            ))}
        </div>
    )
}


export default function DoubtsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Doubts</CardTitle>
          <CardDescription>
            View and address user-submitted academic doubts.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="addressed">Addressed</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="pt-6">
                    <DoubtsList type="pending" />
                </TabsContent>
                <TabsContent value="addressed" className="pt-6">
                     <DoubtsList type="addressed" />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
