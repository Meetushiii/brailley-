
import { BrailleGrid } from '../types';
import { GRID_SIZE } from './templates';

// Convert grid to Braille text
export const convertGridToBraille = (grid: BrailleGrid): string => {
  let brailleText = '';
  
  // Group dots into Braille cells (3x2 dots)
  for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx += 3) {
    for (let colIdx = 0; colIdx < GRID_SIZE*2; colIdx += 2) {
      let dotPattern = 0;
      
      // Check if each position in the 3x2 cell is filled
      if (rowIdx < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx][colIdx]) dotPattern |= 0b000001;
      if (rowIdx < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx][colIdx+1]) dotPattern |= 0b000010;
      if (rowIdx+1 < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx+1][colIdx]) dotPattern |= 0b000100;
      if (rowIdx+1 < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx+1][colIdx+1]) dotPattern |= 0b001000;
      if (rowIdx+2 < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx+2][colIdx]) dotPattern |= 0b010000;
      if (rowIdx+2 < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx+2][colIdx+1]) dotPattern |= 0b100000;
      
      // Convert to Unicode braille character
      brailleText += String.fromCodePoint(0x2800 + dotPattern);
    }
    brailleText += '\n';
  }
  
  return brailleText;
};

// Get statistics about the Braille art
export const countActiveDots = (grid: BrailleGrid): number => {
  return grid.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
};

export const countRow = (grid: BrailleGrid, rowIdx: number): number => {
  return grid[rowIdx].filter(Boolean).length;
};

export const countColumn = (grid: BrailleGrid, colIdx: number): number => {
  return grid.reduce((acc, row) => acc + (row[colIdx] ? 1 : 0), 0);
};

export const getArtDensity = (grid: BrailleGrid): string => {
  const totalDots = GRID_SIZE * GRID_SIZE * 2;
  const activeDots = countActiveDots(grid);
  const percentage = (activeDots / totalDots) * 100;
  
  if (percentage < 10) return 'very sparse';
  if (percentage < 25) return 'sparse';
  if (percentage < 50) return 'moderate';
  if (percentage < 75) return 'dense';
  return 'very dense';
};
