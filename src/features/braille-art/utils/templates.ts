
import { BrailleTemplate } from '../types';

// Define canvas grid size constants
export const GRID_SIZE = 20;
export const DOT_SIZE = 12;
export const GRID_GAP = 4;

const createEmptyGrid = (): boolean[][] => 
  Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false));

export const createFlowerTemplate = (): boolean[][] => {
  const template = createEmptyGrid();
  // Create a simple flower pattern
  // Center
  template[10][20] = true;
  // Petals
  template[8][20] = true;
  template[12][20] = true;
  template[10][18] = true;
  template[10][22] = true;
  // Leaves
  template[14][18] = true;
  template[14][22] = true;
  // Stem
  for (let i = 15; i < 18; i++) {
    template[i][20] = true;
  }
  return template;
};

export const createHeartTemplate = (): boolean[][] => {
  const template = createEmptyGrid();
  // Create a heart pattern
  template[5][18] = true;
  template[5][22] = true;
  template[6][17] = true;
  template[6][19] = true;
  template[6][21] = true;
  template[6][23] = true;
  template[7][18] = true;
  template[7][20] = true;
  template[7][22] = true;
  template[8][19] = true;
  template[8][21] = true;
  template[9][20] = true;
  return template;
};

export const createStarTemplate = (): boolean[][] => {
  const template = createEmptyGrid();
  // Create a star pattern
  template[5][20] = true;
  template[6][20] = true;
  template[7][18] = true;
  template[7][20] = true;
  template[7][22] = true;
  template[8][19] = true;
  template[8][21] = true;
  template[9][15] = true;
  template[9][17] = true;
  template[9][23] = true;
  template[9][25] = true;
  template[10][16] = true;
  template[10][20] = true;
  template[10][24] = true;
  template[11][17] = true;
  template[11][23] = true;
  template[12][18] = true;
  template[12][22] = true;
  template[13][19] = true;
  template[13][21] = true;
  template[14][20] = true;
  return template;
};

export const createHouseTemplate = (): boolean[][] => {
  const template = createEmptyGrid();
  // Roof
  template[5][20] = true;
  template[6][19] = true;
  template[6][21] = true;
  template[7][18] = true;
  template[7][22] = true;
  // House body
  for (let i = 8; i <= 14; i++) {
    template[i][18] = true;
    template[i][22] = true;
  }
  template[14][19] = true;
  template[14][20] = true;
  template[14][21] = true;
  // Door
  template[11][20] = true;
  template[12][20] = true;
  template[13][20] = true;
  // Window
  template[9][20] = true;
  return template;
};

export const templates: BrailleTemplate = {
  blank: createEmptyGrid(),
  flower: createFlowerTemplate(),
  heart: createHeartTemplate(),
  star: createStarTemplate(),
  house: createHouseTemplate(),
};
