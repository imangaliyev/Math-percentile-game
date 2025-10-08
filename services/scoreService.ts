// In-memory store for scores, simulating a database for the session.
let scores: number[] = [];

/**
 * Retrieves all scores from the in-memory store.
 * @returns A copy of all scores recorded during the session.
 */
export const getAllScores = (): number[] => {
  // Return a copy to prevent direct mutation of the internal array from outside.
  return [...scores];
};

/**
 * Saves a new score to the in-memory store.
 * @param score The score to save.
 * @param userName The name of the user (kept for interface consistency, but unused).
 */
export const saveScore = (score: number, userName: string): void => {
  scores.push(score);
};
