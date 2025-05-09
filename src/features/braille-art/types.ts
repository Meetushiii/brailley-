
export type BrailleGrid = boolean[][];

export interface BrailleTemplate {
  blank: boolean[][];
  flower: boolean[][];
  heart: boolean[][];
  star: boolean[][];
  house: boolean[][];
}

export type ToolType = 'draw' | 'erase';
