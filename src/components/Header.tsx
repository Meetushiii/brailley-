
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioContext } from '@/context/AudioContext';

const Header: React.FC = () => {
  const { muted, toggleMute } = useAudioContext();

  return (
    <header className="bg-braille-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Braillely</h1>
        </Link>
        
        <nav className="flex space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-1">
              <Home size={20} />
              <span>Home</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/text-to-braille" className="flex items-center space-x-1">
              <span>Text to Braille</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/voice-to-braille" className="flex items-center space-x-1">
              <span>Voice to Braille</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/math-learning" className="flex items-center space-x-1">
              <BookOpen size={20} />
              <span>Math Learning</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="ml-2"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
