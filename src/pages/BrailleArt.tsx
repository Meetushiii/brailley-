
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrailleGrid } from '@/features/braille-art/types';
import { templates, GRID_SIZE } from '@/features/braille-art/utils/templates';
import BrailleCanvas from '@/features/braille-art/components/BrailleCanvas';
import ToolsPanel from '@/features/braille-art/components/ToolsPanel';
import StatsPanel from '@/features/braille-art/components/StatsPanel';
import BraillePreview from '@/features/braille-art/components/BraillePreview';
import ActionsBar from '@/features/braille-art/components/ActionsBar';
import AboutBrailleArt from '@/features/braille-art/components/AboutBrailleArt';

const BrailleArt = () => {
  // State management
  const [grid, setGrid] = useState<BrailleGrid>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false)));
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'draw' | 'erase'>('draw');
  const [brushSize, setBrushSize] = useState(1);
  const [title, setTitle] = useState('Untitled Braille Art');
  const [undoStack, setUndoStack] = useState<BrailleGrid[]>([]);
  const [redoStack, setRedoStack] = useState<BrailleGrid[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<string>('blank');
  const [audioDescription, setAudioDescription] = useState('');
  
  // Save the current state to undo stack
  const saveToUndoStack = () => {
    setUndoStack([...undoStack, grid.map(row => [...row])]);
    setRedoStack([]);
  };
  
  // Undo the last action
  const undo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, undoStack.length - 1);
    
    setRedoStack([...redoStack, grid.map(row => [...row])]);
    setGrid(previousState);
    setUndoStack(newUndoStack);
  };
  
  // Redo the last undone action
  const redo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    
    setUndoStack([...undoStack, grid.map(row => [...row])]);
    setGrid(nextState);
    setRedoStack(newRedoStack);
  };
  
  // Clear the canvas
  const clearCanvas = () => {
    saveToUndoStack();
    setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE*2).fill(false)));
    setCurrentTemplate('blank');
  };
  
  // Update the grid with new state
  const updateGrid = (newGrid: BrailleGrid) => {
    setGrid(newGrid);
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
              <BrailleCanvas 
                grid={grid}
                currentTool={currentTool}
                brushSize={brushSize}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                onUpdateGrid={updateGrid}
              />
              
              <ActionsBar 
                grid={grid}
                title={title}
                undoStack={undoStack}
                redoStack={redoStack}
                onUndo={undo}
                onRedo={redo}
                onClear={clearCanvas}
                onCopyAsBraille={() => {}}  // These are handled inside the component
                onDownload={() => {}}       // These are handled inside the component
                onSave={() => {}}           // These are handled inside the component
              />
            </CardContent>
          </Card>
          
          <BraillePreview 
            grid={grid}
            title={title}
            audioDescription={audioDescription}
          />
        </div>
        
        <div className="lg:col-span-2">
          <ToolsPanel 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            currentTemplate={currentTemplate}
            setGrid={setGrid}
            audioDescription={audioDescription}
            setAudioDescription={setAudioDescription}
            onSaveToUndoStack={saveToUndoStack}
            setCurrentTemplate={setCurrentTemplate}
          />
          
          <StatsPanel grid={grid} />
        </div>
      </div>
      
      <AboutBrailleArt />
    </div>
  );
};

export default BrailleArt;
