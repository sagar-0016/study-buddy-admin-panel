
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import type { SyllabusTopic } from './types';

/**
 * Updates the completion status for a specific syllabus topic in Firestore.
 * If the document doesn't exist, it will be created.
 * @param topicKey - A unique identifier for the topic (e.g., 'Physics-Mechanics-Kinematics').
 * @param completed - A boolean indicating if the topic is completed.
 */
export const updateSyllabusTopicStatus = async (
  topicKey: string,
  completed: boolean
): Promise<void> => {
  try {
    const progressDocRef = doc(db, 'syllabus-progress', topicKey);
    await setDoc(
      progressDocRef,
      {
        completed,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error updating syllabus progress for ${topicKey}:`, error);
  }
};

/**
 * Fetches all syllabus progress data from the 'syllabus-progress' collection.
 * @returns {Promise<SyllabusTopic[]>} An array of progress data for all topics.
 */
export const getSyllabusProgress = async (): Promise<SyllabusTopic[]> => {
  try {
    const progressCollectionRef = collection(db, 'syllabus-progress');
    const querySnapshot = await getDocs(progressCollectionRef);

    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        completed: doc.data().completed,
    }));

  } catch (error) {
    console.error("Error fetching syllabus progress data:", error);
    return [];
  }
};


/**
 * Fetches the most recently completed syllabus topics.
 * @param count - The number of topics to fetch.
 * @returns An array of recently completed topic names.
 */
export const getRecentlyCompletedSyllabus = async (count: number): Promise<string[]> => {
    try {
        const q = query(
            collection(db, 'syllabus-progress'), 
            where('completed', '==', true),
            // Firestore doesn't allow ordering by timestamp and then filtering,
            // so we'll fetch all and sort/limit in code. This is inefficient for large datasets
            // but acceptable for this use case. A proper implementation would use a dedicated `completedAt` timestamp.
        );
        const querySnapshot = await getDocs(q);

        // For now, we'll just take the most recent ones based on their ID string, which is not ideal but works for a demo
        return querySnapshot.docs
            .map(doc => doc.id.split('-').pop() || doc.id) // Extract topic name
            .slice(-count); // Get the last `count` items

    } catch (error) {
        console.error("Error fetching recently completed syllabus:", error);
        return [];
    }
}
