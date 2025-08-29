"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks } from "lucide-react";

const AddRevisionTopicForm = () => {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="rev-subject">Subject</Label>
                    <Select>
                        <SelectTrigger id="rev-subject">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="maths">Maths</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="rev-chapter">Chapter</Label>
                    <Input id="rev-chapter" placeholder="e.g., Rotational Motion" />
                </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="rev-topic">Topic to Recall</Label>
                <Input id="rev-topic" placeholder="e.g., Moment of Inertia of a solid sphere" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="rev-hints">Hints</Label>
                <Textarea id="rev-hints" placeholder="Add keywords, formulas, or short notes to jog memory." />
            </div>
            <Button>Add Revision Topic</Button>
        </div>
    )
}

const AddQuestionForm = ({ isTricky = false }: { isTricky?: boolean }) => {
    return (
         <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="q-text">Question Text</Label>
                <Textarea id="q-text" placeholder="Enter the full question here..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="q-subject">Subject</Label>
                    <Select>
                        <SelectTrigger id="q-subject">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="maths">Maths</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="q-type">Answer Type</Label>
                    <Select>
                        <SelectTrigger id="q-type">
                            <SelectValue placeholder="Select answer type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="options">Multiple Choice</SelectItem>
                            <SelectItem value="text">Text Input</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid gap-4">
                <Label>Options (for Multiple Choice)</Label>
                <Input placeholder="Option A" />
                <Input placeholder="Option B" />
                <Input placeholder="Option C" />
                <Input placeholder="Option D" />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="q-answer">Correct Answer</Label>
                <Input id="q-answer" placeholder="Enter the correct option (e.g., A) or text answer" />
            </div>
            <Button>Add {isTricky ? 'Tricky' : ''} Question</Button>
        </div>
    )
}

const AddBrainstormerForm = () => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="brainstormer-subject">Subject</Label>
                 <Select>
                    <SelectTrigger id="brainstormer-subject">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="maths">Maths</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="brainstormer-q">Brainstorming Question</Label>
                <Textarea id="brainstormer-q" placeholder="Enter the thought-provoking question or scenario." />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="brainstormer-guide">Guideline / Hint</Label>
                <Textarea id="brainstormer-guide" placeholder="Provide a brief guideline or hint for the user's thought process." />
            </div>
            <Button>Add Brainstormer</Button>
        </div>
    )
}


export default function ContentPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-6 w-6" /> Content Management
                </CardTitle>
                <CardDescription>
                    Add new revision topics, questions, and brainstorming prompts to the user's app.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="revisions">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="revisions">Revision Topics</TabsTrigger>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="tricky">Tricky Questions</TabsTrigger>
                        <TabsTrigger value="brainstormers">Brainstormers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="revisions" className="pt-6">
                        <AddRevisionTopicForm />
                    </TabsContent>
                    <TabsContent value="questions" className="pt-6">
                        <AddQuestionForm />
                    </TabsContent>
                    <TabsContent value="tricky" className="pt-6">
                        <AddQuestionForm isTricky />
                    </TabsContent>
                    <TabsContent value="brainstormers" className="pt-6">
                        <AddBrainstormerForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
