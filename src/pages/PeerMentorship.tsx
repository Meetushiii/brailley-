
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { Users, MessageSquare, Search, Book, Lightbulb, Calendar, ArrowRight } from 'lucide-react';

// Mock user data for the peer network
const mentors = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    expertise: ['Braille Reading', 'Screen Readers', 'Math'],
    bio: 'Teaching assistant with 5 years experience in adaptive technologies.',
    available: true 
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    expertise: ['Computer Science', 'Music', 'Accessibility'],
    bio: 'Software engineer specializing in accessible application design.',
    available: true 
  },
  { 
    id: 3, 
    name: 'Aisha Patel', 
    expertise: ['Literature', 'Writing', 'Foreign Languages'],
    bio: 'Graduate student in linguistics with a passion for teaching.',
    available: false 
  },
  { 
    id: 4, 
    name: 'James Wilson', 
    expertise: ['Science', 'Chemistry', 'Lab Techniques'],
    bio: 'Science teacher with extensive experience in adaptive lab equipment.',
    available: true 
  },
];

// Mock skills data
const skillCategories = [
  {
    name: 'Academic',
    skills: ['Math', 'Science', 'Literature', 'History', 'Languages']
  },
  {
    name: 'Technology',
    skills: ['Screen Readers', 'Braille Displays', 'Adaptive Software', 'Mobile Accessibility']
  },
  {
    name: 'Life Skills',
    skills: ['Navigation', 'Cooking', 'Organization', 'Time Management']
  },
  {
    name: 'Arts',
    skills: ['Music', 'Creative Writing', 'Tactile Art', 'Performance']
  }
];

// Mock events data
const events = [
  {
    id: 1,
    title: 'Intro to Nemeth Braille Code',
    date: '2025-05-15T14:00:00',
    host: 'Sarah Johnson',
    participants: 12,
    category: 'Academic'
  },
  {
    id: 2,
    title: 'Screen Reader Tips & Tricks',
    date: '2025-05-20T16:00:00',
    host: 'Michael Chen',
    participants: 8,
    category: 'Technology'
  },
  {
    id: 3,
    title: 'Study Group: English Literature',
    date: '2025-05-18T15:30:00',
    host: 'Aisha Patel',
    participants: 5,
    category: 'Academic'
  }
];

const PeerMentorship = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  
  const handleContactMentor = (mentor: typeof mentors[0]) => {
    toast({
      title: "Request sent!",
      description: `Your mentorship request was sent to ${mentor.name}.`,
    });
    speak(`Your mentorship request was sent to ${mentor.name}.`);
    playSound('success');
  };
  
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const handleEventRegistration = (event: typeof events[0]) => {
    toast({
      title: "Registered!",
      description: `You've registered for "${event.title}"`,
    });
    speak(`You've successfully registered for ${event.title}.`);
    playSound('success');
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Filter mentors based on search query and selected skills
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === '' || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => mentor.expertise.includes(skill));
    
    return matchesSearch && matchesSkills;
  });
  
  const filteredEvents = events.filter(event => {
    return searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Peer Mentorship Network</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Welcome to the Community
            </CardTitle>
            <CardDescription>
              Connect with peers, mentors, and experts in various fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our peer mentorship network connects visually impaired students and professionals to share knowledge, skills, and support each other's learning journey.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-braille-blue text-white flex items-center justify-center">
                  <Lightbulb size={16} />
                </div>
                <span className="font-medium">Share and learn skills</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-braille-yellow text-braille-blue flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <span className="font-medium">Connect through text or voice chat</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-braille-teal text-white flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <span className="font-medium">Join skill-sharing sessions</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => speak("Welcome to the Peer Mentorship Network. Here you can connect with mentors, learn new skills, and participate in community events.")}>
              About the Network
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">ME</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">Guest User</h3>
              <p className="text-sm text-gray-500">Complete your profile to unlock all features</p>
            </div>
            
            <div className="w-full">
              <h4 className="font-medium mb-2">My Skills:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Add skills...</Badge>
              </div>
            </div>
            
            <div className="w-full">
              <h4 className="font-medium mb-2">Learning Goals:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Add goals...</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Complete Profile</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="mentors" className="mt-8">
        <TabsList className="w-full">
          <TabsTrigger value="mentors" className="flex-1">Find Mentors</TabsTrigger>
          <TabsTrigger value="skills" className="flex-1">Skill Exchange</TabsTrigger>
          <TabsTrigger value="events" className="flex-1">Events & Sessions</TabsTrigger>
        </TabsList>
        
        <div className="my-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search for mentors, skills, or events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <TabsContent value="mentors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.map(mentor => (
              <Card key={mentor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription>
                          {mentor.available ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                              Offline
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{mentor.bio}</p>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => speak(`${mentor.name} is an expert in ${mentor.expertise.join(', ')}. ${mentor.bio}`)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    size="sm"
                    disabled={!mentor.available}
                    onClick={() => handleContactMentor(mentor)}
                  >
                    Request Mentorship
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredMentors.length === 0 && (
              <div className="col-span-full flex justify-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No mentors found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map(category => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>Select skills you want to learn or share</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Skill Exchange</CardTitle>
              <CardDescription>
                {selectedSkills.length > 0 
                  ? `${selectedSkills.length} skills selected` 
                  : "Select skills above to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSkills.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Skills I want to learn:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Skills I can teach:</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Add skills you can teach...</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Select skills to start your skill exchange</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button disabled={selectedSkills.length === 0}>
                Save My Skill Exchange
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map(event => (
              <Card key={event.id}>
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{event.category}</Badge>
                      <span className="text-sm text-gray-500">
                        Hosted by {event.host}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.participants} participants
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => handleEventRegistration(event)}>
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming events matching your criteria</p>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Host Your Own Session</CardTitle>
                <CardDescription>Share your knowledge with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Everyone has something valuable to share! You can host study groups, 
                  skill-sharing sessions, or discussion groups on topics you're passionate about.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <ArrowRight size={16} className="mt-1 text-braille-blue" />
                    <span>Choose a topic relevant to the community</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight size={16} className="mt-1 text-braille-blue" />
                    <span>Select a date and time that works for you</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight size={16} className="mt-1 text-braille-blue" />
                    <span>Decide on format: text-based, voice chat, or both</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Create a Session</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeerMentorship;
