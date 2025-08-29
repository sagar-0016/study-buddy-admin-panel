'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized, encouraging feedback
 * to students based on their in-app activity.
 *
 * - personalizedFeedback - A function that generates personalized feedback for a student.
 * - PersonalizedFeedbackInput - The input type for the personalizedFeedback function.
 * - PersonalizedFeedbackOutput - The return type for the personalizedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getRecentlyCompletedSyllabus } from '@/lib/syllabus';
import { getRevisionMistakes } from '@/lib/revisions';
import { getRegularQuestionMistakes, getTrickyQuestionMistakes } from '@/lib/questions';

// No input is needed from the client anymore.
const PersonalizedFeedbackInputSchema = z.object({});
export type PersonalizedFeedbackInput = z.infer<typeof PersonalizedFeedbackInputSchema>;

const PersonalizedFeedbackOutputSchema = z.object({
  appreciation: z.string().describe('A short, positive message appreciating the user\'s effort and recent completions.'),
  pyqSuggestions: z.string().describe('Suggestions for which completed topics the user should now practice PYQs for.'),
  reviewAreas: z.string().describe('A gentle guide on topics that might need more review, based on revision and question mistakes.'),
});
export type PersonalizedFeedbackOutput = z.infer<typeof PersonalizedFeedbackOutputSchema>;

// Internal schema for the prompt, which now includes the fetched data.
const InternalPromptInputSchema = z.object({
  recentlyCompletedSyllabus: z.array(z.string()).describe("A list of syllabus topics the user has recently marked as complete."),
  revisionMistakes: z.array(z.object({ topic: z.string(), fails: z.number() })).describe("A list of revision topics where the user has struggled (high fail count)."),
  questionMistakes: z.array(z.string()).describe("A list of questions from the question bank that the user answered incorrectly."),
});


export async function personalizedFeedback(input: PersonalizedFeedbackInput): Promise<PersonalizedFeedbackOutput> {
  return personalizedFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFeedbackPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: PersonalizedFeedbackOutputSchema},
  prompt: `You are a friendly and encouraging AI study buddy for a student named Pranjal who is preparing for the JEE exam. Your role is to provide supportive and actionable feedback based on her activity in the study app.

  IMPORTANT TONE GUIDELINES:
  - Be positive and appreciative. Start by acknowledging her hard work.
  - Do not be a judge. This app is just one of her study tools, so you don't have the full picture of her performance. Your feedback should be a gentle guide, not a performance review.
  - Avoid discouraging language like "you are weak in," "you failed," or "your performance is poor." Instead, use phrases like "it might be helpful to revisit," "let's solidify our understanding of," or "a great next step would be."
  - Keep the feedback concise and focused on a few key areas.

  USER'S RECENT ACTIVITY:
  - Recently Completed Syllabus Topics: 
    {{#each recentlyCompletedSyllabus}}
    - {{this}}
    {{/each}}
  - Revision Topics with Mistakes: 
    {{#each revisionMistakes}}
    - Topic: {{this.topic}}, Fails: {{this.fails}}
    {{/each}}
  - Incorrectly Answered Questions: 
    {{#each questionMistakes}}
    - {{this}}
    {{/each}}

  YOUR TASK:
  Generate a personalized feedback response with three sections:

  1.  **Appreciation**: Write a short, encouraging message (1-2 sentences) praising her for the topics she has recently completed. Congratulate her on her progress.
  2.  **PYQ Suggestions**: Based on the 'Recently Completed Syllabus Topics', suggest that now is a great time to tackle the Previous Year Questions (PYQs) for those specific topics to solidify her understanding.
  3.  **Review Areas**: Gently point out 1-2 common themes or topics that appear in her 'Revision Topics with Mistakes' and 'Incorrectly Answered Questions'. Frame this as a suggestion for what to focus on next. For example, if you see mistakes in both Rotational Motion revisions and a question about torque, you could suggest focusing on that chapter.
  `,
});

const personalizedFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedFeedbackFlow',
    inputSchema: PersonalizedFeedbackInputSchema,
    outputSchema: PersonalizedFeedbackOutputSchema,
  },
  async () => {
    // 1. Fetch all required data from the server-side helper functions.
    const recentlyCompleted = await getRecentlyCompletedSyllabus(5);
    const revisionMistakes = await getRevisionMistakes();
    const regularMistakes = await getRegularQuestionMistakes();
    const trickyMistakes = await getTrickyQuestionMistakes();
    
    // 2. Format the data for the prompt.
    const promptInput: z.infer<typeof InternalPromptInputSchema> = {
      recentlyCompletedSyllabus: recentlyCompleted.slice(0, 5),
      revisionMistakes: revisionMistakes.slice(0, 5).map(r => ({ topic: r.topicName, fails: r.recallFails })),
      questionMistakes: [...regularMistakes, ...trickyMistakes].map(q => q.questionText).slice(0, 5),
    };
    
    // 3. Call the prompt with the fetched data.
    const {output} = await prompt(promptInput);
    return output!;
  }
);
