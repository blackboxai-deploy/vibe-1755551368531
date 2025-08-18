import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
  onToggleSound?: () => void;
  soundEnabled?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPlaying,
  isPaused,
  onStart,
  onPause,
  onRestart,
  onToggleSound,
  soundEnabled = true,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {!isPlaying ? (
              <Button
                onClick={onStart}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <Button
                onClick={onPause}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="lg"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>

            {onToggleSound && (
              <Button
                onClick={onToggleSound}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                Sound {soundEnabled ? 'On' : 'Off'}
              </Button>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-2">Controls:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};