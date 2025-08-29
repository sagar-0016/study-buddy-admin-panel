
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPersonalizedFeedbackAction } from '@/lib/actions';
import { Loader2, Sparkles, Lightbulb, ClipboardCheck } from 'lucide-react';

type Feedback = {
  appreciation: string;
  pyqSuggestions: string;
  reviewAreas: string;
};

export default function PersonalizedFeedback() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFeedback = async () => {
    setIsLoading(true);
    setFeedback(null);
    setError(null);

    try {
      // Call the single, streamlined server action.
      // All data fetching now happens on the server within the Genkit flow.
      const result = await getPersonalizedFeedbackAction();
      setFeedback(result);

    } catch (err) {
      console.error("Failed to get feedback:", err);
      setError("Could not generate feedback at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Study Buddy</CardTitle>
        <CardDescription>
          Click the button below to get some positive and helpful feedback based on your recent activity in the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Your study buddy is thinking...</p>
            </div>
        )}
        {error && <p className="text-destructive text-center">{error}</p>}
        {feedback && (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-semibold flex items-center mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                A Quick Note!
              </h3>
              <p className="text-muted-foreground italic">"{feedback.appreciation}"</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-semibold flex items-center mb-2">
                <ClipboardCheck className="h-5 w-5 mr-2 text-accent" />
                Next Step: PYQs
              </h3>
              <p className="text-muted-foreground">{feedback.pyqSuggestions}</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-semibold flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Focus Areas for Review
              </h3>
              <p className="text-muted-foreground">{feedback.reviewAreas}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateFeedback} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Generating...' : 'Get My Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
}
