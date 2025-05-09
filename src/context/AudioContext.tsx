
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
  playSound: (soundName: string) => void;
  speak: (text: string) => void;
  muted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [muted, setMuted] = useState<boolean>(false);
  const [audioCache, setAudioCache] = useState<Record<string, HTMLAudioElement>>({});
  
  const sounds = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    notification: '/sounds/notification.mp3',
  };
  
  // Preload sounds
  useEffect(() => {
    const cache: Record<string, HTMLAudioElement> = {};
    
    Object.entries(sounds).forEach(([name, path]) => {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'auto';
      cache[name] = audio;
    });
    
    setAudioCache(cache);
    
    return () => {
      Object.values(cache).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  const playSound = (soundName: string) => {
    if (muted || !audioCache[soundName]) return;
    
    try {
      // Clone the audio to allow overlapping sounds
      const sound = audioCache[soundName].cloneNode() as HTMLAudioElement;
      sound.play().catch(err => console.error('Failed to play sound:', err));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  const speak = (text: string) => {
    if (muted || !window.speechSynthesis) return;
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error with speech synthesis:', error);
    }
  };
  
  const toggleMute = () => {
    setMuted(prev => !prev);
    if (!muted) {
      window.speechSynthesis.cancel();
    }
  };
  
  return (
    <AudioContext.Provider value={{ playSound, speak, muted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
