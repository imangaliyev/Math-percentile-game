import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { TOTAL_QUESTIONS, TIME_LIMIT_SECONDS, POINTS_PER_CORRECT_ANSWER, MAX_TIME_BONUS } from '../constants';
import ScoreHistogram from './ScoreHistogram';

interface QuizScreenProps {
  questions: Question[];
  userName: string;
  onQuizComplete: (finalScore: number) => void;
  allScores: number[];
}

const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const percentage = (timeLeft / TIME_LIMIT_SECONDS) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-green-400';
  if (percentage < 50) colorClass = 'text-yellow-400';
  if (percentage < 25) colorClass = 'text-red-500';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-linear`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${colorClass}`}>
        {timeLeft}
      </span>
    </div>
  );
};


const QuizScreen: React.FC<QuizScreenProps> = ({ questions, userName, onQuizComplete, allScores }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [userAnswer, setUserAnswer] = useState('');
  const [scores, setScores] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNextQuestion = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const answerNumber = parseFloat(userAnswer);
    const isCorrect = !isNaN(answerNumber) && answerNumber === questions[currentQuestionIndex].answer;
    
    let questionScore = 0;
    if (isCorrect) {
      const timeBonus = Math.round(MAX_TIME_BONUS * (timeLeft / TIME_LIMIT_SECONDS));
      questionScore = POINTS_PER_CORRECT_ANSWER + timeBonus;
    }
    
    const updatedScores = [...scores, questionScore];
    setScores(updatedScores);
    
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setTimeLeft(TIME_LIMIT_SECONDS);
    } else {
      const finalScore = updatedScores.reduce((acc, score) => acc + score, 0);
      onQuizComplete(finalScore);
    }
  };
  
  useEffect(() => {
    inputRef.current?.focus();

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Programmatically submit the form to ensure the latest answer is used.
          formRef.current?.requestSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = timerId as unknown as number;

    return () => {
      clearInterval(timerId);
    };
  }, [currentQuestionIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNextQuestion();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentScore = scores.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xl text-gray-400">Question {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}</p>
          <p className="text-2xl font-semibold text-cyan-400">Score: {currentScore}</p>
        </div>
        <Timer timeLeft={timeLeft} />
      </div>

      <div className="my-8">
        <p className="text-3xl font-medium text-white text-center min-h-[80px]">{currentQuestion.question}</p>
      </div>
      
      <form onSubmit={handleSubmit} ref={formRef}>
        <input
          ref={inputRef}
          type="number"
          step="any"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className="w-full px-4 py-3 text-2xl text-center bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
        />
        <button
          type="submit"
          className="w-full mt-6 px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 duration-300"
        >
          Submit Answer
        </button>
      </form>

      <div className="mt-8 bg-gray-900/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">Live Score Distribution</h3>
        <ScoreHistogram allScores={allScores} userScore={currentScore} />
      </div>
    </div>
  );
};

export default QuizScreen;