
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrailleCell from '@/components/BrailleCell';
import { textToBraille, textToBrailleDots } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { Copy, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToBraille = () => {
  const [inputText, setInputText] = useState('');
  const [brailleText, setBrailleText] = useState('');
  const [brailleDots, setBrailleDots] = useState<boolean[][]>([]);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();

  useEffect(() => {
    if (inputText) {
      const braille = textToBraille(inputText);
      setBrailleText(braille);
      setBrailleDots(textToBrailleDots(inputText));
    } else {
      setBrailleText('');
      setBrailleDots([]);
    }
  }, [inputText]);

  const handleCopy = () => {
    if (!brailleText) return;
    
    navigator.clipboard.writeText(brailleText)
      .then(() => {
        playSound('success');
        toast({
          title: "Copied!",
          description: "Braille text copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy to clipboard",
        });
      });
  };

  const speakText = () => {
    if (inputText) {
      speak(inputText);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Text to Braille Converter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Convert your text to Braille</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type text to convert to Braille"
              className="text-lg"
              aria-label="Text to convert to Braille"
            />
            
            <div className="flex space-x-2">
              <Button onClick={speakText} disabled={!inputText} className="flex items-center space-x-1">
                <Volume2 size={18} />
                <span>Speak</span>
              </Button>
              <Button onClick={handleCopy} disabled={!brailleText} variant="outline" className="flex items-center space-x-1">
                <Copy size={18} />
                <span>Copy Braille</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="dots" className="mt-6">
            <TabsList>
              <TabsTrigger value="dots">Braille Dots</TabsTrigger>
              <TabsTrigger value="unicode">Unicode Braille</TabsTrigger>
            </TabsList>
            <TabsContent value="dots">
              <Card>
                <CardContent className="p-6">
                  {brailleDots.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-50 rounded-lg min-h-[100px] items-center">
                      {brailleDots.map((dots, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <BrailleCell dots={dots} size="lg" />
                          <span className="text-sm mt-2 text-gray-500">
                            {inputText[index] === ' ' ? '_' : inputText[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      Enter text above to see Braille dots
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="unicode">
              <Card>
                <CardContent className="p-6">
                  {brailleText ? (
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
                      <p className="text-3xl" aria-label="Braille representation">{brailleText}</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      Enter text above to see Unicode Braille
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Learn the Braille Alphabet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.keys(textToBrailleDots('abcdefghijklmnopqrstuvwxyz').reduce((acc, val, idx) => {
              acc[String.fromCharCode(97 + idx)] = val;
              return acc;
            }, {} as Record<string, boolean[]>)).map((char) => (
              <div key={char} className="p-3 border rounded-lg flex flex-col items-center hover:bg-gray-50 cursor-pointer"
                   onClick={() => speak(char)}>
                <BrailleCell dots={textToBrailleDots(char)[0]} size="md" />
                <span className="mt-2 text-lg font-medium">{char.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToBraille;
