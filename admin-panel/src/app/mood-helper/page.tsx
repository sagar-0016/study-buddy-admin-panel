"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Smile, Loader2, List, Brain, Frown, Meh, MessageSquareWarning } from "lucide-react";
import { addMessagesToCollection, getRecentMoodEntries } from "@/lib/firebase-actions";
import { useToast } from "@/app/hooks/use-toast";
import type { MoodEntry } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const moodCategories = {
    "motivated": { label: "Motivated", collection: "motivation-motivated" },
    "focused": { label: "Focused", collection: "motivation-focused" },
    "worried": { label: "Worried", collection: "motivation-worried" },
    "motivated-formal": { label: "Motivated (Formal)", collection: "motivation-motivated-formal" },
    "focused-formal": { label: "Focused (Formal)", collection: "motivation-focused-formal" },
    "worried-formal": { label: "Worried (Formal)", collection: "motivation-worried-formal" },
    "tinkering": { label: "Tinkering", collection: "tinkering-messages" },
    "warning-to-complain": { label: "Warning to Complain", collection: "threatening-messages" }
}

const moodEmojis: { [key: string]: React.ReactNode } = {
    motivated: <Smile className="text-green-500" />,
    focused: <Brain className="text-blue-500" />,
    worried: <Frown className="text-yellow-500" />,
    tinkering: <Meh className="text-purple-500" />,
    'warning-to-complain': <MessageSquareWarning className="text-red-500" />,
    default: <Smile />,
}

const RecentMoodsList = ({ limit }: { limit: number }) => {
    const [moods, setMoods] = useState<MoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMoods = async () => {
            setIsLoading(true);
            const data = await getRecentMoodEntries(limit);
            setMoods(data);
            setIsLoading(false);
        };
        fetchMoods();
    }, [limit]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )
    }
    
    if (moods.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center p-4">
                No recent mood entries found.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {moods.map((mood) => (
                <div key={mood.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                        {moodEmojis[mood.mood.toLowerCase()] || moodEmojis.default}
                        <span className="font-medium capitalize">{mood.mood}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(mood.createdAt.toDate(), { addSuffix: true })}
                    </span>
                </div>
            ))}
        </div>
    )
}


export default function MoodHelperPage() {
  const [mood, setMood] = useState("");
  const [dataType, setDataType] = useState<"text" | "json" | "array">("text");
  const [data, setData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [moodsLimit, setMoodsLimit] = useState(10);


  const resetForm = () => {
    setMood("");
    setData("");
    setDataType("text");
  }

  const handleSubmit = async () => {
    if (!mood || !data) {
        toast({
            title: "Missing Fields",
            description: "Please select a mood and provide data.",
            variant: "destructive"
        });
        return;
    }

    let dataArray: any[] = [];
    
    try {
        if (dataType === 'json') {
            const parsedJson = JSON.parse(data);
            if (typeof parsedJson !== 'object' || Array.isArray(parsedJson) || parsedJson === null) {
                 toast({ title: "Invalid JSON", description: "Input must be a single JSON object.", variant: "destructive" });
                 return;
            }
            dataArray = [parsedJson];
        } else if (dataType === 'array') {
            const parsedArray = JSON.parse(data);
            if (!Array.isArray(parsedArray)) {
                toast({ title: "Invalid Array", description: "The data is not a valid array string.", variant: "destructive" });
                return;
            }
            dataArray = parsedArray;
        } else { // 'text'
            dataArray = [data];
        }
    } catch (error) {
        toast({ title: "Invalid Data", description: "The data could not be parsed correctly for the selected type.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const collectionName = moodCategories[mood as keyof typeof moodCategories].collection;
      await addMessagesToCollection(collectionName, dataArray);
      
      toast({
        title: "Success!",
        description: `${dataArray.length} message(s) have been saved to the '${collectionName}' collection.`,
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save the mood entry. " + (error instanceof Error ? error.message : ""),
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
      if (dataType === 'json') {
        return 'Enter a single valid JSON object, e.g., {"feature": "new_sidebar", "enabled": true}'
      }
      if (dataType === 'array') {
        return 'Enter a valid JSON array, e.g., ["item1", "item2", 123, {"key": "value"}]'
      }
      return 'Enter the text, quote, or message for this mood.';
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-6 w-6" /> Mood Helper
          </CardTitle>
          <CardDescription>
            Add new data that will be fed to the user based on their mood. Select the mood, data type, and provide the data to be stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label>Mood Category</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(moodCategories).map(([key, value]) => (
                            <Button
                                key={key}
                                variant={mood === key ? "default" : "outline"}
                                onClick={() => setMood(key)}
                            >
                                {value.label}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="data-type">Data Type</Label>
                    <Select value={dataType} onValueChange={(value: "text" | "json" | "array") => setDataType(value)}>
                        <SelectTrigger id="data-type" className="w-full md:w-[200px]">
                            <SelectValue placeholder="Select a data type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="json">JSON Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="data-input">Data</Label>
                <Textarea 
                    id="data-input"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder={getPlaceholder()}
                    className={dataType === 'json' || dataType === 'array' ? 'font-mono' : ''}
                    rows={8}
                />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSubmit} disabled={isSubmitting || !mood}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Data
          </Button>
        </CardFooter>
      </Card>
       <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                     <CardTitle className="flex items-center gap-2">
                        <List className="h-6 w-6" /> Recent Moods
                    </CardTitle>
                    <CardDescription>
                        A log of the user's mood entries.
                    </CardDescription>
                </div>
                 <Select value={String(moodsLimit)} onValueChange={(value) => setMoodsLimit(Number(value))}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(10)].map((_, i) => {
                            const value = (i + 1) * 10;
                            return <SelectItem key={value} value={String(value)}>{value} Entries</SelectItem>
                        })}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <RecentMoodsList limit={moodsLimit} />
        </CardContent>
      </Card>
    </div>
  );
}
    
