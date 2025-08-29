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
import { MessageSquareWarning, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getHelpRequests, markHelpAsAddressed } from "@/lib/firebase-actions";
import { TechnicalHelp } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const HelpRequestCard = ({ request, onAddressed }: { request: TechnicalHelp, onAddressed: () => void }) => {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddress = async () => {
        setIsSubmitting(true);
        await markHelpAsAddressed(request.id);
        onAddressed();
        setIsSubmitting(false);
    }
    
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{request.category}</CardTitle>
            <CardDescription>
                {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-wrap">{request.text}</p>
        {request.imageUrl && (
             <Dialog>
                <DialogTrigger asChild>
                    <button type="button" className="mt-2 rounded-lg overflow-hidden border w-full max-w-xs group relative">
                        <Image src={request.imageUrl} alt="Help request image" width={300} height={200} className="object-cover w-full" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                        <Image src={request.imageUrl} alt="Help request image" width={800} height={600} className="rounded-lg object-contain" />
                </DialogContent>
            </Dialog>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Textarea placeholder="Type your answer or address here..." value={reply} onChange={(e) => setReply(e.target.value)} />
        <Button onClick={handleAddress} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Mark as Addressed
        </Button>
      </CardFooter>
    </Card>
  );
};


const HelpRequestsList = ({ type }: { type: 'pending' | 'addressed' }) => {
    const [requests, setRequests] = useState<TechnicalHelp[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHelpRequests = async () => {
        setIsLoading(true);
        const data = await getHelpRequests(type);
        setRequests(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchHelpRequests();
    }, [type])


    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (requests.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <MessageSquareWarning className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No {type} help requests</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    All clear for now!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {requests.map(request => (
                <HelpRequestCard key={request.id} request={request} onAddressed={fetchHelpRequests} />
            ))}
        </div>
    )
}


export default function HelpPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Help Requests</CardTitle>
          <CardDescription>
            View and address user-submitted technical issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="addressed">Addressed</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="pt-6">
                    <HelpRequestsList type="pending" />
                </TabsContent>
                <TabsContent value="addressed" className="pt-6">
                     <HelpRequestsList type="addressed" />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
