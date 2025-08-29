
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
  limit,
  writeBatch,
  Timestamp,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import type { Doubt, TechnicalHelp, Lecture, Activity, MoodEntry, FlashcardDeck, Flashcard } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";


// --- Doubts ---

export const getDoubts = async (status: 'pending' | 'addressed' = 'pending'): Promise<Doubt[]> => {
  try {
    const doubtsRef = collection(db, 'doubts');
    
    const q = query(
        doubtsRef, 
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const allDoubts = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Doubt)
    );

    return allDoubts.filter(doubt => doubt.isAddressed === (status === 'addressed'));

  } catch (error) {
    console.error('Error fetching doubts:', error);
    return [];
  }
};

export const markDoubtAsAddressed = async (doubtId: string, addressedText: string): Promise<void> => {
    try {
        const doubtRef = doc(db, 'doubts', doubtId);
        await updateDoc(doubtRef, {
            isAddressed: true,
            addressedText: addressedText,
        });
    } catch (error) {
        console.error(`Error marking doubt ${doubtId} as addressed:`, error);
        throw error;
    }
}

export const updateDoubtResponse = async (doubtId: string, addressedText: string): Promise<void> => {
     try {
        const doubtRef = doc(db, 'doubts', doubtId);
        await updateDoc(doubtRef, {
            addressedText: addressedText,
        });
    } catch (error) {
        console.error(`Error updating response for doubt ${doubtId}:`, error);
        throw error;
    }
}


// --- Technical Help ---

export const getHelpRequests = async (status: 'pending' | 'addressed' = 'pending'): Promise<TechnicalHelp[]> => {
  try {
    const helpRef = collection(db, 'technical-help');
     const q = query(
        helpRef, 
        where('isAddressed', '==', status === 'addressed'), 
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as TechnicalHelp)
    );
  } catch (error) {
    console.error('Error fetching help requests:', error);
    return [];
  }
};

export const markHelpAsAddressed = async (helpId: string): Promise<void> => {
    try {
        const helpRef = doc(db, 'technical-help', helpId);
        await updateDoc(helpRef, {
            isAddressed: true,
        });
    } catch (error) {
        console.error(`Error marking help request ${helpId} as addressed:`, error);
        throw error;
    }
}

// --- Lectures ---

/**
 * Uploads a video to Firebase Storage and returns the download URL.
 * @param {File} file - The video file to upload.
 * @returns {Promise<string>} The public URL of the uploaded video.
 */
const uploadVideo = async (file: File): Promise<string> => {
    const fileId = uuidv4();
    const filePath = `lectures/${fileId}-${file.name}`;
    const storageRef = ref(storage, filePath);
    
    const metadata = {
        contentType: file.type,
        cacheControl: 'public,max-age=31536000',
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    const bucket = snapshot.ref.bucket;
    const fullPath = snapshot.ref.fullPath;
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fullPath)}?alt=media`;
    
    return publicUrl;
}


/**
 * Adds a new lecture to Firestore after uploading its video.
 * @param lectureData - The metadata and video file for the new lecture.
 */
export const addLecture = async (lectureData: {
  title: string;
  description: string;
  subject: string;
  channel: string;
  duration: string;
  videoFile: File;
}): Promise<string | null> => {
  try {
    const videoUrl = await uploadVideo(lectureData.videoFile);

    const lecturesRef = collection(db, 'lectures');
    const newDocRef = await addDoc(lecturesRef, {
      title: lectureData.title,
      description: lectureData.description,
      subject: lectureData.subject,
      channel: lectureData.channel,
      duration: lectureData.duration,
      videoUrl: videoUrl,
      thumbnailUrl: `https://placehold.co/1280x720.png`,
      createdAt: serverTimestamp(),
    });
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding lecture:', error);
    throw error;
  }
};


/**
 * Fetches all lectures from the 'lectures' collection in Firestore.
 * @returns {Promise<Lecture[]>} An array of lecture objects.
 */
