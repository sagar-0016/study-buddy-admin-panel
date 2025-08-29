'use server';

/**
 * @fileOverview Provides personalized, playful, and flirtatious motivation from 'Saurabh' to 'Pranjal'.
 *
 * - getMotivation - A function that generates personalized motivation.
 * - MotivationInput - The input type for the getMotivation function.
 * - MotivationOutput - The return type for the getMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationInputSchema = z.object({
  senderName: z.string().describe("The name of the sender, e.g., 'Saurabh'."),
  recipientName: z.string().describe("The name of the recipient, e.g., 'Pranjal'."),
  topic: z.string().describe('The topic the recipient is studying.'),
  quizScore: z.number().describe('The recipient\'s quiz score on the topic.'),
  currentMood: z.string().describe('The current mood of the recipient.'),
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

const MotivationOutputSchema = z.object({
  motivation: z.string().describe('A personalized, playful, and flirtatious motivational message.'),
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

export async function getMotivation(input: MotivationInput): Promise<MotivationOutput> {
  return motivationFlow(input);
}

const motivationPrompt = ai.definePrompt({
  name: 'motivationPrompt',
  input: {schema: MotivationInputSchema},
  output: {schema: MotivationOutputSchema},
  prompt: `You are Saurabh, and you are providing playful and flirtatious motivation to Pranjal.

  Pranjal is currently studying {{topic}} and got a quiz score of {{quizScore}}. Pranjal is feeling {{currentMood}}.

  Craft a short, playful, and flirtatious motivational message to encourage Pranjal to keep studying, despite their current mood. Keep it light and fun.
  `,
});

const motivationFlow = ai.defineFlow(
  {
    name: 'motivationFlow',
    inputSchema: MotivationInputSchema,
    outputSchema: MotivationOutputSchema,
  },
  async input => {
    const {output} = await motivationPrompt(input);
    return output!;
  }
);
