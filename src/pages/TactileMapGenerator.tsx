
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Headphones, Download, Plus, Minus } from 'lucide-react';

const TactileMapGenerator = () => {
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [mapGenerated, setMapGenerated] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(5);
  const [poiEnabled, setPoiEnabled] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [vibrationFeedback, setVibrationFeedback] = useState(true);
  const [mapMode, setMapMode] = useState<'standard' | 'highContrast' | 'braille'>('standard');
  const [landmarks, setLandmarks] = useState<{id: number, name: string, type: string, x: number, y: number}[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  // In a real app, this would connect to a mapping API
  const generateMap = () => {
    if (!address.trim()) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please enter an address or location name.",
      });
      return;
    }
    
    setSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSearching(false);
      setMapGenerated(true);
      
      // Generate random POIs for demo purposes
      const newLandmarks = [
        { id: 1, name: "Coffee Shop", type: "amenity", x: 30, y: 40 },
        { id: 2, name: "Bus Station", type: "transit", x: 60, y: 30 },
        { id: 3, name: "Park", type: "recreation", x: 70, y: 60 },
        { id: 4, name: "Library", type: "education", x: 20, y: 70 },
        { id: 5, name: "Restaurant", type: "food", x: 55, y: 75 }
      ];
      
      setLandmarks(newLandmarks);
      
      speak(`Map generated for ${address}. Use arrow keys to explore. 5 points of interest found.`);
      toast({
        title: "Map generated",
        description: `Tactile map created for ${address}`,
      });
      playSound('success');
    }, 1500);
  };
  
  const moveOnMap = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!mapGenerated) return;
    
    const step = 5;
    let newX = currentLocation.x;
    let newY = currentLocation.y;
    
    switch (direction) {
      case 'up':
        newY = Math.max(0, currentLocation.y - step);
        break;
      case 'down':
        newY = Math.min(100, currentLocation.y + step);
        break;
      case 'left':
        newX = Math.max(0, currentLocation.x - step);
        break;
      case 'right':
        newX = Math.min(100, currentLocation.x + step);
        break;
    }
    
    setCurrentLocation({ x: newX, y: newY });
    
    // Check if near any landmarks
    const nearbyLandmark = landmarks.find(landmark => {
      const distance = Math.sqrt(
        Math.pow(landmark.x - newX, 2) + 
        Math.pow(landmark.y - newY, 2)
      );
      return distance < 10; // Within 10 units
    });
    
    if (nearbyLandmark) {
      if (audioFeedback) {
        speak(`Nearby: ${nearbyLandmark.name}`);
      }
      
      if (vibrationFeedback && navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      toast({
        title: "Point of Interest",
        description: nearbyLandmark.name,
      });
    }
  };
  
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (!mapGenerated) return;
    
    switch (e.key) {
      case 'ArrowUp':
        moveOnMap('up');
        e.preventDefault();
        break;
      case 'ArrowDown':
        moveOnMap('down');
        e.preventDefault();
        break;
      case 'ArrowLeft':
        moveOnMap('left');
        e.preventDefault();
        break;
      case 'ArrowRight':
        moveOnMap('right');
        e.preventDefault();
        break;
      case ' ':
        // Spacebar to announce current position
        announcePosition();
        e.preventDefault();
        break;
    }
  };
  
  const announcePosition = () => {
    if (!mapGenerated) return;
    
    // Find nearby landmarks
    const nearby = landmarks.filter(landmark => {
      const distance = Math.sqrt(
        Math.pow(landmark.x - currentLocation.x, 2) + 
        Math.pow(landmark.y - currentLocation.y, 2)
      );
      return distance < 15; // Within 15 units
    });
    
    if (nearby.length > 0) {
      speak(`You are near: ${nearby.map(l => l.name).join(', ')}`);
    } else {
      speak(`You are at position ${Math.round(currentLocation.x)}, ${Math.round(currentLocation.y)} on the map.`);
    }
  };
  
  const toggleMapMode = (mode: 'standard' | 'highContrast' | 'braille') => {
    setMapMode(mode);
    if (mapGenerated) {
      speak(`Map mode changed to ${mode}`);
      playSound('click');
    }
  };
  
  const downloadMap = () => {
    if (!mapGenerated) return;
    
    toast({
      title: "Map downloaded",
      description: "Tactile map ready for printing or embossing",
    });
    speak("Map downloaded and ready for tactile printing.");
    playSound('success');
  };
  
  const zoomIn = () => {
    setZoomLevel(Math.min(10, zoomLevel + 1));
    if (audioFeedback) {
      speak(`Zoom level ${zoomLevel + 1}`);
    }
  };
  
  const zoomOut = () => {
    setZoomLevel(Math.max(1, zoomLevel - 1));
    if (audioFeedback) {
      speak(`Zoom level ${zoomLevel - 1}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Tactile Map Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Interactive Tactile Map</CardTitle>
          <CardDescription>Enter any address or location to create a tactile map with audio and haptic feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter address, city, landmark, etc."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateMap()}
                />
              </div>
              <Button onClick={generateMap} disabled={searching || !address.trim()}>
                {searching ? "Searching..." : (
                  <>
                    <Search size={16} className="mr-2" />
                    Generate Map
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex space-x-4">
              <div className="space-y-2">
                <Label htmlFor="poi-toggle">Points of Interest</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="poi-toggle"
                    checked={poiEnabled}
                    onCheckedChange={setPoiEnabled}
                  />
                  <span className="text-sm text-gray-500">
                    {poiEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audio-toggle">Audio Feedback</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audio-toggle"
                    checked={audioFeedback}
                    onCheckedChange={setAudioFeedback}
                  />
                  <span className="text-sm text-gray-500">
                    {audioFeedback ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vibration-toggle">Vibration Feedback</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="vibration-toggle"
                    checked={vibrationFeedback}
                    onCheckedChange={setVibrationFeedback}
                  />
                  <span className="text-sm text-gray-500">
                    {vibrationFeedback ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
            
            <Tabs value={mapMode} onValueChange={(v) => toggleMapMode(v as any)}>
              <TabsList className="w-full">
                <TabsTrigger value="standard" className="flex-1">Standard Map</TabsTrigger>
                <TabsTrigger value="highContrast" className="flex-1">High Contrast</TabsTrigger>
                <TabsTrigger value="braille" className="flex-1">Braille Overlay</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Zoom Level: {zoomLevel}</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={zoomOut} 
                    disabled={zoomLevel <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={zoomIn} 
                    disabled={zoomLevel >= 10}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              <Slider
                value={[zoomLevel]}
                min={1}
                max={10}
                step={1}
                onValueChange={(v) => setZoomLevel(v[0])}
              />
            </div>
            
            {/* Map Display Area */}
            <div 
              ref={mapRef}
              className={`relative w-full h-80 rounded-lg border border-gray-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-braille-blue focus:border-transparent ${
                mapGenerated ? 'bg-white' : 'bg-gray-100'
              }`}
              tabIndex={0}
              onKeyDown={handleKeyNavigation}
              style={{
                backgroundColor: mapMode === 'highContrast' ? '#000' : '#fff',
                cursor: mapGenerated ? 'crosshair' : 'default'
              }}
            >
              {mapGenerated ? (
                <>
                  {landmarks.map(landmark => (
                    <div
                      key={landmark.id}
                      className={`absolute rounded-full w-4 h-4 flex items-center justify-center ${
                        mapMode === 'highContrast' 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-braille-blue text-white'
                      }`}
                      style={{
                        left: `${landmark.x}%`,
                        top: `${landmark.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      aria-label={landmark.name}
                    >
                      {mapMode === 'braille' ? '⠏' : ''}
                    </div>
                  ))}
                  
                  {/* User Position Indicator */}
                  <div
                    className={`absolute rounded-full w-6 h-6 flex items-center justify-center animate-pulse ${
                      mapMode === 'highContrast' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                    style={{
                      left: `${currentLocation.x}%`,
                      top: `${currentLocation.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <MapPin size={16} />
                  </div>
                  
                  {/* Street Grid Overlay (simplified) */}
                  <div className={`absolute inset-0 ${
                    mapMode === 'highContrast' ? 'opacity-50' : 'opacity-30'
                  }`}>
                    <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                      {Array(10).fill(0).map((_, i) => (
                        <div key={i} className="border-t border-r border-gray-400" />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Enter an address and generate a map</p>
                </div>
              )}
            </div>
            
            {/* Navigation Controls */}
            {mapGenerated && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveOnMap('up')}
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveOnMap('left')}
                    aria-label="Move left"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={announcePosition}
                    aria-label="Announce position"
                  >
                    <Headphones size={16} className="mr-2" />
                    Where am I?
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveOnMap('right')}
                    aria-label="Move right"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveOnMap('down')}
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Use arrow keys for navigation, spacebar to announce position
          </p>
          
          <Button 
            onClick={downloadMap}
            disabled={!mapGenerated}
            className="flex items-center space-x-1"
          >
            <Download size={16} className="mr-2" />
            Export for Printing
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use the Tactile Map</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Enter an address or location name and click "Generate Map".</li>
            <li>Use the arrow keys (or on-screen buttons) to navigate around the map.</li>
            <li>Press the spacebar or "Where am I?" button to hear your current position.</li>
            <li>Toggle audio and haptic feedback to customize your experience.</li>
            <li>Switch between Standard, High Contrast, and Braille overlay modes.</li>
            <li>Download the map for tactile printing or embossing.</li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-braille-blue" />
              Map Legend:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-braille-blue" />
                <span>Points of Interest</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-400" />
                <span>Streets/Paths</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TactileMapGenerator;
