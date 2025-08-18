import React from 'react';
import { Piece } from '@/lib/tetris/types';
import { PIECES, PIECE_COLORS } from '@/lib/tetris/constants';

interface NextPieceProps {
  piece: Piece | null;
}

export const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) return null;

  const shape = piece.shape;
  const color = PIECE_COLORS[piece.type as keyof typeof PIECE_COLORS];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white text-sm font-semibold mb-3 text-center">NEXT</h3>
      <div className="flex justify-center items-center min-h-[80px]">
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${shape[0]?.length || 0}, 1fr)`,
            gridTemplateRows: `repeat(${shape.length}, 1fr)`
          }}
        >
          {shape.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-6 h-6 border ${
                  cell === 1
                    ? `border-gray-600 shadow-lg`
                    : 'border-transparent'
                }`}
                style={{
                  backgroundColor: cell === 1 ? color : 'transparent',
                  boxShadow: cell === 1 ? `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 8px ${color}40` : 'none'
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};