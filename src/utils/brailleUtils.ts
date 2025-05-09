
// Unicode Braille patterns start at U+2800
const BRAILLE_UNICODE_START = 0x2800;

// Mapping English characters to Braille dot patterns (updated for accuracy)
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
  '/': [3, 4],
  // Add number indicator (placed before numbers)
  '#': [3, 4, 5, 6],
  // Add capital letter indicator (placed before capital letters)
  '^': [6], 
  // Add common contractions for Grade 2 Braille
  'and': [1, 2, 3, 4, 6],
  'for': [1, 2, 3, 4, 5, 6],
  'of': [1, 2, 3, 5, 6],
  'the': [2, 3, 4, 6],
  'with': [2, 3, 4, 5, 6],
};

// Grade 2 Braille contractions map
const CONTRACTIONS: Record<string, string> = {
  'and': '⠯',
  'for': '⠿',
  'of': '⠷',
  'the': '⠮',
  'with': '⠾',
  'ch': '⠡',
  'gh': '⠣',
  'sh': '⠩',
  'th': '⠹',
  'wh': '⠱',
  'ed': '⠫',
  'er': '⠻',
  'ou': '⠳',
  'ow': '⠪',
  'st': '⠌',
  'ar': '⠜',
  'ing': '⠬',
};

// Mapping dot numbers to bit positions
const DOT_TO_BIT: Record<number, number> = {
  1: 0,  // top left
  2: 1,  // middle left
  3: 2,  // bottom left
  4: 3,  // top right
  5: 4,  // middle right
  6: 5,  // bottom right
  7: 6,  // bottom left (8-dot braille)
  8: 7,  // bottom right (8-dot braille)
};

// Convert text to Braille Unicode characters
export const textToBraille = (text: string, useGrade2: boolean = false): string => {
  if (useGrade2) {
    return convertToGrade2Braille(text);
  }
  
  return text.split('').map(char => {
    const lowerChar = char.toLowerCase();
    
    if (!(lowerChar in CHAR_TO_DOTS)) {
      return char; // Return the character as is if not in our mapping
    }
    
    // Check if this is an uppercase letter
    const isCapital = char !== lowerChar;
    let result = '';
    
    // Add capital letter indicator for uppercase letters
    if (isCapital) {
      const capIndicator = BRAILLE_UNICODE_START | (1 << DOT_TO_BIT[6]); // Dot 6
      result += String.fromCodePoint(capIndicator);
    }
    
    // Create the braille character
    const dots = CHAR_TO_DOTS[lowerChar];
    let codepoint = BRAILLE_UNICODE_START;
    
    // Set appropriate bits based on dot positions
    dots.forEach(dot => {
      const bitPosition = DOT_TO_BIT[dot];
      codepoint |= (1 << bitPosition);
    });
    
    return result + String.fromCodePoint(codepoint);
  }).join('');
};

