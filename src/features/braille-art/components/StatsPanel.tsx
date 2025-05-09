
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
    <Card className="overflow-hidden border-2 border-teal-100 shadow-md transition-all hover:shadow-xl group">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 pb-2 group-hover:from-teal-100 group-hover:to-cyan-100 transition-all duration-300">
        <CardTitle className="flex items-center text-teal-700">
          <Fingerprint size={20} className="mr-2 animate-pulse-soft" />
          Artwork Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-b from-white to-cyan-50/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 hover:bg-white hover:shadow-sm transition-all duration-300 border border-teal-100/50">
            <div className="flex items-center">
              <BadgeCheck size={18} className="mr-2 text-cyan-600" />
              <span className="text-sm font-medium text-gray-700">Active Dots:</span>
            </div>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 transform transition-transform duration-300 hover:scale-105">
              {activeDots}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 hover:bg-white hover:shadow-sm transition-all duration-300 border border-teal-100/50">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full animate-pulse-soft" style={{ backgroundColor: densityColor }}></div>
              <span className="text-sm font-medium text-gray-700">Density:</span>
            </div>
            <Badge 
              variant="secondary" 
              className="text-gray-700 transform transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: `${densityColor}40` }}
            >
              {density}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 hover:bg-white hover:shadow-sm transition-all duration-300 border border-teal-100/50">
            <div className="flex items-center">
              <Grid size={18} className="mr-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Canvas Size:</span>
            </div>
            <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700 transform transition-transform duration-300 hover:scale-105">
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
  if (density < 10) return '#0D9488'; // Teal for low density
  if (density < 30) return '#06B6D4'; // Cyan for medium density
  if (density < 50) return '#0EA5E9'; // Sky for high density
  return '#8B5CF6'; // Purple for very high density
};

export default StatsPanel;
