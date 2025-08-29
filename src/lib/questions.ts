
import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import type { Question } from './types';

/**
 * Fetches all tricky questions from Firestore that have been attempted but answered incorrectly.
 * @returns {Promise<Question[]>} An array of question objects.
 */
export const getTrickyQuestionMistakes = async (): Promise<Question[]> => {
    try {
        const q = query(
            collection(db, 'tricky-questions'), 
            where('isAttempted', '==', true), 
            where('isCorrect', '==', false)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    } catch (err) {
        console.error('Error fetching tricky question mistakes:', err);
        return [];
    }
}

/**
 * Fetches all regular questions from Firestore that have been attempted but answered incorrectly.
 * @returns {Promise<Question[]>} An array of question objects.
 */
export const getRegularQuestionMistakes = async (): Promise<Question[]> => {
    try {
        const q = query(
            collection(db, 'questions'), 
            where('isAttempted', '==', true), 
            where('isCorrect', '==', false)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    } catch (err) {
        console.error('Error fetching regular question mistakes:', err);
        return [];
    }
}
