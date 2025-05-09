
import React from 'react';
import { BrailleGrid } from '../types';
import { convertGridToBraille } from '../utils/convert';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Trash2, Copy, Download, Save } from 'lucide-react';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';

interface ActionsBarProps {
  grid: BrailleGrid;
  title: string;
  undoStack: BrailleGrid[];
  redoStack: BrailleGrid[];
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCopyAsBraille: () => void;
  onDownload: () => void;
  onSave: () => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({
  grid,
  title,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  onClear,
  onCopyAsBraille,
  onDownload,
  onSave
}) => {
  const { playSound } = useAudioContext();
  const { toast } = useToast();
  
  const copyAsBraille = () => {
    const brailleText = convertGridToBraille(grid);
    
    navigator.clipboard.writeText(brailleText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Braille patterns copied as unicode characters",
        });
        playSound('success');
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy to clipboard",
        });
      });
  };

  const downloadBrailleArt = () => {
    const brailleText = convertGridToBraille(grid);
    
    // Create download link
    const element = document.createElement('a');
    const file = new Blob([brailleText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Art downloaded",
      description: "Your Braille art has been downloaded as a text file",
    });
    playSound('success');
  };
  
  const saveArtwork = () => {
    // In a real app, this would save to a database
    toast({
      title: "Artwork saved!",
      description: `"${title}" has been saved to your gallery`,
    });
    playSound('success');
  };
  
  return (
    <div className="flex justify-between mt-4">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={undoStack.length === 0}
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={redoStack.length === 0}
        >
          <Redo size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={copyAsBraille}
        >
          <Copy size={16} className="mr-2" />
          Copy as Braille
        </Button>
        <Button
          variant="outline"
          onClick={downloadBrailleArt}
        >
          <Download size={16} className="mr-2" />
          Download
        </Button>
        <Button onClick={saveArtwork}>
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ActionsBar;
