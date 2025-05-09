
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BrailleCell from '@/components/BrailleCell';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Save, Trash2, Undo, Redo, Copy, Volume2, Play } from 'lucide-react';

// Define canvas grid size
const GRID_SIZE = 20;
const DOT_SIZE = 12;
const GRID_GAP = 4;

const BrailleArt = () => {
  const [grid, setGrid] = useState<boolean[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false)));
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'draw' | 'erase'>('draw');
  const [brushSize, setBrushSize] = useState(1);
  const [title, setTitle] = useState('Untitled Braille Art');
  const [undoStack, setUndoStack] = useState<boolean[][][]>([]);
  const [redoStack, setRedoStack] = useState<boolean[][][]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<string>('blank');
  const [audioDescription, setAudioDescription] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  // Templates for starting points
  const templates = {
    blank: Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false)),
    flower: createFlowerTemplate(),
    heart: createHeartTemplate(),
    star: createStarTemplate(),
    house: createHouseTemplate(),
  };
  
  function createFlowerTemplate(): boolean[][] {
    const template = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false));
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
  }
  
  function createHeartTemplate(): boolean[][] {
    const template = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false));
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
  }
  
  function createStarTemplate(): boolean[][] {
    const template = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false));
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
  }
  
  function createHouseTemplate(): boolean[][] {
    const template = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false));
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
  }
  
  const loadTemplate = (templateName: string) => {
    const template = templates[templateName as keyof typeof templates] || templates.blank;
    saveToUndoStack();
    setGrid([...template.map(row => [...row])]);
    setCurrentTemplate(templateName);
    playSound('click');
    
    if (templateName !== 'blank') {
      toast({
        title: "Template loaded",
        description: `${templateName.charAt(0).toUpperCase() + templateName.slice(1)} template applied`,
      });
    }
  };
  
  const saveToUndoStack = () => {
    setUndoStack([...undoStack, grid.map(row => [...row])]);
    setRedoStack([]);
  };
  
  const undo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, undoStack.length - 1);
    
    setRedoStack([...redoStack, grid.map(row => [...row])]);
    setGrid(previousState);
    setUndoStack(newUndoStack);
    playSound('click');
  };
  
  const redo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    
    setUndoStack([...undoStack, grid.map(row => [...row])]);
    setGrid(nextState);
    setRedoStack(newRedoStack);
    playSound('click');
  };
  
  const clearCanvas = () => {
    saveToUndoStack();
    setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false)));
    setCurrentTemplate('blank');
    toast({
      title: "Canvas cleared",
      description: "All dots have been removed",
    });
    playSound('click');
  };
  
  const handleMouseDown = (rowIdx: number, colIdx: number) => {
    saveToUndoStack();
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
    
    setGrid(newGrid);
    playSound('click');
  };
  
  const downloadBrailleArt = () => {
    // Convert grid to a downloadable format
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
  
  const copyAsBraille = () => {
    // Convert grid to Braille text
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
  
  const playAudio = () => {
    if (audioDescription) {
      speak(audioDescription);
    } else {
      speak(`Braille art with title: ${title}. A tactile design created with braille dots.`);
    }
  };
  
  const countActiveDots = () => {
    return grid.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  };
  
  const countRow = (rowIdx: number) => {
    return grid[rowIdx].filter(Boolean).length;
  };
  
  const countColumn = (colIdx: number) => {
    return grid.reduce((acc, row) => acc + (row[colIdx] ? 1 : 0), 0);
  };
  
  const getArtDensity = () => {
    const totalDots = GRID_SIZE * GRID_SIZE * 2;
    const activeDots = countActiveDots();
    const percentage = (activeDots / totalDots) * 100;
    
    if (percentage < 10) return 'very sparse';
    if (percentage < 25) return 'sparse';
    if (percentage < 50) return 'moderate';
    if (percentage < 75) return 'dense';
    return 'very dense';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Braille Art Creator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Canvas</CardTitle>
                  <CardDescription>Create tactile art using Braille dots</CardDescription>
                </div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="max-w-[200px]"
                  placeholder="Artwork title..."
                />
              </div>
            </CardHeader>
            <CardContent>
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
              
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={undo}
                    disabled={undoStack.length === 0}
                  >
                    <Undo size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={redo}
                    disabled={redoStack.length === 0}
                  >
                    <Redo size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearCanvas}
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
            </CardContent>
          </Card>
          
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
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Drawing Tool</Label>
                  <Tabs value={currentTool} onValueChange={(value) => setCurrentTool(value as 'draw' | 'erase')}>
                    <TabsList className="w-full">
                      <TabsTrigger value="draw" className="flex-1">Draw</TabsTrigger>
                      <TabsTrigger value="erase" className="flex-1">Erase</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <Label className="mb-2 block">Brush Size: {brushSize}</Label>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Templates</Label>
                  <Select value={currentTemplate} onValueChange={loadTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blank">Blank Canvas</SelectItem>
                      <SelectItem value="flower">Flower</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Audio Description</Label>
                  <Textarea
                    placeholder="Describe your artwork for screen reader users..."
                    className="h-24"
                    value={audioDescription}
                    onChange={(e) => setAudioDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Active Dots:</span>
                  <span className="font-medium">{countActiveDots()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Density:</span>
                  <span className="font-medium">{getArtDensity()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Canvas Size:</span>
                  <span className="font-medium">{GRID_SIZE}x{GRID_SIZE*2}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Braille Art</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Braille art uses patterns of raised dots to create tactile images that can be explored through 
            touch. It's a unique form of artistic expression that makes visual concepts accessible to 
            those with visual impairments while also being visually interesting for sighted individuals.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Tactile Experience</h3>
              <p className="text-sm">
                Create art that can be experienced through touch, providing a multisensory creative outlet.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Export Options</h3>
              <p className="text-sm">
                Download your design for embossing or 3D printing to create physical, tactile artwork.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Creative Expression</h3>
              <p className="text-sm">
                Use dots to create patterns, shapes, scenes, or abstract designs in a unique artistic medium.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrailleArt;
