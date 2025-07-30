import React from 'react';
import { Play, Trophy } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-gray-700/50">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Sky Runner
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Dodge obstacles, collect coins, and reach the top of the leaderboard!
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={onStartGame}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-xl shadow-lg"
        >
          <Play size={24} />
          Start Game
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="text-yellow-500" size={24} />
          <h3 className="text-xl font-semibold text-white">How to Play</h3>
        </div>
        <div className="text-gray-400 space-y-2 text-left">
          <p>• Use LEFT and RIGHT arrow keys to move</p>
          <p>• Avoid red obstacles to stay alive</p>
          <p>• Collect golden coins for bonus points</p>
          <p>• Survive as long as possible for high score</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;