
import React from 'react';
import { BrailleGrid } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';
import { useAudioContext } from '@/context/AudioContext';
import { GRID_SIZE } from '../utils/templates';

interface BraillePreviewProps {
  grid: BrailleGrid;
  title: string;
  audioDescription: string;
}

const BraillePreview: React.FC<BraillePreviewProps> = ({ 
  grid, 
  title,
  audioDescription 
}) => {
  const { speak } = useAudioContext();
  
  const playAudio = () => {
    if (audioDescription) {
      speak(audioDescription);
    } else {
      speak(`Braille art with title: ${title}. A tactile design created with braille dots.`);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Braille Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono whitespace-pre text-xl">
          {Array(Math.ceil(GRID_SIZE/3)).fill(0).map((_, rowGroupIdx) => (
            <div key={rowGroupIdx}>
              {Array(Math.ceil(GRID_SIZE*2/2)).fill(0).map((_, colGroupIdx) => {
                const rowIdx = rowGroupIdx * 3;
                const colIdx = colGroupIdx * 2;
                
                let dotPattern = 0;
                
                if (rowIdx < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx][colIdx]) dotPattern |= 0b000001;
                if (rowIdx < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx][colIdx+1]) dotPattern |= 0b000010;
                if (rowIdx+1 < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx+1][colIdx]) dotPattern |= 0b000100;
                if (rowIdx+1 < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx+1][colIdx+1]) dotPattern |= 0b001000;
                if (rowIdx+2 < GRID_SIZE && colIdx < GRID_SIZE*2 && grid[rowIdx+2][colIdx]) dotPattern |= 0b010000;
                if (rowIdx+2 < GRID_SIZE && colIdx+1 < GRID_SIZE*2 && grid[rowIdx+2][colIdx+1]) dotPattern |= 0b100000;
                
                return String.fromCodePoint(0x2800 + dotPattern);
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline"
            className="flex items-center space-x-1"
            onClick={playAudio}
          >
            <Play size={16} className="mr-2" />
            <Volume2 size={16} className="mr-2" />
            Play Audio Description
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BraillePreview;
