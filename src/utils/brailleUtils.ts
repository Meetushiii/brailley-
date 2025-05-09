
// Unicode Braille patterns start at U+2800
const BRAILLE_UNICODE_START = 0x2800;

// Mapping English characters to Braille dot patterns
const CHAR_TO_DOTS: Record<string, number[]> = {
  'a': [1],
  'b': [1, 2],
  'c': [1, 4],
  'd': [1, 4, 5],
  'e': [1, 5],
  'f': [1, 2, 4],
  'g': [1, 2, 4, 5],
  'h': [1, 2, 5],
  'i': [2, 4],
  'j': [2, 4, 5],
  'k': [1, 3],
  'l': [1, 2, 3],
  'm': [1, 3, 4],
  'n': [1, 3, 4, 5],
  'o': [1, 3, 5],
  'p': [1, 2, 3, 4],
  'q': [1, 2, 3, 4, 5],
  'r': [1, 2, 3, 5],
  's': [2, 3, 4],
  't': [2, 3, 4, 5],
  'u': [1, 3, 6],
  'v': [1, 2, 3, 6],
  'w': [2, 4, 5, 6],
  'x': [1, 3, 4, 6],
  'y': [1, 3, 4, 5, 6],
  'z': [1, 3, 5, 6],
  ' ': [],
  ',': [2],
  '.': [2, 5, 6],
  '!': [2, 3, 5],
  '?': [2, 3, 6],
  ';': [2, 3],
  ':': [2, 5],
  "'": [3],
  '-': [3, 6],
  '0': [3, 4, 5, 6],
  '1': [1],
  '2': [1, 2],
  '3': [1, 4],
  '4': [1, 4, 5],
  '5': [1, 5],
  '6': [1, 2, 4],
  '7': [1, 2, 4, 5],
  '8': [1, 2, 5],
  '9': [2, 4],
  '+': [3, 4, 6],
  '=': [3, 4, 5, 6],
  '*': [3, 5],
  '/': [3, 4]
};

// Mapping dot numbers to bit positions
const DOT_TO_BIT: Record<number, number> = {
  1: 0,  // top left
  2: 1,  // middle left
  3: 2,  // bottom left
  4: 3,  // top right
  5: 4,  // middle right
  6: 5,  // bottom right
};

// Convert text to Braille Unicode characters
export const textToBraille = (text: string): string => {
  return text.toLowerCase().split('').map(char => {
    if (!(char in CHAR_TO_DOTS)) {
      return char; // Return the character as is if not in our mapping
    }
    
    const dots = CHAR_TO_DOTS[char];
    let codepoint = BRAILLE_UNICODE_START;
    
    // Set appropriate bits based on dot positions
    dots.forEach(dot => {
      const bitPosition = DOT_TO_BIT[dot];
      codepoint |= (1 << bitPosition);
    });
    
    return String.fromCodePoint(codepoint);
  }).join('');
};

// Convert text to Braille dot arrays (for displaying Braille cells)
export const textToBrailleDots = (text: string): boolean[][] => {
  return text.toLowerCase().split('').map(char => {
    if (!(char in CHAR_TO_DOTS)) {
      // Return an empty cell for characters we don't have mappings for
      return Array(6).fill(false);
    }
    
    const dots = CHAR_TO_DOTS[char];
    const brailleDots = Array(6).fill(false);
    
    dots.forEach(dot => {
      brailleDots[dot - 1] = true;
    });
    
    return brailleDots;
  });
};

// Convert numeric value to Braille dot arrays for math
export const numberToBrailleDots = (number: number): boolean[][] => {
  return number.toString().split('').map(digit => {
    if (!(digit in CHAR_TO_DOTS)) {
      return Array(6).fill(false);
    }
    
    const dots = CHAR_TO_DOTS[digit];
    const brailleDots = Array(6).fill(false);
    
    dots.forEach(dot => {
      brailleDots[dot - 1] = true;
    });
    
    return brailleDots;
  });
};

// Math symbols
export const mathSymbols = {
  plus: textToBrailleDots('+')[0],
  minus: textToBrailleDots('-')[0],
  multiply: textToBrailleDots('*')[0],
  divide: textToBrailleDots('/')[0],
  equals: textToBrailleDots('=')[0]
};
