import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns a singleton instance of the GoogleGenAI client.
 * Throws an error if the API key is not configured in the environment.
 */
const getAiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This specific error message is caught by the App component to display a user-friendly notice.
    throw new Error("API_KEY environment variable is not set. Please configure it in your deployment environment.");
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateMathQuestions = async (): Promise<Question[]> => {
  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${TOTAL_QUESTIONS} math questions. The questions should start very easy, suitable for a 1st grader, and progressively get harder, with the last question being challenging for a high school student. The topics should range from basic arithmetic to simple algebra. Provide the question and the numerical answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: `An array of ${TOTAL_QUESTIONS} math questions.`,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The math problem as a string. For example: 'What is 5 + 7?' or 'Solve for x: 2x + 3 = 11'"
              },
              answer: {
                type: Type.NUMBER,
                description: "The numerical answer to the question."
              }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return a valid array of questions.");
    }
    
    // While the app is now robust to handle a different number of questions,
    // let's add a console warning if the AI didn't provide the exact number requested.
    if (questions.length !== TOTAL_QUESTIONS) {
        console.warn(`AI generated ${questions.length} questions instead of the requested ${TOTAL_QUESTIONS}.`);
    }

    return questions;
  } catch (err) {
    const error = err as Error;
    console.error("Error generating math questions:", error.message, error.stack);

    // If the error is our custom API key error, rethrow it so the UI can be specific.
    if (error.message.includes("API_KEY")) {
        throw error;
    }
    
    throw new Error("Failed to communicate with the AI model to generate questions.");
  }
};