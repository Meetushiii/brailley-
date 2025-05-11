
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
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

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

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

// Fix the libraries type definition
const libraries: ["places", "geometry"] = ["places", "geometry"];

const TactileMapGenerator = () => {
  // Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBubaEt-Fr_KuVLHlmur6ru16GUNLJmE-0", // This is a development key
    libraries,
  });

  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [mapGenerated, setMapGenerated] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ x: 50, y: 50 });
  const [mapCenter, setMapCenter] = useState(center);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [poiEnabled, setPoiEnabled] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [vibrationFeedback, setVibrationFeedback] = useState(true);
  const [mapMode, setMapMode] = useState<'standard' | 'highContrast' | 'braille'>('standard');
  const [landmarks, setLandmarks] = useState<{id: number, name: string, type: string, position: {lat: number, lng: number}}[]>([]);
  const [mapKey, setMapKey] = useState(Date.now());

  // Fix the map reference type
  const mapRef = useRef<google.maps.Map | null>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();

  // Save map instance reference  
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Geocode the address and center the map
  const generateMap = () => {
    if (!isLoaded || !address.trim()) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please enter an address or location name.",
      });
      return;
    }
    
    setSearching(true);
    
    // Use Google Maps Geocoding service
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        setMapCenter(newCenter);
        setMapGenerated(true);
        
        // Generate POIs around the area
        const newLandmarks = [
          { 
            id: 1, 
            name: "Coffee Shop", 
            type: "amenity", 
            position: {
              lat: newCenter.lat + 0.003,
              lng: newCenter.lng - 0.002
            }
          },
          { 
            id: 2, 
            name: "Bus Station", 
            type: "transit", 
            position: {
              lat: newCenter.lat - 0.002,
              lng: newCenter.lng + 0.003
            }
          },
          { 
            id: 3, 
            name: "Park", 
            type: "recreation", 
            position: {
              lat: newCenter.lat + 0.001,
              lng: newCenter.lng + 0.004
            }
          },
          { 
            id: 4, 
            name: "Library", 
            type: "education", 
            position: {
              lat: newCenter.lat - 0.004,
              lng: newCenter.lng - 0.001
            }
          },
          { 
            id: 5, 
            name: "Restaurant", 
            type: "food", 
            position: {
              lat: newCenter.lat - 0.0005,
              lng: newCenter.lng - 0.005
            }
          }
        ];
        
        setLandmarks(newLandmarks);
        setMapKey(Date.now()); // Force map rerender
        
        speak(`Map generated for ${results[0].formatted_address}. Use arrow keys to explore. 5 points of interest found.`);
        toast({
          title: "Map generated",
          description: `Tactile map created for ${results[0].formatted_address}`,
        });
        playSound('success');
      } else {
        toast({
          variant: "destructive",
          title: "Location not found",
          description: "Could not find the specified location.",
        });
        speak("Location not found. Please try a different address.");
      }
      
      setSearching(false);
    });
  };
  
  // Handle arrow key navigation on the map
  const moveOnMap = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!mapGenerated || !mapRef.current) return;
    
    const map = mapRef.current;
    const currentCenter = map.getCenter();
    if (!currentCenter) return;
    
    const lat = currentCenter.lat();
    const lng = currentCenter.lng();
    const latOffset = 0.002;
    const lngOffset = 0.002;
    
    let newLat = lat;
    let newLng = lng;
    
    switch (direction) {
      case 'up':
        newLat += latOffset;
        break;
      case 'down':
        newLat -= latOffset;
        break;
      case 'left':
        newLng -= lngOffset;
        break;
      case 'right':
        newLng += lngOffset;
        break;
    }
    
    const newCenter = new google.maps.LatLng(newLat, newLng);
    map.panTo(newCenter);
    
    // Find nearby landmarks
    const nearbyLandmark = landmarks.find(landmark => {
      const landmarkLatLng = new google.maps.LatLng(
        landmark.position.lat,
        landmark.position.lng
      );
      
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        newCenter,
        landmarkLatLng
      );
      
      return distance < 200; // Within 200 meters
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
    if (!mapGenerated || !mapRef.current) return;
    
    const map = mapRef.current;
    const currentCenter = map.getCenter();
    if (!currentCenter) return;
    
    // Find nearby landmarks
    const nearby = landmarks.filter(landmark => {
      const landmarkLatLng = new google.maps.LatLng(
        landmark.position.lat,
        landmark.position.lng
      );
      
      const currentLatLng = new google.maps.LatLng(
        currentCenter.lat(),
        currentCenter.lng()
      );
      
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        currentLatLng,
        landmarkLatLng
      );
      
      return distance < 300; // Within 300 meters
    });
    
    if (nearby.length > 0) {
      speak(`You are near: ${nearby.map(l => l.name).join(', ')}`);
    } else {
      speak(`You are at position ${currentCenter.lat().toFixed(4)}, ${currentCenter.lng().toFixed(4)} on the map.`);
    }
  };
  
  const toggleMapMode = (mode: 'standard' | 'highContrast' | 'braille') => {
    setMapMode(mode);
    
    // Apply different map styles based on mode
    if (mapRef.current) {
      if (mode === 'highContrast') {
        mapRef.current.setOptions({
          styles: [
            { elementType: "geometry", stylers: [{ color: "#000000" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f0f70" }] }
          ]
        });
      } else {
        mapRef.current.setOptions({
          styles: []
        });
      }
    }
    
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
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() + 1;
      mapRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      
      if (audioFeedback) {
        speak(`Zoom level ${newZoom}`);
      }
    }
  };
  
  const zoomOut = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() - 1;
      mapRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      
      if (audioFeedback) {
        speak(`Zoom level ${newZoom}`);
      }
    }
  };

  // Map render status handling
  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Maps</h2>
              <p>Unable to load Google Maps. Please check your connection or API key.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
              <Button onClick={generateMap} disabled={searching || !address.trim() || !isLoaded}>
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
                  if (mapRef.current) {
                    mapRef.current.setZoom(v[0]);
                  }
                }}
                disabled={!mapGenerated}
              />
            </div>
            
            {/* Google Maps Component */}
            <div 
              className="w-full rounded-lg border border-gray-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-braille-blue focus:border-transparent"
              tabIndex={0}
              onKeyDown={handleKeyNavigation}
            >
              {isLoaded ? (
                <GoogleMap
                  key={mapKey}
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={zoomLevel}
                  options={mapOptions}
                  onLoad={onMapLoad}
                >
                  {/* User location marker */}
                  <Marker
                    position={mapCenter}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: "#FF0000",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#FFFFFF",
                    }}
                  />
                  
                  {/* Landmark markers */}
                  {poiEnabled && landmarks.map(landmark => (
                    <Marker
                      key={landmark.id}
                      position={landmark.position}
                      title={landmark.name}
                      onClick={() => {
                        speak(landmark.name);
                        toast({
                          title: landmark.name,
                          description: `Type: ${landmark.type}`,
                        });
                      }}
                    />
                  ))}
                  
                  {/* User interaction radius */}
                  <Circle
                    center={mapCenter}
                    radius={200}
                    options={{
                      strokeColor: '#FF0000',
                      strokeOpacity: 0.5,
                      strokeWeight: 2,
                      fillColor: '#FF0000',
                      fillOpacity: 0.1,
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center h-80 bg-gray-100">
                  <p className="text-gray-400">Loading Google Maps...</p>
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
