
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const pyqSuggestions = [
    { id: 1, topic: 'Rotational Motion', currentWeightage: 5, suggestion: 'This should be Level 4, less frequent now.', user: 'Sagar', date: '2023-10-28' },
    { id: 2, topic: 'Chemical Kinetics', currentWeightage: 3, suggestion: 'Definitely Level 4, at least one question always comes.', user: 'Sagar', date: '2023-10-27' },
];

const plannerUpdates = [
    { id: 1, type: 'Formal Schedule Change', description: 'User updated the formal coaching schedule for MWF.', user: 'Sagar', date: '2023-10-26' },
];


export default function SuggestedChangesPage() {

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Suggested Changes</CardTitle>
                <CardDescription>
                    Review and approve or reject changes suggested by the user from the main app.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pyq">
                    <TabsList>
                        <TabsTrigger value="pyq">PYQ Weightage</TabsTrigger>
                        <TabsTrigger value="planner">Planner Updates</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pyq">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Current Weightage</TableHead>
                                    <TableHead>Suggestion</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pyqSuggestions.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.topic}</TableCell>
                                    <TableCell><Badge>Level {item.currentWeightage}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground">{item.suggestion}</TableCell>
                                    <TableCell>{item.user}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="icon" className="mr-2">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="planner">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Update Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plannerUpdates.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.type}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                                    <TableCell>{item.user}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline">
                                            Sync to Normal Schedule
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
