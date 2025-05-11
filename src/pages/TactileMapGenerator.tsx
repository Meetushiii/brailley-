
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, Search, ArrowDown, ArrowUp, ArrowLeft, ArrowRight,
  Headphones, Download, Plus, Minus
} from 'lucide-react';

// Define map container styles
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

// Initial center position
const center = {
  lat: 37.7749,
  lng: -122.4194
};

// Replace the Google Maps with a static map for now
const TactileMapGenerator = () => {
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [mapGenerated, setMapGenerated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [poiEnabled, setPoiEnabled] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [vibrationFeedback, setVibrationFeedback] = useState(true);
  const [mapMode, setMapMode] = useState<'standard' | 'highContrast' | 'braille'>('standard');
  
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();

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
    
    // Simulate geocoding process
    setTimeout(() => {
      setMapGenerated(true);
      setSearching(false);
      
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
    
    // Simulate finding nearby landmarks
    const nearbyOptions = [
      { name: "Coffee Shop", type: "amenity" },
      { name: "Bus Station", type: "transit" },
      { name: "Park", type: "recreation" },
      { name: "Library", type: "education" },
      { name: "Restaurant", type: "food" }
    ];
    
    // 30% chance to find a landmark
    if (Math.random() > 0.7) {
      const randomLandmark = nearbyOptions[Math.floor(Math.random() * nearbyOptions.length)];
      
      if (audioFeedback) {
        speak(`Nearby: ${randomLandmark.name}`);
      }
      
      if (vibrationFeedback && navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      toast({
        title: "Point of Interest",
        description: randomLandmark.name,
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
        announcePosition();
        e.preventDefault();
        break;
    }
  };
  
  const announcePosition = () => {
    if (!mapGenerated) return;
    
    // Simulate announcing the current position
    const nearbyOptions = [
      "Coffee Shop", "Bus Station", "Park", "Library", "Restaurant"
    ];
    
    // 50% chance to find landmarks
    if (Math.random() > 0.5) {
      const randomLandmarks = nearbyOptions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      speak(`You are near: ${randomLandmarks.join(', ')}`);
    } else {
      speak(`You are at the center of the map.`);
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
    const newZoom = zoomLevel + 1;
    setZoomLevel(newZoom);
    
    if (audioFeedback) {
      speak(`Zoom level ${newZoom}`);
    }
  };
  
  const zoomOut = () => {
    const newZoom = zoomLevel - 1;
    setZoomLevel(newZoom);
    
    if (audioFeedback) {
      speak(`Zoom level ${newZoom}`);
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
                  aria-label="Enter location"
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
                    disabled={!mapGenerated}
                  >
                    <Minus size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={zoomIn} 
                    disabled={!mapGenerated}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              <Slider
                value={[zoomLevel]}
                min={8}
                max={20}
                step={1}
                onValueChange={(v) => {
                  setZoomLevel(v[0]);
                }}
                disabled={!mapGenerated}
              />
            </div>
            
            {/* Map Display Area */}
            <div 
              className="w-full h-[400px] rounded-lg border border-gray-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-braille-blue focus:border-transparent flex items-center justify-center"
              tabIndex={0}
              onKeyDown={handleKeyNavigation}
            >
              {mapGenerated ? (
                <div 
                  className={`w-full h-full relative ${mapMode === 'highContrast' ? 'bg-black' : 'bg-gray-100'}`}
                >
                  {/* Simulate map grid */}
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                    {Array(100).fill(0).map((_, i) => (
                      <div 
                        key={i}
                        className={`border ${mapMode === 'highContrast' ? 'border-white' : 'border-gray-200'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Center marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-4 h-4 rounded-full bg-red-500 border-2 ${mapMode === 'highContrast' ? 'border-white' : 'border-white'}`}></div>
                  </div>
                  
                  {/* POI markers - only if enabled */}
                  {poiEnabled && (
                    <>
                      <div className="absolute top-1/4 left-1/3">
                        <div className={`w-3 h-3 rounded-full ${mapMode === 'highContrast' ? 'bg-white' : 'bg-blue-500'}`}></div>
                      </div>
                      <div className="absolute top-2/3 left-1/4">
                        <div className={`w-3 h-3 rounded-full ${mapMode === 'highContrast' ? 'bg-white' : 'bg-blue-500'}`}></div>
                      </div>
                      <div className="absolute top-1/3 left-3/4">
                        <div className={`w-3 h-3 rounded-full ${mapMode === 'highContrast' ? 'bg-white' : 'bg-blue-500'}`}></div>
                      </div>
                      <div className="absolute top-3/4 right-1/4">
                        <div className={`w-3 h-3 rounded-full ${mapMode === 'highContrast' ? 'bg-white' : 'bg-blue-500'}`}></div>
                      </div>
                      <div className="absolute bottom-1/4 right-1/3">
                        <div className={`w-3 h-3 rounded-full ${mapMode === 'highContrast' ? 'bg-white' : 'bg-blue-500'}`}></div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <MapPin className="text-gray-400 mb-2" size={40} />
                  <p className="text-gray-400">Enter a location to generate a map</p>
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