// Convert to Grade 2 Braille (with contractions)
export const convertToGrade2Braille = (text: string): string => {
  let result = '';
  const words = text.toLowerCase().split(' ');
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let processedWord = '';
    let j = 0;
    
    // Search for contractions within the word
    while (j < word.length) {
      let foundContraction = false;
      
      // Try to match larger contractions first
      for (let len = 3; len > 0; len--) {
        if (j + len <= word.length) {
          const possibleContraction = word.substring(j, j + len);
          if (possibleContraction in CONTRACTIONS) {
            processedWord += CONTRACTIONS[possibleContraction];
            j += len;
            foundContraction = true;
            break;
          }
        }
      }
      
      // If no contraction found, process single character
      if (!foundContraction) {
        const char = word[j];
        if (char in CHAR_TO_DOTS) {
          let codepoint = BRAILLE_UNICODE_START;
          CHAR_TO_DOTS[char].forEach(dot => {
            codepoint |= (1 << DOT_TO_BIT[dot]);
          });
          processedWord += String.fromCodePoint(codepoint);
        } else {
          processedWord += char;
        }
        j++;
      }
    }
    
    result += processedWord;
    if (i < words.length - 1) {
      // Add space between words
      result += String.fromCodePoint(BRAILLE_UNICODE_START);
    }
  }
  
  return result;
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
  // Add number sign before the number
  const numSign = Array(6).fill(false);
  CHAR_TO_DOTS['#'].forEach(dot => {
    numSign[dot - 1] = true;
  });
  
  const digitDots = number.toString().split('').map(digit => {
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
  
  return [numSign, ...digitDots];
};

// Math symbols
export const mathSymbols = {
  plus: textToBrailleDots('+')[0],
  minus: textToBrailleDots('-')[0],
  multiply: textToBrailleDots('*')[0],
  divide: textToBrailleDots('/')[0],
  equals: textToBrailleDots('=')[0]
};

// Nemeth Code for Math (simplified version)
export const nemethCode = {
  // Nemeth number indicator
  numberIndicator: [3, 4, 5, 6],
  // Nemeth operation symbols
  plus: [3, 4, 6],
  minus: [3, 6],
  multiply: [1, 6],
  divide: [3, 4],
  equals: [1, 3, 4, 6],
  // Nemeth comparison symbols
  lessThan: [1, 2, 6],
  greaterThan: [3, 4, 5],
  // Nemeth fraction indicators
  fractionOpen: [1, 4, 5, 6],
  fractionSeparator: [3, 4],
  fractionClose: [3, 4, 5, 6],
  // Nemeth grouping symbols
  parenthesisOpen: [1, 2, 3, 5, 6],
  parenthesisClose: [2, 3, 4, 5, 6],
  // Nemeth function indicators
  functionIndicator: [1, 2, 4],
  // Convert math expression to Nemeth code dots
  convertToNemeth: (expression: string): boolean[][] => {
    // This is a simplified implementation
    // A complete implementation would need to handle complex expressions
    return expression.split('').map(char => {
      const dots = Array(6).fill(false);
      switch(char) {
        case '+':
          [3, 4, 6].forEach(d => dots[d-1] = true);
          break;
        case '-':
          [3, 6].forEach(d => dots[d-1] = true);
          break;
        case '*':
          [1, 6].forEach(d => dots[d-1] = true);
          break;
        case '/':
          [3, 4].forEach(d => dots[d-1] = true);
          break;
        case '=':
          [1, 3, 4, 6].forEach(d => dots[d-1] = true);
          break;
        case '(':
          [1, 2, 3, 5, 6].forEach(d => dots[d-1] = true);
          break;
        case ')':
          [2, 3, 4, 5, 6].forEach(d => dots[d-1] = true);
          break;
        default:
          if (!isNaN(Number(char))) {
            // For digits in Nemeth, use the same dots as literary braille
            // but they should be preceded by number indicator in practice
            CHAR_TO_DOTS[char]?.forEach(d => dots[d-1] = true);
          } else if (char in CHAR_TO_DOTS) {
            CHAR_TO_DOTS[char].forEach(d => dots[d-1] = true);
          }
      }
      return dots;
    });
  }
};

// Eight-dot Braille for computer Braille notation (NABCC)
export const computerBraille = {
  convertToComputerBraille: (text: string): boolean[][] => {
    // Computer braille uses all 8 dots
    // This is a simplified implementation using ASCII equivalents
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      const dots = Array(8).fill(false);
      
      // Convert ASCII to 8-dot pattern
      // This is a simplified mapping - a real implementation would use NABCC
      for (let i = 0; i < 8; i++) {
        if ((code >> i) & 1) {
          dots[i] = true;
        }
      }
      
      return dots;
    });
  }
};

// Export combined utilities
export const BrailleUtils = {
  textToBraille,
  textToBrailleDots,
  numberToBrailleDots,
  mathSymbols,
  nemethCode,
  computerBraille,
  convertToGrade2Braille,
};

// Default export
export default BrailleUtils;
