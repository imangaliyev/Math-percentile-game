import React, { useState, useCallback } from 'react';
import { GameState, Question } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { generateMathQuestions } from './services/geminiService';
import { saveScore } from './services/scoreService';

const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-lg text-gray-300">Generating your personalized quiz...</p>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [userName, setUserName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (name: string) => {
    setUserName(name);
    setGameState(GameState.Loading);
    setError(null);
    try {
      const newQuestions = await generateMathQuestions();
      setQuestions(newQuestions);
      setGameState(GameState.Quiz);
    } catch (err) {
      const error = err as Error;
      console.error("Failed to generate questions:", error.message, error.stack);
      setError("Sorry, we couldn't generate the quiz. Please try again later.");
      setGameState(GameState.Welcome);
    }
  }, []);

  const handleQuizComplete = useCallback((score: number) => {
    setFinalScore(score);
    saveScore(score, userName);
    // Add the new score to our local state to ensure the results screen is up-to-date
    setAllScores(prevScores => [...prevScores, score]);
    setGameState(GameState.Results);
  }, [userName]);

  const handlePlayAgain = useCallback(() => {
    setUserName('');
    setQuestions([]);
    setFinalScore(0);
    setError(null);
    // We keep `allScores` so the next player sees the updated histogram
    setGameState(GameState.Welcome);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Welcome:
        return <WelcomeScreen onStart={handleStartQuiz} error={error} allScores={allScores} />;
      case GameState.Loading:
        return <Spinner />;
      case GameState.Quiz:
        return <QuizScreen questions={questions} userName={userName} onQuizComplete={handleQuizComplete} allScores={allScores} />;
      case GameState.Results:
        return <ResultsScreen score={finalScore} userName={userName} onPlayAgain={handlePlayAgain} allScores={allScores} />;
      default:
        return <WelcomeScreen onStart={handleStartQuiz} error={error} allScores={allScores} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl text-center">
        {renderContent()}
      </div>
    </div>
  );
}