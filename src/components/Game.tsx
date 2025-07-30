import React, { useState, useEffect, useCallback } from 'react';

interface GameProps {
  onGameOver: (score: number) => void;
}

interface GameObject {
  id: string;
  x: number;
  y: number;
  type: 'obstacle' | 'coin';
}

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const [playerX, setPlayerX] = useState(50);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [speed, setSpeed] = useState(2);

  const gameWidth = 400;
  const gameHeight = 600;
  const playerSize = 40;
  const objectSize = 30;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft' && playerX > 5) {
        setPlayerX(prev => Math.max(5, prev - 15));
      } else if (e.key === 'ArrowRight' && playerX < 95) {
        setPlayerX(prev => Math.min(95, prev + 15));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerX, gameRunning]);

  // Generate objects
  const generateObject = useCallback(() => {
    const isObstacle = Math.random() > 0.3;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10,
      y: -5,
      type: isObstacle ? 'obstacle' : 'coin'
    } as GameObject;
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setDistance(prev => prev + 1);
      setSpeed(prev => Math.min(prev + 0.01, 5));

      // Move objects down
      setObjects(prev => 
        prev
          .map(obj => ({ ...obj, y: obj.y + speed }))
          .filter(obj => obj.y < 105)
      );

      // Generate new objects
      if (Math.random() < 0.02) {
        setObjects(prev => [...prev, generateObject()]);
      }

      // Check collisions
      setObjects(prev => {
        const newObjects = [...prev];
        let scoreBonus = 0;
        let collision = false;

        for (let i = newObjects.length - 1; i >= 0; i--) {
          const obj = newObjects[i];
          const objCenterX = obj.x;
          const objCenterY = obj.y;
          
          if (
            Math.abs(playerX - objCenterX) < 8 &&
            objCenterY > 85 && objCenterY < 95
          ) {
            if (obj.type === 'coin') {
              scoreBonus += 50;
              newObjects.splice(i, 1);
            } else {
              collision = true;
            }
          }
        }

        if (collision) {
          setGameRunning(false);
          onGameOver(score + Math.floor(distance / 10));
        }

        if (scoreBonus > 0) {
          setScore(prev => prev + scoreBonus);
        }

        return newObjects;
      });

      // Update score based on distance
      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, speed, distance, playerX, score, onGameOver, generateObject]);

  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-sm text-gray-400">Distance: {Math.floor(distance / 10)}m</div>
        </div>
        <div className="text-white text-right">
          <div className="text-sm text-gray-400">Speed: {speed.toFixed(1)}</div>
        </div>
      </div>

      <div
        className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 rounded-2xl overflow-hidden mx-auto border-4 border-gray-600/50"
        style={{ width: gameWidth, height: gameHeight }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-8 bg-gray-600/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-12 h-6 bg-gray-600/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-56 left-20 w-20 h-10 bg-gray-600/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Player */}
        <div
          className="absolute w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full shadow-lg transition-all duration-150 border-2 border-white flex items-center justify-center"
          style={{
            left: `${playerX}%`,
            top: '90%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Game objects */}
        {objects.map(obj => (
          <div
            key={obj.id}
            className={`absolute w-8 h-8 rounded-full shadow-lg transition-all duration-100 ${
              obj.type === 'obstacle'
                ? 'bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400'
                : 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300'
            }`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {obj.type === 'coin' && (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                $
              </div>
            )}
          </div>
        ))}

        {/* Game instructions */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-300 border border-gray-600/30">
            Use ← → arrow keys to move
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;