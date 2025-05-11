
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAudioContext } from '@/context/AudioContext';
import { convertMapDataToBraille } from '@/features/braille-art/utils/convert';

interface WorldMapProps {
  mapMode: 'standard' | 'highContrast' | 'braille';
  onMapData?: (data: any) => void;
  onPlaceFound?: (place: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ 
  mapMode = 'standard', 
  onMapData, 
  onPlaceFound 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { speak, playSound } = useAudioContext();
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize Mapbox map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapMode === 'highContrast' 
        ? 'mapbox://styles/mapbox/high-contrast-v10'
        : 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 2,
      projection: 'globe'
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geocoder for searching
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );

    // Handle map click for location information
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Get information about the clicked location
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const placeName = data.features[0].place_name;
            setCurrentLocation(placeName);
            
            if (onPlaceFound) {
              onPlaceFound(placeName);
            }

            // Convert the feature to braille if in braille mode
            if (mapMode === 'braille') {
              const brailleText = convertMapDataToBraille(data);
              console.log("Braille representation:", brailleText);
              
              // In a complete implementation, this would be used to generate
              // a tactile map overlay or exported for embossing
            }

            // Provide audio feedback
            speak(`Selected location: ${placeName}`);
            playSound('click');
          }
        })
        .catch(error => {
          console.error("Error fetching location data:", error);
        });
    });

    // Apply visual settings based on map mode
    if (mapMode === 'braille') {
      // Add custom layer for braille overlay
      map.current.on('load', () => {
        // In a complete implementation, this would add a custom layer
        // that renders braille patterns for geographic features
        
        // For demonstration, we'll add a simple text overlay
        map.current?.addLayer({
          id: 'braille-overlay',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          },
          layout: {
            'text-field': '⠏⠗⠑⠎⠎ ⠋⠕⠗ ⠃⠗⠁⠊⠇⠇⠑',
            'text-font': ['Open Sans Regular'],
            'text-size': 20,
            'text-max-width': 20,
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#1E40AF'
          }
        });
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [mapMode, mapboxToken, onPlaceFound, speak, playSound]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 z-10 bg-white p-2 rounded">
        <input
          type="text"
          placeholder="Enter Mapbox API Key"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
          className="px-2 py-1 border rounded text-sm w-full"
        />
        <p className="text-xs mt-1 text-gray-500">
          Get your API key at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">mapbox.com</a>
        </p>
      </div>
      <div ref={mapContainer} className="absolute inset-0" />
      {currentLocation && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
          <p className="text-sm font-medium">{currentLocation}</p>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