export const getLectures = async (): Promise<Lecture[]> => {
  try {
    const lecturesRef = collection(db, 'lectures');
    const q = query(lecturesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Lecture));

  } catch (error) {
    console.error("Error fetching lectures:", error);
    return [];
  }
};


// --- Dashboard ---

/**
 * Fetches the most recent activities (doubts, help requests) from Firestore.
 * @param {number} count - The number of recent activities to fetch.
 * @returns {Promise<Activity[]>} A combined and sorted list of recent activities.
 */
export const getRecentActivity = async (count: number): Promise<Activity[]> => {
  try {
    const doubtsRef = collection(db, 'doubts');
    const helpRef = collection(db, 'technical-help');

    const doubtsQuery = query(doubtsRef, orderBy('createdAt', 'desc'), limit(count));
    const helpQuery = query(helpRef, orderBy('createdAt', 'desc'), limit(count));

    const [doubtsSnapshot, helpSnapshot] = await Promise.all([
      getDocs(doubtsQuery),
      getDocs(helpQuery),
    ]);

    const activities: Activity[] = [];

    doubtsSnapshot.docs.forEach(doc => {
      const data = doc.data() as Doubt;
      activities.push({
        id: doc.id,
        user: 'Sagar', // Placeholder user
        type: 'Doubt',
        status: data.isAddressed ? 'Addressed' : 'Pending',
        date: data.createdAt,
      });
    });

    helpSnapshot.docs.forEach(doc => {
      const data = doc.data() as TechnicalHelp;
      activities.push({
        id: doc.id,
        user: 'Sagar', // Placeholder user
        type: 'Help Request',
        status: data.isAddressed ? 'Addressed' : 'Pending',
        date: data.createdAt,
      });
    });

    // Sort all activities by date and take the most recent `count`
    return activities.sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(0, count);

  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};


/**
 * Fetches the most recent mood entries.
 * @param count The number of entries to fetch.
 */
export const getRecentMoodEntries = async (count: number): Promise<MoodEntry[]> => {
    try {
        const moodRef = collection(db, 'mood-tracker');
        const q = query(moodRef, orderBy('createdAt', 'desc'), limit(count));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodEntry));
    } catch (error) {
        console.error('Error fetching recent mood entries:', error);
        return [];
    }
};


// --- Mood Helper ---

/**
 * Adds an array of messages to a specified Firestore collection.
 * Each message becomes a new document with a 'message' field.
 * @param collectionName The name of the collection to add messages to.
 * @param messages The array of messages (can be strings, objects, etc.).
 */
export const addMessagesToCollection = async (collectionName: string, messages: any[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        const collectionRef = collection(db, collectionName);

        messages.forEach(message => {
            const docRef = doc(collectionRef); // Create a new doc with auto-ID
            batch.set(docRef, { message });
        });

        await batch.commit();
    } catch (error) {
        console.error(`Error adding messages to collection ${collectionName}:`, error);
        throw error;
    }
};


// --- Flashcards ---

/**
 * Fetches all flashcard decks from the 'flashcardDecks' collection.
 */
export const getFlashcardDecks = async (): Promise<FlashcardDeck[]> => {
    try {
        const decksRef = collection(db, 'flashcardDecks');
        const q = query(decksRef, orderBy('title'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlashcardDeck));
    } catch (error) {
        console.error('Error fetching flashcard decks:', error);
        return [];
    }
}

type AddDeckData = Omit<FlashcardDeck, 'id' | 'cardCount' | 'createdAt'>;

/**
 * Adds a new flashcard deck to the 'flashcardDecks' collection.
 */
export const addFlashcardDeck = async (data: AddDeckData): Promise<void> => {
    try {
        if (!data.title || !data.description || !data.category || !data.status || !data.icon || !data.href || !data.difficulty) {
            throw new Error("Missing required fields for creating a flashcard deck.");
        }
        const decksRef = collection(db, 'flashcardDecks');
        const payload: any = {
            ...data,
            cardCount: 0,
            createdAt: serverTimestamp()
        };
        if (data.category) {
            payload.category = data.category.toLowerCase();
        }
        if (data.status) {
            payload.status = data.status.toLowerCase();
        }
        await addDoc(decksRef, payload);
    } catch (error) {
        console.error('Error adding flashcard deck:', error);
        throw error;
    }
}

