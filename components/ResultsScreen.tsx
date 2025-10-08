import React, { useEffect, useState } from 'react';
import ScoreHistogram from './ScoreHistogram';

interface ResultsScreenProps {
  score: number;
  userName: string;
  onPlayAgain: () => void;
  allScores: number[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, userName, onPlayAgain, allScores }) => {
  const [percentile, setPercentile] = useState<number>(0);

  useEffect(() => {
    // Calculate percentile based on the definitive list of scores from props.
    if (allScores.length > 0) {
      const scoresBelowOrEqual = allScores.filter(s => s <= score).length;
      const calculatedPercentile = (scoresBelowOrEqual / allScores.length) * 100;
      setPercentile(calculatedPercentile);
    } else {
      // This case should ideally not happen if the user's score is always included.
      setPercentile(100);
    }
  }, [score, allScores]);

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full flex flex-col items-center animate-fade-in">
      <h2 className="text-4xl font-bold text-cyan-400 mb-2">Quiz Complete, {userName}!</h2>
      <p className="text-2xl text-gray-300 mb-4">Your final score is:</p>
      <p className="text-7xl font-bold text-white mb-6">{score}</p>

      <div className="w-full bg-gray-900 p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-4 text-center">Score Distribution</h3>
        <p className="text-lg text-center text-gray-300 mb-4">
          You finished in the <span className="font-bold text-white">{percentile.toFixed(1)}th</span> percentile!
        </p>
        <ScoreHistogram allScores={allScores} userScore={score} />
      </div>

      <button
        onClick={onPlayAgain}
        className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 duration-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultsScreen;