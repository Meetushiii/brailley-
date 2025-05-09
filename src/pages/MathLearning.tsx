
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrailleCell from '@/components/BrailleCell';
import { numberToBrailleDots, mathSymbols } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { Check, RefreshCw } from 'lucide-react';

const MathLearning = () => {
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  // For basic addition game
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  
  // For multiplication tables
  const [selectedTable, setSelectedTable] = useState(1);
  
  // Generate new addition problem
  const generateAdditionProblem = () => {
    const newNum1 = Math.floor(Math.random() * 10);
    const newNum2 = Math.floor(Math.random() * 10);
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer(null);
    setIsCorrect(null);
    speak(`What is ${newNum1} plus ${newNum2}?`);
  };
  
  // Initialize the game
  useEffect(() => {
    generateAdditionProblem();
  }, []);
  
  // Check user's answer
  const checkAnswer = (answer: number) => {
    setUserAnswer(answer);
    const correctAnswer = num1 + num2;
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      playSound('success');
      speak(`Correct! ${num1} plus ${num2} equals ${correctAnswer}`);
      setStreak(prev => prev + 1);
      toast({
        title: "Correct!",
        description: `${num1} + ${num2} = ${correctAnswer}`,
      });
      
      // Generate a new problem after a short delay
      setTimeout(() => {
        generateAdditionProblem();
      }, 2000);
    } else {
      playSound('error');
      speak(`Not quite. Try again. What is ${num1} plus ${num2}?`);
      setStreak(0);
    }
  };
  
  // Play the multiplication table
  const playMultiplicationTable = (base: number) => {
    setSelectedTable(base);
    
    let speechText = `${base} times table: `;
    for (let i = 1; i <= 10; i++) {
      speechText += `${base} times ${i} equals ${base * i}. `;
    }
    
    speak(speechText);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Math Learning Center</h1>
      
      <Tabs defaultValue="addition" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="addition">Addition Game</TabsTrigger>
          <TabsTrigger value="multiplication">Multiplication Tables</TabsTrigger>
          <TabsTrigger value="braille-math">Braille Math Symbols</TabsTrigger>
        </TabsList>
        
        <TabsContent value="addition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Addition Practice Game</span>
                <span className="text-sm bg-braille-blue text-white px-3 py-1 rounded-full">
                  Streak: {streak}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center space-x-4 text-4xl font-bold">
                  <div className="flex flex-col items-center">
                    <span>{num1}</span>
                    <div className="flex justify-center mt-2">
                      {numberToBrailleDots(num1).map((dots, idx) => (
                        <BrailleCell key={idx} dots={dots} size="md" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>+</span>
                    <div className="flex justify-center mt-2">
                      <BrailleCell dots={mathSymbols.plus} size="md" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{num2}</span>
                    <div className="flex justify-center mt-2">
                      {numberToBrailleDots(num2).map((dots, idx) => (
                        <BrailleCell key={idx} dots={dots} size="md" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>=</span>
                    <div className="flex justify-center mt-2">
                      <BrailleCell dots={mathSymbols.equals} size="md" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`${isCorrect === false ? 'text-red-500' : ''}`}>
                      {userAnswer !== null ? userAnswer : '?'}
                    </span>
                    <div className="flex justify-center mt-2">
                      {userAnswer !== null ? (
                        numberToBrailleDots(userAnswer).map((dots, idx) => (
                          <BrailleCell key={idx} dots={dots} size="md" />
                        ))
                      ) : (
                        <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-2xl text-gray-400">?</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isCorrect === true && (
                  <div className="flex items-center justify-center space-x-2 text-green-500 animate-pulse">
                    <Check size={24} />
                    <span className="font-bold">Correct!</span>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <Button 
                      key={num} 
                      className="math-button h-16 text-2xl"
                      onClick={() => checkAnswer(num)}
                      disabled={isCorrect === true}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button 
                    className="math-button h-16 col-span-3 bg-braille-teal hover:bg-teal-700"
                    onClick={generateAdditionProblem}
                  >
                    <RefreshCw className="mr-2" size={20} />
                    New Problem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multiplication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multiplication Tables with Sound</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Button 
                      key={num} 
                      className={`py-6 ${selectedTable === num ? 'bg-braille-yellow text-braille-black' : ''}`}
                      onClick={() => playMultiplicationTable(num)}
                    >
                      {num}× Table
                    </Button>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">{selectedTable}× Multiplication Table</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <div key={num} className="p-4 border rounded-lg hover:bg-white transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-medium">
                            {selectedTable} × {num}
                          </span>
                          <span className="text-lg font-bold">{selectedTable * num}</span>
                        </div>
                        <div className="flex justify-center mt-2">
                          {numberToBrailleDots(selectedTable * num).map((dots, idx) => (
                            <BrailleCell key={idx} dots={dots} size="sm" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="braille-math" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Braille Math Symbols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                <div className="p-4 border rounded-lg flex flex-col items-center" onClick={() => speak("Plus")}>
                  <span className="text-2xl mb-2">+</span>
                  <BrailleCell dots={mathSymbols.plus} size="lg" />
                  <span className="mt-2">Plus</span>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center" onClick={() => speak("Minus")}>
                  <span className="text-2xl mb-2">−</span>
                  <BrailleCell dots={mathSymbols.minus} size="lg" />
                  <span className="mt-2">Minus</span>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center" onClick={() => speak("Multiply")}>
                  <span className="text-2xl mb-2">×</span>
                  <BrailleCell dots={mathSymbols.multiply} size="lg" />
                  <span className="mt-2">Multiply</span>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center" onClick={() => speak("Divide")}>
                  <span className="text-2xl mb-2">÷</span>
                  <BrailleCell dots={mathSymbols.divide} size="lg" />
                  <span className="mt-2">Divide</span>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center" onClick={() => speak("Equals")}>
                  <span className="text-2xl mb-2">=</span>
                  <BrailleCell dots={mathSymbols.equals} size="lg" />
                  <span className="mt-2">Equals</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Braille Number System</h3>
                <p className="mb-4">In Braille, numbers use the same dot patterns as the first ten letters of the alphabet (a-j) but are preceded by a number sign (not shown here for simplicity).</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
                  {Array.from({ length: 10 }, (_, i) => i).map((num) => (
                    <div 
                      key={num} 
                      className="p-3 border rounded-lg flex flex-col items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => speak(num.toString())}
                    >
                      <span className="text-xl font-bold mb-2">{num}</span>
                      {numberToBrailleDots(num).map((dots, idx) => (
                        <BrailleCell key={idx} dots={dots} size="md" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MathLearning;
