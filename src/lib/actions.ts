
"use server";

import { personalizedFeedback, PersonalizedFeedbackInput } from "@/ai/flows/personalized-feedback";
import { getMotivation, MotivationInput } from "@/ai/flows/motivation-corner";

export async function getPersonalizedFeedbackAction() {
    return await personalizedFeedback({});
}

export async function getMotivationAction(input: MotivationInput) {
    return await getMotivation(input);
}
