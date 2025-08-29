
"use client";

import Link from "next/link"
import {
  ArrowUpRight,
  BookOpenCheck,
  Sun,
  Smile,
  Frown,
  Meh,
  Brain,
  MessageSquareWarning,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { getRecentActivity, getRecentMoodEntries } from "@/lib/admin/firebase-actions";
import type { Activity, MoodEntry } from "@/lib/admin/types";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";


const ActivityTable = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoading(true);
            const data = await getRecentActivity(5);
            setActivities(data);
            setIsLoading(false);
        }
        fetchActivity();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activities.map((activity) => (
                    <TableRow key={activity.id}>
                        <TableCell>
                            <div className="font-medium">{activity.user}</div>
                            {/* Assuming a static email for now */}
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {activity.user.toLowerCase()}@example.com
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className="text-xs" variant="outline">
                                {activity.type}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className="text-xs" variant={activity.status === 'Pending' ? 'destructive' : 'secondary'}>
                                {activity.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(activity.date.toDate(), 'yyyy-MM-dd')}</TableCell>
                        <TableCell className="text-right">
                        <Link href={activity.type === 'Doubt' ? '/admin/doubts' : '/admin/help'} className="text-primary hover:underline">View</Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const MoodTrackerCard = () => {
    const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMood = async () => {
            setIsLoading(true);
            const moods = await getRecentMoodEntries(1);
            if (moods.length > 0) {
                setLatestMood(moods[0]);
            }
            setIsLoading(false);
        }
        fetchMood();
    }, []);

    const moodEmojis: { [key: string]: React.ReactNode } = {
        motivated: <Smile className="text-green-500" />,
        focused: <Brain className="text-blue-500" />,
        worried: <Frown className="text-yellow-500" />,
        tinkering: <Meh className="text-purple-500" />,
        'warning-to-complain': <MessageSquareWarning className="text-red-500" />,
        default: <Smile />,
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mood Tracker</CardTitle>
                <CardDescription>Last recorded mood and time.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                ) : latestMood ? (
                    <>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">
                           {moodEmojis[latestMood.mood.toLowerCase()] || moodEmojis.default}
                            </span>
                            <div>
                                <p className="font-semibold capitalize">{latestMood.mood}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(latestMood.createdAt.toDate(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <pre className="mt-4 p-2 bg-muted rounded-md text-xs overflow-auto font-mono">
                            {JSON.stringify(latestMood, (key, value) => {
                                if (key === 'createdAt' && value && value.toDate) {
                                    return value.toDate().toISOString();
                                }
                                return value;
                            }, 2)}
                        </pre>
                    </>
                ) : (
                     <p className="text-sm text-muted-foreground">No mood entries found yet.</p>
                )}
            </CardContent>
        </Card>
    )
}


export default function AdminDashboard() {
  return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Set Day Type</CardTitle>
                        <CardDescription>Mark today as a coaching day or a holiday.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button><BookOpenCheck className="mr-2 h-4 w-4"/>Coaching Day</Button>
                        <Button variant="outline"><Sun className="mr-2 h-4 w-4"/>Holiday</Button>
                    </CardContent>
                </Card>
                <MoodTrackerCard />
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    A log of recent user activities and system events.
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="/admin">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap">
                  <ActivityTable />
                </ScrollArea>
              </CardContent>
            </Card>
        </div>
  )
}
