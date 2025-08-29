
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
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { TechnicalHelp } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Firebase Storage for a help request.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
const uploadHelpImage = async (file: File): Promise<string> => {
    const fileId = uuidv4();
    const storageRef = ref(storage, `technical-help/${fileId}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

/**
 * Adds a new technical help request to Firestore. Handles optional image upload.
 * @param data - The data for the new help request.
 * @returns The ID of the newly created document.
 */
export const addTechnicalHelp = async (data: {
  text: string;
  category: string;
  imageFile?: File;
}): Promise<string> => {
  try {
    let imageUrl: string | undefined = undefined;
    if (data.imageFile) {
        imageUrl = await uploadHelpImage(data.imageFile);
    }

    const helpRef = collection(db, 'technical-help');
    const newDocRef = await addDoc(helpRef, {
      text: data.text,
      category: data.category,
      imageUrl,
      isAddressed: false,
      isCleared: false,
      createdAt: serverTimestamp(),
    });
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding technical help request:', error);
    throw error;
  }
};

/**
 * Fetches all technical help requests from Firestore, ordered by creation date.
 * @returns {Promise<TechnicalHelp[]>} An array of help request objects.
 */
export const getTechnicalHelp = async (): Promise<TechnicalHelp[]> => {
  try {
    const helpRef = collection(db, 'technical-help');
    const q = query(helpRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as TechnicalHelp)
    );
  } catch (error) {
    console.error('Error fetching technical help requests:', error);
    return [];
  }
};

/**
 * Marks a technical help request as cleared by the user.
 * @param {string} helpId - The ID of the help document to update.
 */
export const markTechnicalHelpAsCleared = async (helpId: string): Promise<void> => {
    try {
        const helpRef = doc(db, 'technical-help', helpId);
        await updateDoc(helpRef, {
            isCleared: true,
        });
    } catch (error) {
        console.error(`Error marking help request ${helpId} as cleared:`, error);
        throw error;
    }
}
