"use client";

import React, { useRef, useEffect } from 'react';
import { FullGameState, Position, Piece, Board } from '@/lib/tetris/types';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, PIECE_COLORS } from '@/lib/tetris/constants';

interface GameBoardProps {
  gameState: FullGameState;
  currentPiece: Piece | null;
  currentPosition: Position;
  ghostPosition: Position;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPiece,
  currentPosition,
  ghostPosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e1e3f';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }

    // Draw placed pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = gameState.board[y][x];
        if (cell !== 0) {
          // Cell contains piece type string, map to color
          const color = PIECE_COLORS[cell as keyof typeof PIECE_COLORS] || PIECE_COLORS.I;
          drawCell(ctx, x, y, color, 1);
        }
      }
    }

    // Draw ghost piece (preview of where piece will land)
    if (currentPiece && ghostPosition.y !== currentPosition.y) {
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell !== 0) {
            const x = ghostPosition.x + dx;
            const y = ghostPosition.y + dy;
            if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
              const color = PIECE_COLORS[currentPiece.type as keyof typeof PIECE_COLORS] || PIECE_COLORS.I;
              drawCell(ctx, x, y, color, 0.3);
            }
          }
        });
      });
    }

    // Draw current falling piece
    if (currentPiece) {
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell !== 0) {
            const x = currentPosition.x + dx;
            const y = currentPosition.y + dy;
            if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
              const color = PIECE_COLORS[currentPiece.type as keyof typeof PIECE_COLORS] || PIECE_COLORS.I;
              drawCell(ctx, x, y, color, 1);
            }
          }
        });
      });
    }

    // Draw line clearing animation
    if (gameState.clearingLines.length > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      gameState.clearingLines.forEach(lineY => {
        ctx.fillRect(0, lineY * CELL_SIZE, BOARD_WIDTH * CELL_SIZE, CELL_SIZE);
      });
    }

  }, [gameState, currentPiece, currentPosition, ghostPosition]);

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    alpha: number
  ) => {
    const cellX = x * CELL_SIZE;
    const cellY = y * CELL_SIZE;

    // Save current alpha
    const originalAlpha = ctx.globalAlpha;
    ctx.globalAlpha = alpha;

    // Draw main cell
    ctx.fillStyle = color;
    ctx.fillRect(cellX + 1, cellY + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Draw highlight (top and left edges)
    ctx.fillStyle = lightenColor(color, 0.3);
    ctx.fillRect(cellX + 1, cellY + 1, CELL_SIZE - 2, 2); // Top
    ctx.fillRect(cellX + 1, cellY + 1, 2, CELL_SIZE - 2); // Left

    // Draw shadow (bottom and right edges)
    ctx.fillStyle = darkenColor(color, 0.3);
    ctx.fillRect(cellX + 1, cellY + CELL_SIZE - 3, CELL_SIZE - 2, 2); // Bottom
    ctx.fillRect(cellX + CELL_SIZE - 3, cellY + 1, 2, CELL_SIZE - 2); // Right

    // Restore alpha
    ctx.globalAlpha = originalAlpha;
  };

  const lightenColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * CELL_SIZE}
        height={BOARD_HEIGHT * CELL_SIZE}
        className="border-2 border-gray-600 rounded-lg shadow-2xl bg-gray-900"
        style={{
          imageRendering: 'pixelated',
        }}
      />
      {gameState.status === 'paused' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-white text-4xl font-bold">PAUSED</div>
        </div>
      )}
    </div>
  );
};