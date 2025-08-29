
import { db } from './firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import type { BrainstormingTopic, BrainstormingSubmission } from './types';

/**
 * Fetches all brainstorming topics from Firestore, ordered by subject.
 * @returns {Promise<BrainstormingTopic[]>} An array of brainstorming topic objects.
 */
export const getBrainstormingTopics = async (): Promise<BrainstormingTopic[]> => {
  try {
    const brainstormingRef = collection(db, 'brainstorming');
    const q = query(brainstormingRef, orderBy('subject'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as BrainstormingTopic)
    );
  } catch (error) {
    console.error('Error fetching brainstorming topics:', error);
    return [];
  }
};


/**
 * Adds a new brainstorming submission to Firestore.
 * @param submissionData - The data for the new submission.
 * @returns The ID of the newly created document.
 */
export const addBrainstormingSubmission = async (submissionData: Omit<BrainstormingSubmission, 'id' | 'submittedAt'>): Promise<string> => {
    try {
        const submissionsRef = collection(db, 'brainstorming-submissions');
        const newDocRef = await addDoc(submissionsRef, {
            ...submissionData,
            submittedAt: serverTimestamp(),
        });
        return newDocRef.id;
    } catch (error) {
        console.error('Error adding brainstorming submission:', error);
        throw error;
    }
}
