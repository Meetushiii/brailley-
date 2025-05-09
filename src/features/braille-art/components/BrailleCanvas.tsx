
import React, { useRef } from 'react';
import { BrailleGrid, ToolType } from '../types';
import { DOT_SIZE, GRID_GAP, GRID_SIZE } from '../utils/templates';
import { useAudioContext } from '@/context/AudioContext';

interface BrailleCanvasProps {
  grid: BrailleGrid;
  currentTool: ToolType;
  brushSize: number;
  isDrawing: boolean;
  setIsDrawing: (value: boolean) => void;
  onUpdateGrid: (newGrid: BrailleGrid) => void;
}

const BrailleCanvas: React.FC<BrailleCanvasProps> = ({
  grid,
  currentTool,
  brushSize,
  isDrawing,
  setIsDrawing,
  onUpdateGrid,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudioContext();
  
  const handleMouseDown = (rowIdx: number, colIdx: number) => {
    setIsDrawing(true);
    updateDot(rowIdx, colIdx);
  };
  
  const handleMouseMove = (rowIdx: number, colIdx: number) => {
    if (!isDrawing) return;
    updateDot(rowIdx, colIdx);
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  const updateDot = (rowIdx: number, colIdx: number) => {
    // Apply brush size
    const newGrid = [...grid.map(row => [...row])];
    
    const startRow = Math.max(0, rowIdx - Math.floor(brushSize / 2));
    const endRow = Math.min(GRID_SIZE - 1, rowIdx + Math.floor(brushSize / 2));
    const startCol = Math.max(0, colIdx - Math.floor(brushSize / 2));
    const endCol = Math.min(GRID_SIZE*2 - 1, colIdx + Math.floor(brushSize / 2));
    
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        // Check if within brush radius
        if (Math.sqrt(Math.pow(r - rowIdx, 2) + Math.pow(c - colIdx, 2)) <= brushSize / 2) {
          newGrid[r][c] = currentTool === 'draw';
        }
      }
    }
    
    onUpdateGrid(newGrid);
    playSound('click');
  };
  
  return (
    <div 
      className="bg-white border rounded-lg p-4 mb-4 overflow-auto"
      style={{ maxWidth: '100%', overflowX: 'auto' }}
      onMouseLeave={() => setIsDrawing(false)}
    >
      <div 
        ref={canvasRef}
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE*2}, ${DOT_SIZE}px)`,
          gridGap: `${GRID_GAP}px`,
        }}
      >
        {grid.map((row, rowIdx) => 
          row.map((dot, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`w-${DOT_SIZE} h-${DOT_SIZE} rounded-full transition-colors cursor-pointer`}
              style={{ 
                width: `${DOT_SIZE}px`, 
                height: `${DOT_SIZE}px`,
                backgroundColor: dot ? '#1E40AF' : '#E5E7EB'
              }}
              onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
              onMouseMove={() => handleMouseMove(rowIdx, colIdx)}
              onMouseUp={handleMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BrailleCanvas;
