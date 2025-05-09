
import React from 'react';
import { BrailleGrid } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { countActiveDots, getArtDensity } from '../utils/convert';
import { GRID_SIZE } from '../utils/templates';

interface StatsPanelProps {
  grid: BrailleGrid;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ grid }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Active Dots:</span>
            <span className="font-medium">{countActiveDots(grid)}</span>
          </div>
          <div className="flex justify-between">
            <span>Density:</span>
            <span className="font-medium">{getArtDensity(grid)}</span>
          </div>
          <div className="flex justify-between">
            <span>Canvas Size:</span>
            <span className="font-medium">{GRID_SIZE}x{GRID_SIZE*2}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
