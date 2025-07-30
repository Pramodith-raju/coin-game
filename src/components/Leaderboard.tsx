import React, { useState, useEffect } from 'react';
import { Trophy, Play, Home, Medal } from 'lucide-react';
import { Score } from '../App';

interface LeaderboardProps {
  currentScore: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  currentScore,
  onPlayAgain,
  onBackToMenu
}) => {
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState<Score[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedScores = localStorage.getItem('skyRunnerScores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const submitScore = () => {
    if (!playerName.trim()) return;

    const newScore: Score = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: currentScore,
      date: new Date().toLocaleDateString()
    };

    const updatedScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10

    setScores(updatedScores);
    localStorage.setItem('skyRunnerScores', JSON.stringify(updatedScores));
    setSubmitted(true);
  };

  const topThreeScores = scores.slice(0, 3);
  const isNewRecord = scores.length === 0 || currentScore > scores[0]?.score;
  const isTopThree = topThreeScores.some(score => score.score < currentScore) || topThreeScores.length < 3;

  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          {isNewRecord ? '🎉 New Record!' : isTopThree ? '🏆 Top 3!' : 'Game Over'}
        </h2>
        <div className="text-6xl font-bold text-yellow-500 mb-2">
          {currentScore.toLocaleString()}
        </div>
        <p className="text-xl text-gray-300">Your Score</p>
      </div>

      {!submitted ? (
        <div className="mb-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Enter Your Name for Leaderboard
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && submitScore()}
              />
              <button
                onClick={submitScore}
                disabled={!playerName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-gray-900/50 rounded-2xl p-6 mb-8 border border-gray-700/30">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Trophy className="text-yellow-500" size={28} />
          <h3 className="text-2xl font-bold text-white">Top 3 Scores</h3>
        </div>

        {topThreeScores.length > 0 ? (
          <div className="space-y-4">
            {topThreeScores.map((score, index) => (
              <div
                key={score.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-400/20 to-gray-600/20 border border-gray-500/40'
                    : 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/40'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50">
                  {index === 0 ? (
                    <Trophy className="text-yellow-500" size={24} />
                  ) : index === 1 ? (
                    <Medal className="text-gray-400" size={24} />
                  ) : (
                    <Medal className="text-orange-500" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">
                    {score.playerName}
                  </div>
                  <div className="text-gray-400 text-sm">{score.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-xl">
                    {score.score.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">points</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No scores yet. Be the first to make it to the leaderboard!</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-lg"
        >
          <Play size={20} />
          Play Again
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg border border-gray-600/50"
        >
          <Home size={20} />
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;