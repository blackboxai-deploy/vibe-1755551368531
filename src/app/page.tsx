'use client';

import { useState, useEffect } from 'react';
import { GameBoard } from '@/components/tetris/GameBoard';
import { GameInfo } from '@/components/tetris/GameInfo';
import { GameControls } from '@/components/tetris/GameControls';
import { NextPiece } from '@/components/tetris/NextPiece';
import { GameOverModal } from '@/components/tetris/GameOverModal';
import { useTetris } from '@/hooks/useTetris';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function TetrisGame() {
  const {
    gameState,
    board,
    currentPiece,
    currentPosition,
    nextPiece,
    score,
    lines,
    level,
    startGame,
    pauseGame,
    resetGame,
    movePiece,
    rotatePieceClockwise,
    hardDrop,
    getGhostPosition,
  } = useTetris();

  const [showInstructions, setShowInstructions] = useState(true);
  const [gameTime, setGameTime] = useState(0);

  const ghostPosition = getGhostPosition() || currentPosition;

  const controls = {
    moveLeft: () => movePiece(-1, 0),
    moveRight: () => movePiece(1, 0),
    moveDown: () => movePiece(0, 1),
    rotate: rotatePieceClockwise,
    hardDrop: hardDrop,
    pause: pauseGame,
    restart: resetGame
  };

  useKeyboard({
    controls,
    isGameActive: gameState === 'playing'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TETRIS
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Classic block puzzle game
          </p>
        </div>

        {/* Instructions Banner */}
        {showInstructions && gameState === 'idle' && (
          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-white text-sm mb-2">
              <span className="font-semibold">Controls:</span> ← → ↓ for movement, ↑ for rotate, SPACE for hard drop, P for pause
            </p>
            <button 
              onClick={() => setShowInstructions(false)}
              className="text-purple-400 hover:text-purple-300 text-xs underline"
            >
              Hide instructions
            </button>
          </div>
        )}

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Game Info */}
          <div className="lg:col-span-1 space-y-4">
            <GameInfo 
              score={score}
              level={level}
              lines={lines}
              highScore={typeof window !== 'undefined' ? parseInt(localStorage.getItem('tetris-high-score') || '0') : 0}
              gameTime={gameTime}
              isPaused={gameState === 'paused'}
            />
            <NextPiece piece={nextPiece} />
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <GameBoard 
                gameState={{
                  board,
                  currentPiece,
                  nextPiece,
                  score,
                  level,
                  lines,
                  status: gameState,
                  clearingLines: []
                }}
                currentPiece={currentPiece}
                currentPosition={currentPosition}
                ghostPosition={ghostPosition}
              />
              
              {/* Game State Overlay */}
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">PAUSED</h2>
                    <p className="text-gray-300">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameState === 'idle' && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">READY?</h2>
                    <p className="text-gray-300 mb-6">Press Start to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="lg:col-span-1">
            <GameControls 
              isPlaying={gameState === 'playing'}
              isPaused={gameState === 'paused'}
              onStart={startGame}
              onPause={pauseGame}
              onRestart={resetGame}
            />

            {/* Mobile Controls Hint */}
            <div className="mt-6 lg:hidden">
              <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Mobile Controls</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• Tap sides to move left/right</p>
                  <p>• Tap bottom to soft drop</p>
                  <p>• Tap piece to rotate</p>
                  <p>• Double tap to hard drop</p>
                </div>
              </div>
            </div>

            {/* High Score Display */}
            <div className="mt-6">
              <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">High Score</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {typeof window !== 'undefined' ? (localStorage.getItem('tetris-high-score') || '0') : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        <GameOverModal 
          isOpen={gameState === 'gameOver'}
          score={score}
          level={level}
          lines={lines}
          onRestart={resetGame}
        />

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}