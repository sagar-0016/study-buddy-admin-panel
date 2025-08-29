
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import type { ProgressData } from './types';

/**
 * Updates the progress for a specific flashcard deck in Firestore.
 * If the document doesn't exist, it will be created.
 * @param deckId - A unique identifier for the deck (e.g., 'kinematics').
 * @param completed - The number of cards completed.
 * @param total - The total number of cards in the deck.
 * @param subject - The subject of the deck (e.g., 'Physics').
 */
export const updateDeckProgress = async (
  deckId: string,
  completed: number,
  total: number,
  subject: string
): Promise<void> => {
  try {
    const progressDocRef = doc(db, 'progress-dashboard', deckId);
    await setDoc(
      progressDocRef,
      {
        completed,
        total,
        subject,
        lastUpdated: serverTimestamp(),
      },
      { merge: true } // Use merge to avoid overwriting other fields if they exist
    );
  } catch (error) {
    console.error(`Error updating progress for deck ${deckId}:`, error);
  }
};


/**
 * Fetches all progress data from the 'progress-dashboard' collection.
 * @returns {Promise<ProgressData[]>} An array of progress data for all decks.
 */
export const getProgressData = async (): Promise<ProgressData[]> => {
  try {
    const progressCollectionRef = collection(db, 'progress-dashboard');
    const querySnapshot = await getDocs(progressCollectionRef);

    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        completed: doc.data().completed,
        total: doc.data().total,
        subject: doc.data().subject,
    }));

  } catch (error) {
    console.error("Error fetching progress data:", error);
    return [];
  }
};