/**
 * Updates an existing flashcard deck document.
 * @param deckId The ID of the deck to update.
 * @param data The data to update.
 */
export const updateFlashcardDeck = async (deckId: string, data: Partial<AddDeckData>): Promise<void> => {
    try {
        const deckRef = doc(db, 'flashcardDecks', deckId);
        const updateData: any = { ...data };
        if (data.category) {
            updateData.category = data.category.toLowerCase();
        }
        if (data.status) {
            updateData.status = data.status.toLowerCase();
        }
        await updateDoc(deckRef, updateData);
    } catch (error) {
        console.error(`Error updating deck ${deckId}:`, error);
        throw error;
    }
}

/**
 * Adds an array of card objects to the nested 'cards' sub-collection of a specific deck.
 * @param deckId The ID of the parent deck document.
 * @param cards The array of card objects to add (e.g., [{ question: 'Q1', answer: 'A1' }]).
 */
export const addCardsToDeck = async (deckId: string, cards: { question: string, answer: string }[]): Promise<void> => {
    try {
        const deckRef = doc(db, 'flashcardDecks', deckId);
        const cardsRef = collection(deckRef, 'cards');
        const batch = writeBatch(db);

        cards.forEach(card => {
            if (card.question && card.answer) {
                const cardDocRef = doc(cardsRef); // Create a new doc with auto-ID in the sub-collection
                batch.set(cardDocRef, {
                    question: card.question,
                    answer: card.answer,
                });
            }
        });

        // Update the cardCount on the parent deck document
        batch.update(deckRef, { cardCount: increment(cards.length) });

        await batch.commit();

    } catch (error) {
        console.error(`Error adding cards to deck ${deckId}:`, error);
        throw error;
    }
}

/**
 * Fetches all cards for a specific deck from its nested 'cards' sub-collection.
 * @param deckId The ID of the parent deck document.
 * @returns An array of flashcard objects.
 */
export const getCardsForDeck = async (deckId: string): Promise<Flashcard[]> => {
    try {
        const cardsRef = collection(db, 'flashcardDecks', deckId, 'cards');
        const querySnapshot = await getDocs(cardsRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flashcard));
    } catch (error) {
        console.error(`Error fetching cards for deck ${deckId}:`, error);
        return [];
    }
}

/**
 * Updates a specific flashcard within a deck's 'cards' sub-collection.
 * @param deckId The ID of the parent deck document.
 * @param cardId The ID of the card document to update.
 * @param data The data to update (e.g., { question, answer }).
 */
export const updateCardInDeck = async (deckId: string, cardId: string, data: Partial<Pick<Flashcard, 'question' | 'answer'>>): Promise<void> => {
    try {
        const cardRef = doc(db, 'flashcardDecks', deckId, 'cards', cardId);
        await updateDoc(cardRef, data);
    } catch (error) {
        console.error(`Error updating card ${cardId} in deck ${deckId}:`, error);
        throw error;
    }
}

/**
 * Deletes a specific flashcard from a deck and decrements the deck's card count.
 * @param deckId The ID of the parent deck document.
 * @param cardId The ID of the card document to delete.
 */
export const deleteCardFromDeck = async (deckId: string, cardId: string): Promise<void> => {
    try {
        const deckRef = doc(db, 'flashcardDecks', deckId);
        const cardRef = doc(db, 'flashcardDecks', deckId, 'cards', cardId);

        const batch = writeBatch(db);

        // Delete the card document
        batch.delete(cardRef);

        // Decrement the card count on the parent deck
        batch.update(deckRef, { cardCount: increment(-1) });

        await batch.commit();
    } catch (error) {
        console.error(`Error deleting card ${cardId} from deck ${deckId}:`, error);
        throw error;
    }
}
