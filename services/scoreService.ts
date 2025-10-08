import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from './firebase';

const SCORES_COLLECTION = 'scores';

/**
 * Retrieves all scores from Firestore.
 * @returns A Promise that resolves to an array of numbers.
 */
export const getAllScores = async (): Promise<number[]> => {
  try {
    const db = getDb();
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
    console.error("Error retrieving scores from Firestore:", error);
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
    const db = getDb();
    const scoresCollection = collection(db, SCORES_COLLECTION);
    await addDoc(scoresCollection, {
      score,
      userName,
      createdAt: serverTimestamp(), // Add a server-side timestamp
    });
  } catch (error) {
    console.error("Error saving score to Firestore:", error);
    // We can re-throw or handle it silently. For now, log and continue.
  }
};
