
import React from 'react';
import { BrailleGrid, ToolType } from '../types';
import { templates } from '../utils/templates';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';

interface ToolsPanelProps {
  currentTool: ToolType;
  setCurrentTool: (value: ToolType) => void;
  brushSize: number;
  setBrushSize: (value: number) => void;
  currentTemplate: string;
  setGrid: (grid: BrailleGrid) => void;
  audioDescription: string;
  setAudioDescription: (value: string) => void;
  onSaveToUndoStack: () => void;
  setCurrentTemplate: (template: string) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  currentTool,
  setCurrentTool,
  brushSize,
  setBrushSize,
  currentTemplate,
  setGrid,
  audioDescription,
  setAudioDescription,
  onSaveToUndoStack,
  setCurrentTemplate,
}) => {
  const { playSound } = useAudioContext();
  const { toast } = useToast();
  
  const loadTemplate = (templateName: string) => {
    const template = templates[templateName as keyof typeof templates] || templates.blank;
    onSaveToUndoStack();
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
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Drawing Tool</Label>
            <Tabs value={currentTool} onValueChange={(value) => setCurrentTool(value as ToolType)}>
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
  );
};

export default ToolsPanel;
