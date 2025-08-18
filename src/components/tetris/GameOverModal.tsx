import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  level,
  lines,
  onRestart,
}) => {
  const highScore = typeof window !== 'undefined' ? parseInt(localStorage.getItem('tetris-high-score') || '0') : 0;
  const isNewHighScore = score > highScore;
  
  if (isNewHighScore && typeof window !== 'undefined') {
    localStorage.setItem('tetris-high-score', score.toString());
  }

  const onClose = () => {
    // Close logic handled by parent
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-400">
            Game Over
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {isNewHighScore && (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 font-bold text-lg">New High Score!</p>
            </div>
          )}
          
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Final Score:</span>
                <span className="text-xl font-bold text-blue-400">{score.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Level Reached:</span>
                <span className="text-lg font-semibold text-green-400">{level}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Lines Cleared:</span>
                <span className="text-lg font-semibold text-purple-400">{lines}</span>
              </div>
              
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">High Score:</span>
                  <span className="text-lg font-bold text-yellow-400">{highScore.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onRestart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2"
            >
              <Home className="h-4 w-4" />
              Menu
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>Press R to restart or ESC to close</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};