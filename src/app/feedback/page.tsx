import type { Metadata } from 'next';
import PersonalizedFeedback from '@/components/feedback/personalized-feedback';

export const metadata: Metadata = {
  title: 'AI Feedback',
};

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Personalized Feedback</h1>
        <p className="text-muted-foreground">
          Let our AI analyze your performance and suggest areas for improvement.
        </p>
      </div>
      <PersonalizedFeedback />
    </div>
  );
}
