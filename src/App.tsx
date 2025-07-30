import React, { useState } from 'react';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import MainMenu from './components/MainMenu';

export type GameState = 'menu' | 'playing' | 'gameOver';

export interface Score {
  id: string;
  playerName: string;
  score: number;
  date: string;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {gameState === 'menu' && (
          <MainMenu onStartGame={() => setGameState('playing')} />
        )}
        
        {gameState === 'playing' && (
          <Game
            onGameOver={(score) => {
              setCurrentScore(score);
              setGameState('gameOver');
            }}
          />
        )}
        
        {gameState === 'gameOver' && (
          <Leaderboard
            currentScore={currentScore}
            onPlayAgain={() => setGameState('playing')}
            onBackToMenu={() => setGameState('menu')}
          />
        )}
      </div>
    </div>
  );
}

export default App;