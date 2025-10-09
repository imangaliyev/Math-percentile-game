import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const SCORES_COLLECTION = 'scores';

/**
 * Retrieves all scores from the Firestore database.
 * @returns A promise that resolves to an array of all scores.
 */
export const getAllScores = async (): Promise<number[]> => {
  try {
    const scoresCollection = collection(db, SCORES_COLLECTION);
    const q = query(scoresCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const scores = querySnapshot.docs.map(doc => doc.data().score as number);
    return scores;
  } catch (err) {
    const error = err as Error;
    console.error("Error fetching scores from Firestore:", error.message, error.stack);
    throw new Error("Failed to fetch scores from the database.");
  }
};

/**
 * Saves a new score to the Firestore database.
 * @param score The score to save.
 * @param userName The name of the user who achieved the score.
 */
export const saveScore = async (score: number, userName: string): Promise<void> => {
  try {
    const scoresCollection = collection(db, SCORES_COLLECTION);
    await addDoc(scoresCollection, {
      userName,
      score,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    const error = err as Error;
    console.error("Error saving score to Firestore:", error.message, error.stack);
    throw new Error("Failed to save the score to the database.");
  }
};
