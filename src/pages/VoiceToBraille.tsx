
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BrailleCell from '@/components/BrailleCell';
import { textToBrailleDots } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { Mic, MicOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceToBraille = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [brailleDots, setBrailleDots] = useState<boolean[][]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Check if browser supports the Web Speech API
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in this browser.');
    }
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    if (errorMessage) return;
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
      
      recognition.onstart = () => {
        setIsListening(true);
        setIsAnimating(true);
        playSound('click');
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setSpokenText(transcript);
        setBrailleDots(textToBrailleDots(transcript));
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        setIsAnimating(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
        });
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setIsAnimating(false);
        playSound('notification');
      };
      
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setErrorMessage('Could not initialize speech recognition.');
      setIsListening(false);
      setIsAnimating(false);
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const clearResults = () => {
    setSpokenText('');
    setBrailleDots([]);
    playSound('click');
  };
  
  const speakResult = () => {
    if (spokenText) {
      speak(spokenText);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Voice to Braille Converter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Convert your speech to Braille</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-md mb-4">
              {errorMessage}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button 
                  onClick={toggleListening} 
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-braille-blue hover:bg-blue-700'}`}
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </Button>
              </div>
              
              {isAnimating && (
                <div className="audio-wave flex justify-center mb-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="audio-wave-bar"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: `${Math.random() * 100}%`
                      }} 
                    />
                  ))}
                </div>
              )}
              
              <div className="text-center text-lg mb-4">
                {isListening ? (
                  <p>Listening... Speak now</p>
                ) : (
                  <p>Press the microphone button to start speaking</p>
                )}
              </div>
              
              {spokenText && (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h3 className="text-lg font-medium mb-2">Recognized Speech:</h3>
                    <p className="text-xl">{spokenText}</p>
                  </div>
                  
                  <div className="flex justify-center space-x-2 mb-6">
                    <Button onClick={speakResult} className="flex items-center space-x-1">
                      <span>Play Speech</span>
                    </Button>
                    <Button onClick={clearResults} variant="outline" className="flex items-center space-x-1">
                      <RefreshCw size={16} />
                      <span>Clear</span>
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Braille Representation:</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {brailleDots.map((dots, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <BrailleCell dots={dots} size="lg" />
                          <span className="text-sm mt-1 text-gray-500">
                            {spokenText[index] === ' ' ? '_' : spokenText[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Voice to Braille Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Speak clearly and at a moderate pace for the best results.</li>
            <li>Try to minimize background noise when using the voice recognition feature.</li>
            <li>Short phrases work better than long sentences for accurate transcription.</li>
            <li>If a word is not recognized correctly, try pronouncing it differently.</li>
            <li>You may need to grant microphone permissions to use this feature.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToBraille;
