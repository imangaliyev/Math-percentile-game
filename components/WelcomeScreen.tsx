import React, { useState } from 'react';
import ScoreHistogram from './ScoreHistogram';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  error: string | null;
  allScores: number[];
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, error, allScores }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in w-full">
      <h1 className="text-5xl font-bold text-cyan-400 mb-2">Math Whiz AI</h1>
      <p className="text-lg text-gray-300 mb-8">Test your skills against AI-generated challenges!</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
          aria-label="Your name"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full mt-4 px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300"
        >
          Start Quiz
        </button>
      </form>
       {error && <p className="mt-4 text-red-400">{error}</p>}

       {allScores.length > 0 && (
        <div className="mt-12 w-full bg-gray-900/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">Overall Score Distribution</h3>
          <ScoreHistogram allScores={allScores} userScore={null} />
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;