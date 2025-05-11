
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrailleCell from '@/components/BrailleCell';
import { numberToBrailleDots, mathSymbols } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { Check, RefreshCw, Delete } from 'lucide-react';

const MathLearning = () => {
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  // For basic addition game
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  
  // For multiplication
  const [multNum1, setMultNum1] = useState(0);
  const [multNum2, setMultNum2] = useState(0);
  const [multUserAnswer, setMultUserAnswer] = useState<string>('');
  const [isMultCorrect, setIsMultCorrect] = useState<boolean | null>(null);
  const [multStreak, setMultStreak] = useState(0);
  
  // For multiplication tables
  const [selectedTable, setSelectedTable] = useState(1);
  
  // Generate new addition problem
  const generateAdditionProblem = () => {
    const newNum1 = Math.floor(Math.random() * 20); // Increase range for more challenge
    const newNum2 = Math.floor(Math.random() * 20);
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setIsCorrect(null);
    speak(`What is ${newNum1} plus ${newNum2}?`);
  };
  
  // Generate new multiplication problem
  const generateMultiplicationProblem = () => {
    const newNum1 = Math.floor(Math.random() * 10); 
    const newNum2 = Math.floor(Math.random() * 10);
    setMultNum1(newNum1);
    setMultNum2(newNum2);
    setMultUserAnswer('');
    setIsMultCorrect(null);
    speak(`What is ${newNum1} times ${newNum2}?`);
  };
  
  // Initialize the games
  useEffect(() => {
    generateAdditionProblem();
    generateMultiplicationProblem();
  }, []);
  
  // Check addition answer
  const checkAdditionAnswer = () => {
    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;
    
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

  // Check multiplication answer
  const checkMultiplicationAnswer = () => {
    const answer = parseInt(multUserAnswer, 10);
    if (isNaN(answer)) return;
    
    const correctAnswer = multNum1 * multNum2;
    const correct = answer === correctAnswer;
    setIsMultCorrect(correct);
    
    if (correct) {
      playSound('success');
      speak(`Correct! ${multNum1} times ${multNum2} equals ${correctAnswer}`);
      setMultStreak(prev => prev + 1);
      toast({
        title: "Correct!",
        description: `${multNum1} × ${multNum2} = ${correctAnswer}`,
      });
      
      // Generate a new problem after a short delay
      setTimeout(() => {
        generateMultiplicationProblem();
      }, 2000);
    } else {
      playSound('error');
      speak(`Not quite. Try again. What is ${multNum1} times ${multNum2}?`);
      setMultStreak(0);
    }
  };
  
  // Handle numeric button click for addition
  const handleAdditionDigitClick = (digit: number) => {
    if (isCorrect === true) return;
    setUserAnswer(prev => prev + digit.toString());
  };
  
  // Handle numeric button click for multiplication
  const handleMultDigitClick = (digit: number) => {
    if (isMultCorrect === true) return;
    setMultUserAnswer(prev => prev + digit.toString());
  };
  
  // Clear last entered digit
  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };
  
  // Clear last entered digit for multiplication
  const handleMultBackspace = () => {
    setMultUserAnswer(prev => prev.slice(0, -1));
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
          <TabsTrigger value="multiplication">Multiplication Game</TabsTrigger>
          <TabsTrigger value="tables">Multiplication Tables</TabsTrigger>
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
                      {userAnswer !== '' ? userAnswer : '?'}
                    </span>
                    <div className="flex justify-center mt-2">
                      {userAnswer !== '' ? (
                        numberToBrailleDots(parseInt(userAnswer)).map((dots, idx) => (
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
                      onClick={() => handleAdditionDigitClick(num)}
                      disabled={isCorrect === true}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button 
                    className="h-16 bg-red-500 hover:bg-red-600"
                    onClick={handleBackspace}
                    disabled={isCorrect === true || userAnswer.length === 0}
                  >
                    <Delete className="mr-2" size={20} />
                    Back
                  </Button>
                  <Button 
                    className="h-16 bg-braille-blue hover:bg-blue-700"
                    onClick={checkAdditionAnswer}
                    disabled={isCorrect === true || userAnswer === ''}
                  >
                    Check
                  </Button>
                  <Button 
                    className="h-16 bg-braille-teal hover:bg-teal-700"
                    onClick={generateAdditionProblem}
                  >
                    <RefreshCw className="mr-2" size={20} />
                    New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multiplication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Multiplication Practice Game</span>
                <span className="text-sm bg-braille-blue text-white px-3 py-1 rounded-full">
                  Streak: {multStreak}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center space-x-4 text-4xl font-bold">
                  <div className="flex flex-col items-center">
                    <span>{multNum1}</span>
                    <div className="flex justify-center mt-2">
                      {numberToBrailleDots(multNum1).map((dots, idx) => (
                        <BrailleCell key={idx} dots={dots} size="md" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>×</span>
                    <div className="flex justify-center mt-2">
                      <BrailleCell dots={mathSymbols.multiply} size="md" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{multNum2}</span>
                    <div className="flex justify-center mt-2">
                      {numberToBrailleDots(multNum2).map((dots, idx) => (
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
                    <span className={`${isMultCorrect === false ? 'text-red-500' : ''}`}>
                      {multUserAnswer !== '' ? multUserAnswer : '?'}
                    </span>
                    <div className="flex justify-center mt-2">
                      {multUserAnswer !== '' ? (
                        numberToBrailleDots(parseInt(multUserAnswer)).map((dots, idx) => (
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
                
                {isMultCorrect === true && (
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
                      onClick={() => handleMultDigitClick(num)}
                      disabled={isMultCorrect === true}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button 
                    className="h-16 bg-red-500 hover:bg-red-600"
                    onClick={handleMultBackspace}
                    disabled={isMultCorrect === true || multUserAnswer.length === 0}
                  >
                    <Delete className="mr-2" size={20} />
                    Back
                  </Button>
                  <Button 
                    className="h-16 bg-braille-blue hover:bg-blue-700"
                    onClick={checkMultiplicationAnswer}
                    disabled={isMultCorrect === true || multUserAnswer === ''}
                  >
                    Check
                  </Button>
                  <Button 
                    className="h-16 bg-braille-teal hover:bg-teal-700"
                    onClick={generateMultiplicationProblem}
                  >
                    <RefreshCw className="mr-2" size={20} />
                    New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4">
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
      </Tabs>
    </div>
  );
};

export default MathLearning;
