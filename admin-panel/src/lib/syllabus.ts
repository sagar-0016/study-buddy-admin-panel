
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import type { SyllabusTopic } from './types';
import { syllabusData } from './data';

/**
 * Updates the completion status for a specific syllabus topic in Firestore.
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
