
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrailleCell from '@/components/BrailleCell';
import { textToBraille, textToBrailleDots, BrailleUtils } from '@/utils/brailleUtils';
import { useAudioContext } from '@/context/AudioContext';
import { Users, MessageSquare, Copy, Volume2, Share2, Save, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActiveUser {
  id: string;
  name: string;
  color: string;
  position: number;
}

// In a real app, this would be handled by WebSockets
const mockUsers: ActiveUser[] = [
  { id: '1', name: 'Jane Cooper', color: '#4F46E5', position: 10 },
  { id: '2', name: 'Robert Fox', color: '#EC4899', position: 25 },
];

const CollaborativeBrailleEditor = () => {
  const [text, setText] = useState('Welcome to the collaborative Braille editor! Type or paste text here.');
  const [brailleText, setBrailleText] = useState('');
  const [brailleDots, setBrailleDots] = useState<boolean[][]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>(mockUsers);
  const [useGrade2, setUseGrade2] = useState(false);
  const [roomId, setRoomId] = useState('braille-collab-1234');
  const [messages, setMessages] = useState<{ user: string, text: string, time: string }[]>([
    { user: 'System', text: 'Welcome to the collaboration room', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  useEffect(() => {
    if (text) {
      const braille = useGrade2 
        ? BrailleUtils.convertToGrade2Braille(text)
        : textToBraille(text);
      
      setBrailleText(braille);
      setBrailleDots(textToBrailleDots(text));
    } else {
      setBrailleText('');
      setBrailleDots([]);
    }
  }, [text, useGrade2]);
  
  // Simulated collaborative features
  const simulateUserActivity = () => {
    // In a real app, this would be done through WebSockets
    const updatedUsers = activeUsers.map(user => ({
      ...user,
      position: Math.min(text.length, Math.floor(Math.random() * text.length))
    }));
    setActiveUsers(updatedUsers);
  };
  
  useEffect(() => {
    const interval = setInterval(simulateUserActivity, 5000);
    return () => clearInterval(interval);
  }, [text]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // In a real app, you would broadcast changes to other users here
  };
  
  const handleCopy = () => {
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
    if (text) {
      speak(text);
    }
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([
      ...messages,
      { user: 'You', text: newMessage, time: timeStr }
    ]);
    setNewMessage('');
    playSound('notification');
  };
  
  const shareRoom = () => {
    navigator.clipboard.writeText(`Join my Braille collaboration room: ${window.location.origin}/collaborative-braille/${roomId}`)
      .then(() => {
        toast({
          title: "Room link copied!",
          description: "Share this link with others to collaborate",
        });
        playSound('success');
      });
  };
  
  const saveDocument = () => {
    // In a real app, this would save to the server
    toast({
      title: "Document saved!",
      description: "Your work has been saved to the cloud",
    });
    playSound('success');
  };
  
  const exportDocument = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({
      text,
      braille: brailleText,
      grade2: useGrade2
    })], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `braille-document-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Document exported!",
      description: "Your document has been downloaded",
    });
    playSound('success');
  };
  
  const importDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        setText(content.text || '');
        setUseGrade2(!!content.grade2);
        
        toast({
          title: "Document imported!",
          description: "Your document has been loaded",
        });
        playSound('success');
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Import failed",
          description: "Could not parse the document",
        });
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
  };
  
  // Render user cursor positions
  const renderUserCursors = () => {
    if (!editorRef.current) return null;
    
    return activeUsers.map(user => {
      // Calculate the position based on text and textarea dimensions
      const lines = text.substring(0, user.position).split('\n');
      const lineIndex = lines.length - 1;
      const charIndex = lines[lineIndex].length;
      
      return (
        <div 
          key={user.id} 
          className="absolute flex items-end"
          style={{ 
            top: `calc(1.5em * ${lineIndex})`,
            left: `calc(0.6em * ${charIndex})`,
          }}
        >
          <div 
            className="w-0.5 h-5 animate-pulse" 
            style={{ backgroundColor: user.color }} 
          />
          <span 
            className="text-xs font-medium ml-1 px-1 rounded-sm" 
            style={{ backgroundColor: user.color, color: 'white' }}
          >
            {user.name}
          </span>
        </div>
      );
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Collaborative Braille Editor</h1>
      
      <div className="flex items-center space-x-2 mb-6">
        <Badge variant="outline" className="flex items-center gap-1">
          <Users size={14} />
          {activeUsers.length + 1} Users Online
        </Badge>
        
        <Badge variant="outline" className="flex items-center gap-1">
          Room: {roomId}
        </Badge>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="grade2"
              checked={useGrade2}
              onCheckedChange={setUseGrade2}
            />
            <Label htmlFor="grade2">Grade 2 Braille</Label>
          </div>
          
          <Button onClick={shareRoom} variant="outline" size="sm" className="flex items-center space-x-1">
            <Share2 size={16} />
            <span>Share Room</span>
          </Button>
          
          <Button onClick={saveDocument} variant="outline" size="sm" className="flex items-center space-x-1">
            <Save size={16} />
            <span>Save</span>
          </Button>
          
          <Button onClick={exportDocument} variant="outline" size="sm" className="flex items-center space-x-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
          
          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={importDocument}
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
            />
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Upload size={16} />
              <span>Import</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Text Editor</TabsTrigger>
              <TabsTrigger value="braille">Braille View</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Textarea
                      ref={editorRef}
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Type or paste text here..."
                      className="min-h-[400px] font-mono text-lg p-4 leading-relaxed"
                      aria-label="Collaborative text editor"
                    />
                    {renderUserCursors()}
                  </div>
                  
                  <div className="flex mt-4 space-x-2">
                    <Button onClick={speakText} className="flex items-center space-x-1">
                      <Volume2 size={18} />
                      <span>Speak</span>
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="flex items-center space-x-1">
                      <Copy size={18} />
                      <span>Copy Braille</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="braille">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-[400px]">
                    <h3 className="text-lg font-medium mb-4">Braille Output:</h3>
                    <p className="text-3xl mb-6" aria-label="Braille representation">{brailleText}</p>
                    
                    <div className="flex flex-wrap gap-4">
                      {brailleDots.map((dots, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <BrailleCell dots={dots} size="lg" />
                          <span className="text-sm mt-1 text-gray-500">
                            {text[index] === ' ' ? '␣' : text[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Chat
              </CardTitle>
              <CardDescription>Discuss with collaborators</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-[350px]">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.user === 'You' ? 'bg-braille-blue text-white' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-grow"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Active Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">You</p>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
              <Badge variant="outline" className="ml-2">Owner</Badge>
            </div>
            
            {activeUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarFallback style={{ backgroundColor: user.color }}>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeBrailleEditor;
