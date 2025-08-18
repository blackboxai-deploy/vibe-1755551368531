import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Clock } from 'lucide-react';

interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  highScore: number;
  gameTime: number;
  isPaused: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  score,
  level,
  lines,
  highScore,
  gameTime,
  isPaused
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const getScoreColor = (current: number, high: number): string => {
    if (current >= high) return 'text-yellow-400';
    if (current >= high * 0.8) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="space-y-4">
      {/* Score Display */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(score, highScore)}`}>
            {formatScore(score)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            High: {formatScore(highScore)}
          </div>
        </CardContent>
      </Card>

      {/* Level and Lines */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-purple-400" />
              Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-400">
              {level}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-green-400" />
              Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-400">
              {lines}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Time */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-blue-400">
            {formatTime(gameTime)}
          </div>
          {isPaused && (
            <Badge variant="secondary" className="mt-2 bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
              PAUSED
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Lines to next level</span>
              <span>{Math.max(0, (level * 10) - lines)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, ((lines % 10) / 10) * 100)}%` 
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Help */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Move:</span>
              <span>← →</span>
            </div>
            <div className="flex justify-between">
              <span>Rotate:</span>
              <span>↑</span>
            </div>
            <div className="flex justify-between">
              <span>Soft Drop:</span>
              <span>↓</span>
            </div>
            <div className="flex justify-between">
              <span>Hard Drop:</span>
              <span>Space</span>
            </div>
            <div className="flex justify-between">
              <span>Pause:</span>
              <span>P</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};