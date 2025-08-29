
import { db, storage } from './firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  increment,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { RevisionTopic } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
const uploadImageHint = async (file: File): Promise<string> => {
    const fileId = uuidv4();
    const storageRef = ref(storage, `revision-hints/${fileId}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}


/**
 * Fetches all revision topics from Firestore.
 * @returns {Promise<RevisionTopic[]>} An array of revision topics.
 */
export const getRevisionTopics = async (): Promise<RevisionTopic[]> => {
  try {
    const revisionsRef = collection(db, 'revisions');
    const querySnapshot = await getDocs(revisionsRef);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as RevisionTopic)
    );
  } catch (error) {
    console.error('Error fetching revision topics:', error);
    return [];
  }
};

/**
 * Fetches revision topics where the user has made mistakes.
 * @returns {Promise<RevisionTopic[]>} An array of revision topics with high fail counts.
 */
export const getRevisionMistakes = async (): Promise<RevisionTopic[]> => {
    try {
        const revisionsRef = collection(db, 'revisions');
        // Fetch topics where fails are greater than successes, and there's at least one fail.
        // Firestore doesn't support this query directly, so we filter in code.
        const querySnapshot = await getDocs(revisionsRef);
        const allTopics = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RevisionTopic));
        
        return allTopics
            .filter(topic => topic.recallFails > topic.recallSuccess && topic.recallFails > 0)
            .sort((a, b) => b.recallFails - a.recallFails);

    } catch (error) {
        console.error('Error fetching revision mistakes:', error);
        return [];
    }
}


/**
 * Adds a new revision topic to Firestore.
 * @param {Omit<RevisionTopic, 'id' | 'lastReviewed' | 'recallSuccess' | 'recallFails'>} topicData - The data for the new topic.
 * @returns {Promise<string | null>} The ID of the newly created document, or null on failure.
 */
export const addRevisionTopic = async (topicData: {
  subject: string;
  chapterName: string;
  topicName: string;
  hints: string;
  imageFile?: File;
}): Promise<string | null> => {
  try {
    let hintsImageURL: string | undefined = undefined;
    if (topicData.imageFile) {
        hintsImageURL = await uploadImageHint(topicData.imageFile);
    }

    const revisionsRef = collection(db, 'revisions');
    const newDocRef = await addDoc(revisionsRef, {
      subject: topicData.subject,
      chapterName: topicData.chapterName,
      topicName: topicData.topicName,
      hints: topicData.hints,
      hintsImageURL,
      recallSuccess: 0,
      recallFails: 0,
      lastReviewed: serverTimestamp(),
    });
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding revision topic:', error);
    return null;
  }
};

/**
 * Updates an existing revision topic in Firestore.
 * @param topicId - The ID of the topic to update.
 * @param data - The data to update.
 */
export const updateRevisionTopic = async (topicId: string, data: Partial<Pick<RevisionTopic, 'subject' | 'chapterName' | 'topicName' | 'hints'>> & { imageFile?: File }): Promise<void> => {
    try {
        const topicRef = doc(db, 'revisions', topicId);
        
        const updateData: any = { ...data };

        if (data.imageFile) {
            updateData.hintsImageURL = await uploadImageHint(data.imageFile);
        }
        delete updateData.imageFile; // Don't try to save the file object to Firestore

        updateData.lastReviewed = serverTimestamp();
        
        await updateDoc(topicRef, updateData);
    } catch (error) {
        console.error(`Error updating topic ${topicId}:`, error);
        throw error;
    }
}


/**
 * Updates the recall stats for a specific revision topic.
 * @param {string} topicId - The ID of the topic document to update.
 * @param {'success' | 'fail'} result - The outcome of the recall attempt.
 */
export const updateRecallStats = async (
  topicId: string,
  result: 'success' | 'fail'
): Promise<void> => {
    try {
        const topicRef = doc(db, 'revisions', topicId);
        const updateData = {
            lastReviewed: serverTimestamp(),
            ...(result === 'success' ? { recallSuccess: increment(1) } : { recallFails: increment(1) })
        };
        await updateDoc(topicRef, updateData);
    } catch(error) {
        console.error(`Error updating stats for topic ${topicId}:`, error);
        throw error;
    }
};

// --- Recall Session Logic ---

const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Gets a curated list of topics for a recall session based on performance.
 * @param {number} sessionSize - The desired number of topics for the session.
 * @returns {Promise<RevisionTopic[]>} A curated and randomized array of topics.
 */
export const getRecallSessionTopics = async (sessionSize: number): Promise<RevisionTopic[]> => {
    const allTopics = await getRevisionTopics();
    
    if (allTopics.length <= sessionSize) {
        return shuffleArray(allTopics);
    }

    const mastered: RevisionTopic[] = [];
    const needsPractice: RevisionTopic[] = [];
    const reviewing: RevisionTopic[] = [];

    allTopics.forEach(topic => {
        const totalAttempts = topic.recallSuccess + topic.recallFails;
        const successRate = totalAttempts > 0 ? topic.recallSuccess / totalAttempts : 0;
        
        if (topic.recallSuccess > 5 && successRate > 0.7) {
             mastered.push(topic);
        } 
        else if (topic.recallFails > topic.recallSuccess || totalAttempts === 0) {
            needsPractice.push(topic);
        }
        else {
            reviewing.push(topic);
        }
    });

    shuffleArray(mastered);
    shuffleArray(needsPractice);
    shuffleArray(reviewing);

    let sessionTopics: RevisionTopic[] = [];
    const addedIds = new Set<string>();

    const addTopics = (from: RevisionTopic[], count: number) => {
        for(let i=0; i < from.length && sessionTopics.length < count; i++) {
            const topic = from[i];
            if(!addedIds.has(topic.id)) {
                sessionTopics.push(topic);
                addedIds.add(topic.id);
            }
        }
    }

    const targetMastered = Math.ceil(sessionSize * 0.10);
    const targetNeedsPractice = Math.ceil(sessionSize * 0.50);
    const targetReviewing = Math.ceil(sessionSize * 0.40);

    addTopics(needsPractice, targetNeedsPractice);
    addTopics(reviewing, targetNeedsPractice + targetReviewing);
    addTopics(mastered, targetNeedsPractice + targetReviewing + targetMastered);
    
    if (sessionTopics.length < sessionSize) {
        const fillHierarchy = [...needsPractice, ...reviewing, ...mastered];
        for(const topic of fillHierarchy) {
            if (sessionTopics.length >= sessionSize) break;
            if(!addedIds.has(topic.id)) {
                sessionTopics.push(topic);
                addedIds.add(topic.id);
            }
        }
    }

    return shuffleArray(sessionTopics.slice(0, sessionSize));
}

/**
 * Fetches and calculates the number of mastered revision topics.
 * @returns {Promise<{ mastered: number; total: number }>} An object with mastered and total counts.
 */
export const getRevisionProgress = async (): Promise<{ mastered: number, total: number }> => {
    try {
        const allTopics = await getRevisionTopics();
        const total = allTopics.length;
        
        const masteredCount = allTopics.filter(topic => {
            const totalAttempts = topic.recallSuccess + topic.recallFails;
            if (totalAttempts < 7) return false;
            return topic.recallSuccess > 5;
        }).length;

        return { mastered: masteredCount, total };
    } catch (error) {
        console.error("Error fetching revision progress:", error);
        return { mastered: 0, total: 0 };
    }
}
