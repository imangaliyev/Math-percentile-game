import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from './firebase';

const SCORES_COLLECTION = 'scores';

/**
 * Retrieves all scores from Firestore.
 * @returns A Promise that resolves to an array of numbers.
 */
export const getAllScores = async (): Promise<number[]> => {
  try {
    const scoresCollection = collection(db, SCORES_COLLECTION);
    const querySnapshot = await getDocs(scoresCollection);
    const scores: number[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure we only push numbers to the array
      if (typeof data.score === 'number') {
        scores.push(data.score);
      }
    });
    return scores;
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error retrieving scores from Firestore:", error.message);
    } else {
        console.error("An unknown error occurred while retrieving scores:", error);
    }
    // Return an empty array on error to prevent the app from crashing.
    return [];
  }
};

/**
 * Saves a new score to Firestore.
 * @param score The score to save.
 * @param userName The name of the user.
 * @returns A Promise that resolves when the save is complete.
 */
export const saveScore = async (score: number, userName: string): Promise<void> => {
  try {
    const scoresCollection = collection(db, SCORES_COLLECTION);
    await addDoc(scoresCollection, {
      score,
      userName,
      createdAt: serverTimestamp(), // Add a server-side timestamp
    });
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error saving score to Firestore:", error.message);
    } else {
        console.error("An unknown error occurred while saving score:", error);
    }
    // We can re-throw or handle it silently. For now, log and continue.
  }
};