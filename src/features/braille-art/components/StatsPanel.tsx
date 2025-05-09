
import React from 'react';
import { BrailleGrid } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { countActiveDots, getArtDensity } from '../utils/convert';
import { GRID_SIZE } from '../utils/templates';
import { BadgeCheck, Fingerprint, Grid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatsPanelProps {
  grid: BrailleGrid;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ grid }) => {
  const activeDots = countActiveDots(grid);
  const density = getArtDensity(grid);
  const densityColor = getDensityColor(parseFloat(density));
  
  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-violet-50 pb-2">
        <CardTitle className="flex items-center text-braille-blue">
          <Fingerprint size={20} className="mr-2" />
          Artwork Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <BadgeCheck size={18} className="mr-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Active Dots:</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeDots}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: densityColor }}></div>
              <span className="text-sm font-medium text-gray-700">Density:</span>
            </div>
            <Badge 
              variant="secondary" 
              className="text-gray-700"
              style={{ backgroundColor: `${densityColor}40` }}
            >
              {density}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <Grid size={18} className="mr-2 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Canvas Size:</span>
            </div>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              {GRID_SIZE}x{GRID_SIZE*2}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get color based on density value
const getDensityColor = (density: number): string => {
  if (density < 10) return '#10B981'; // Green for low density
  if (density < 30) return '#3B82F6'; // Blue for medium density
  if (density < 50) return '#F59E0B'; // Amber for high density
  return '#EF4444'; // Red for very high density
};

export default StatsPanel;
