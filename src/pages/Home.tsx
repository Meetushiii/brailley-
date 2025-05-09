
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mic, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAudioContext } from '@/context/AudioContext';
import BrailleCell from '@/components/BrailleCell';
import { textToBrailleDots } from '@/utils/brailleUtils';

const Home = () => {
  const { speak } = useAudioContext();
  const welcomeText = "Welcome to Braille Math Verse";
  const brailleCells = textToBrailleDots(welcomeText.toLowerCase());

  useEffect(() => {
    speak("Welcome to Braille Math Verse. Learn braille and mathematics through an interactive experience.");
  }, [speak]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-braille-blue mb-4">Welcome to BrailleMathVerse</h1>
        <p className="text-xl mb-6">Learn Braille and Mathematics through an interactive multi-sensory experience</p>
        
        <div className="flex justify-center mb-8 overflow-x-auto py-4">
          {brailleCells.map((dots, index) => (
            <BrailleCell key={index} dots={dots} size="lg" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="mt-16 p-6 bg-braille-blue text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Why BrailleMathVerse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Multi-Sensory Learning</h3>
            <p>Our platform combines visual, auditory, and tactile learning methods to create a comprehensive educational experience.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Accessibility First</h3>
            <p>Designed with accessibility as our primary focus, ensuring education is available to all students regardless of visual impairment.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Interactive Mathematics</h3>
            <p>Learn mathematical concepts through engaging, interactive exercises with immediate audio feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
