
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mic, MessageSquare, MapPin, Users, Volume2, Edit, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAudioContext } from '@/context/AudioContext';
import BrailleCell from '@/components/BrailleCell';
import { textToBrailleDots } from '@/utils/brailleUtils';

const Home = () => {
  const { speak } = useAudioContext();
  const welcomeText = "Welcome to Braillely";
  const brailleCells = textToBrailleDots(welcomeText.toLowerCase());

  useEffect(() => {
    speak("Welcome to Braillely. Learn braille and mathematics through an interactive experience with advanced features including collaboration, AI tutoring, tactile maps, and more.");
  }, [speak]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-braille-blue mb-4">Welcome to Braillely</h1>
        <p className="text-xl mb-6">A platform for visually impaired individuals to learn Braille and Mathematics through an interactive multi-sensory experience</p>
        
        <div className="flex justify-center mb-8 overflow-x-auto py-4">
          {brailleCells.map((dots, index) => (
            <BrailleCell key={index} dots={dots} size="lg" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-braille-blue rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Text to Braille</h2>
            <p className="mb-4">Convert text to Braille and learn the Braille alphabet system through interactive displays.</p>
            <Button asChild className="mt-auto">
              <Link to="/text-to-braille">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-braille-yellow rounded-full flex items-center justify-center mb-4">
              <Mic className="text-braille-blue" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Voice to Braille</h2>
            <p className="mb-4">Speak into your device and see your words instantly converted into Braille patterns.</p>
            <Button asChild className="mt-auto">
              <Link to="/voice-to-braille">Try Voice Input</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-braille-teal rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Math Learning</h2>
            <p className="mb-4">Learn mathematics through sound, colors, and interactive tactile experiences.</p>
            <Button asChild className="mt-auto">
              <Link to="/math-learning">Explore Math</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-8">Advanced Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <Edit className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Collaborative Editor</h2>
            <p className="mb-4">Create and edit documents in Braille with real-time collaboration, perfect for group projects and learning.</p>
            <Button asChild className="mt-auto">
              <Link to="/collaborative-editor">Start Collaborating</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">AI Braille Tutor</h2>
            <p className="mb-4">Learn with emotional voice feedback that helps improve confidence, clarity, and reading fluency.</p>
            <Button asChild className="mt-auto">
              <Link to="/braille-tutor">Start Learning</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Tactile Map Generator</h2>
            <p className="mb-4">Generate interactive tactile maps with audio and haptic feedback to explore any location.</p>
            <Button asChild className="mt-auto">
              <Link to="/tactile-map">Explore Maps</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Peer Mentorship Network</h2>
            <p className="mb-4">Connect with mentors, share knowledge, and participate in skill-sharing sessions with the community.</p>
            <Button asChild className="mt-auto">
              <Link to="/peer-mentorship">Join Network</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4">
              <Book className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Braille Art Creator</h2>
            <p className="mb-4">Express your creativity by creating tactile art using Braille dots, exportable for embossing or 3D printing.</p>
            <Button asChild className="mt-auto">
              <Link to="/braille-art">Create Art</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 p-6 bg-braille-blue text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">What is Braillely?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Multi-Sensory Learning</h3>
            <p>Our platform combines visual, auditory, and tactile learning methods to create a comprehensive educational experience.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Accessibility First</h3>
            <p>Designed with accessibility as our primary focus, ensuring education is available to all students regardless of visual impairment.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Collaborative Community</h3>
            <p>Connect with peers and mentors to share knowledge, solve problems together, and build valuable skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
