
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMathQuestions = async (): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
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

    return questions;
  } catch (error) {
    console.error("Error generating math questions:", error);
    throw new Error("Failed to communicate with the AI model to generate questions.");
  }
};
