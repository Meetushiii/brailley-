
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import BrailleCell from '@/components/BrailleCell';
import { textToBrailleDots, nemethCode } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { Book, Mic, MicOff, PlayCircle, Volume2, Trophy, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mock data for lessons
const brailleLessons = [
  {
    id: 1,
    title: "Alphabet Basics",
    description: "Learn the foundational Braille alphabet patterns.",
    level: "Beginner",
    duration: "15 mins",
    progress: 0,
    characters: "abcdef",
  },
  {
    id: 2,
    title: "Numbers & Symbols",
    description: "Master Braille numbers and common symbols.",
    level: "Beginner",
    duration: "20 mins",
    progress: 0,
    characters: "123456#",
  },
  {
    id: 3,
    title: "Grade 2 Contractions",
    description: "Learn common Braille contractions for faster reading.",
    level: "Intermediate",
    duration: "25 mins",
    progress: 0,
    characters: "and the for of with",
  },
  {
    id: 4,
    title: "Math Notation",
    description: "Explore Nemeth Code for mathematical expressions.",
    level: "Advanced",
    duration: "30 mins",
    progress: 0,
    characters: "+-*/=",
  }
];

// Mock emotion feedback responses
const emotionFeedback = [
  "Your tone sounds confident! Great job.",
  "Try speaking a bit more clearly and with more confidence.",
  "Your pace is excellent, very clear and understandable.",
  "You sound a bit uncertain. Try again with more conviction.",
  "Perfect intonation! Your expression is spot on.",
  "Your enthusiasm comes through well in your voice.",
  "Good job, but try to articulate each sound more distinctly.",
  "Your voice is clear and your reading is fluent.",
  "Excellent job conveying emotion in your reading!",
  "You're making good progress. Your confidence is growing.",
];

const BrailleTutor = () => {
  const [activeLesson, setActiveLesson] = useState<typeof brailleLessons[0] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentChar, setCurrentChar] = useState(0);
  const [displayedChars, setDisplayedChars] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [practiceText, setPracticeText] = useState('');
  const [challengeMode, setChallengeMode] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  useEffect(() => {
    if (activeLesson) {
      setDisplayedChars(activeLesson.characters.split(''));
      setCurrentChar(0);
      setProgress(0);
      setFeedback('');
      setPracticeText('');
    }
  }, [activeLesson]);
  
  // Start the speech recognition
  const startListening = () => {
    if (!activeLesson) return;
    
    // Check if browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
      });
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak the character or phrase...",
        });
        playSound('click');
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setSpokenText(transcript.toLowerCase());
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
        });
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        // Provide emotion feedback (random for demo purposes)
        // In a real app, this would use AI to analyze speech characteristics
        const randomFeedback = emotionFeedback[Math.floor(Math.random() * emotionFeedback.length)];
        setFeedback(randomFeedback);
        
        // Check if the spoken text matches the expected character
        const targetChar = displayedChars[currentChar];
        if (spokenText.toLowerCase().includes(targetChar.toLowerCase())) {
          toast({
            title: "Correct!",
            description: "Great job identifying the character.",
          });
          playSound('success');
          
          // Move to next character
          if (currentChar < displayedChars.length - 1) {
            setCurrentChar(prev => prev + 1);
          } else {
            // Completed all characters
            toast({
              title: "Lesson complete!",
              description: "You've completed this practice session.",
            });
            
            // Update progress
            const newProgress = Math.min(100, activeLesson.progress + 25);
            setProgress(newProgress);
            
            // Reset to first character for another round
            setCurrentChar(0);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Try again",
            description: `Expected "${targetChar}", heard "${spokenText}"`,
          });
          playSound('error');
        }
      };
      
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not initialize speech recognition.",
      });
      setIsListening(false);
    }
  };
  
  // Stop the speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const speakCharacter = () => {
    if (!activeLesson || currentChar >= displayedChars.length) return;
    
    const char = displayedChars[currentChar];
    speak(char);
  };
  
  const selectLesson = (lesson: typeof brailleLessons[0]) => {
    setActiveLesson(lesson);
    speak(`Starting lesson: ${lesson.title}`);
  };
  
  const resetLesson = () => {
    if (!activeLesson) return;
    
    setCurrentChar(0);
    setFeedback('');
    setSpokenText('');
    speak("Lesson reset. Let's try again.");
    playSound('click');
  };
  
  const startPractice = () => {
    if (!practiceText) {
      toast({
        variant: "destructive",
        title: "No text",
        description: "Please enter some text to practice.",
      });
      return;
    }
    
    setActiveLesson({
      id: 999,
      title: "Custom Practice",
      description: "Practice with your own text.",
      level: challengeMode ? "Challenge" : "Custom",
      duration: "Custom",
      progress: 0,
      characters: practiceText,
    });
    
    speak("Custom practice started. Let's begin.");
  };
  
  // Render Braille cells for the active character
  const renderActiveBrailleCell = () => {
    if (!activeLesson || currentChar >= displayedChars.length) return null;
    
    const char = displayedChars[currentChar];
    let dots;
    
    // For math lesson, use Nemeth code
    if (activeLesson.id === 4) {
      switch (char) {
        case '+': dots = nemethCode.plus; break;
        case '-': dots = nemethCode.minus; break;
        case '*': dots = nemethCode.multiply; break;
        case '/': dots = nemethCode.divide; break;
        case '=': dots = nemethCode.equals; break;
        default: dots = textToBrailleDots(char)[0];
      }
    } else {
      dots = textToBrailleDots(char)[0];
    }
    
    return (
      <div className="flex flex-col items-center mt-6 mb-8">
        <h3 className="text-xl mb-4">Character: 
          <span className="text-2xl font-bold ml-2">{char}</span>
        </h3>
        <div className="p-6 bg-gray-50 rounded-lg">
          <BrailleCell dots={dots} size="lg" />
        </div>
        <p className="mt-4 text-gray-500">
          {activeLesson.id === 4 
            ? "Nemeth Code representation for mathematical symbol" 
            : "Braille representation"}
        </p>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">AI-Powered Braille Tutor</h1>
      
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="practice">Custom Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons">
          {!activeLesson ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brailleLessons.map(lesson => (
                <Card key={lesson.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{lesson.title}</CardTitle>
                      <Badge variant={
                        lesson.level === "Beginner" ? "default" :
                        lesson.level === "Intermediate" ? "secondary" : "outline"
                      }>
                        {lesson.level}
                      </Badge>
                    </div>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Duration: {lesson.duration}</span>
                      <span>Progress: {lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => selectLesson(lesson)} className="w-full flex items-center justify-center">
                      <PlayCircle size={16} className="mr-2" />
                      Start Lesson
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeLesson.title}</CardTitle>
                    <CardDescription>{activeLesson.description}</CardDescription>
                  </div>
                  <Badge>{activeLesson.level}</Badge>
                </div>
                <Progress value={progress} className="h-2 mt-4" />
              </CardHeader>
              <CardContent>
                {renderActiveBrailleCell()}
                
                {feedback && (
                  <div className="bg-braille-blue/10 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-1">AI Voice Feedback:</h3>
                    <p>{feedback}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <Button 
                    onClick={speakCharacter}
                    className="flex items-center space-x-2"
                  >
                    <Volume2 size={16} />
                    <span>Hear Character</span>
                  </Button>
                  
                  <Button 
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center space-x-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isListening ? 'Stop' : 'Speak Character'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={resetLesson}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Reset</span>
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Lesson Progress:</h3>
                  <div className="flex space-x-2">
                    {displayedChars.map((char, idx) => (
                      <div 
                        key={idx} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          idx === currentChar 
                            ? 'bg-braille-blue ring-2 ring-offset-2 ring-braille-blue' 
                            : idx < currentChar 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                        }`}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" onClick={() => setActiveLesson(null)}>
                  Return to Lessons
                </Button>
                <div className="flex items-center">
                  <Trophy className="text-yellow-500 mr-2" />
                  <span>Points: {progress}</span>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <CardTitle>Custom Practice</CardTitle>
              <CardDescription>Enter your own text to practice with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="practice-text">Text to Practice</Label>
                  <Textarea
                    id="practice-text"
                    placeholder="Enter words, phrases, or characters you want to practice..."
                    value={practiceText}
                    onChange={(e) => setPracticeText(e.target.value)}
                    className="h-32"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="challenge-mode"
                    checked={challengeMode}
                    onCheckedChange={setChallengeMode}
                  />
                  <Label htmlFor="challenge-mode">Challenge Mode</Label>
                </div>
                
                <Button 
                  onClick={startPractice}
                  disabled={!practiceText}
                  className="w-full flex items-center justify-center"
                >
                  <Book size={16} className="mr-2" />
                  Start Custom Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Learning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ArrowRight size={16} className="mr-2 mt-1 text-braille-blue" />
              <span>Practice speaking clearly and confidently when doing the voice exercises.</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={16} className="mr-2 mt-1 text-braille-blue" />
              <span>Listen to the character pronunciation before attempting to speak it yourself.</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={16} className="mr-2 mt-1 text-braille-blue" />
              <span>The AI will provide feedback on your speech emotion and tone to help improve your communication skills.</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={16} className="mr-2 mt-1 text-braille-blue" />
              <span>Use custom practice to focus on specific characters or words that you find challenging.</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={16} className="mr-2 mt-1 text-braille-blue" />
              <span>Regular practice, even for short periods, will lead to faster mastery of Braille patterns.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrailleTutor;
