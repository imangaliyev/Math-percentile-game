
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  error: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, error }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in">
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
    </div>
  );
};

export default WelcomeScreen;
