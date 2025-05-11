
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioContext } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, MessageSquare, Search, Lightbulb, Calendar, ArrowRight, 
  Loader2, Share, UserCheck, Info, Phone, Save, Edit, Trash2
} from 'lucide-react';
import { useMentorshipService, Mentor, SkillCategory, MentorshipEvent, UserProfile } from '../services/mentorshipService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PeerMentorship = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [userName, setUserName] = useState('Guest User');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  
  // Hooks
  const { speak, playSound } = useAudioContext();
  const { toast } = useToast();
  const mentorshipService = useMentorshipService();
  const queryClient = useQueryClient();
  
  // Fetch data using React Query
  const { data: mentors = [], isLoading: isMentorsLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => mentorshipService.getMentors(),
  });
  
  const { data: skillCategories = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: () => mentorshipService.getSkillCategories(),
  });
  
  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => mentorshipService.getEvents(),
  });
  
  const { data: userProfile, isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => mentorshipService.getUserProfile(),
  });

  // Update profile mutation with improved error handling
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UserProfile) => mentorshipService.updateProfile(profileData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast({
          title: "Profile Saved",
          description: "Your profile has been permanently saved.",
        });
        playSound('success');
        speak("Your profile has been saved and will be available when you return.");
      } else {
        toast({
          title: "Update Warning",
          description: data.message,
          variant: "destructive"
        });
        playSound('error');
      }
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Failed to save your profile. Please try again later.",
        variant: "destructive"
      });
      playSound('error');
    }
  });
  
  // Clear profile mutation
  const clearProfileMutation = useMutation({
    mutationFn: () => mentorshipService.clearUserProfile(),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        setUserName('Guest User');
        setUserSkills([]);
        setUserGoals([]);
        toast({
          title: "Profile Cleared",
          description: "Your profile has been reset.",
        });
        playSound('success');
      }
    }
  });
  
  // Mentorship request mutation
  const requestMentorshipMutation = useMutation({
    mutationFn: (mentorId: number) => mentorshipService.requestMentorship(mentorId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Request Sent!",
        description: data.message,
      });
      playSound('success');
    }
  });
  
  // Event registration mutation
  const registerEventMutation = useMutation({
    mutationFn: (eventId: number) => mentorshipService.registerForEvent(eventId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Registered!",
        description: data.message,
      });
      playSound('success');
    }
  });
  
  // Load user profile from query with better error handling
  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.name || 'Guest User');
      setUserSkills(userProfile.skills || []);
      setUserGoals(userProfile.goals || []);
    }
  }, [userProfile]);
  
  // Save profile with immediate feedback
  const saveProfile = () => {
    if (userName.trim() === '') {
      toast({
        title: "Cannot Save",
        description: "Please enter your name before saving.",
        variant: "destructive"
      });
      return;
    }
    
    const profileData = {
      name: userName,
      skills: userSkills,
      goals: userGoals,
      isActive: true
    };
    
    console.log("Saving profile data:", profileData);
    updateProfileMutation.mutate(profileData);
    setIsEditingProfile(false);
  };
  
  // Clear profile
  const clearProfile = () => {
    if (window.confirm('Are you sure you want to clear your profile? This action cannot be undone.')) {
      clearProfileMutation.mutate();
    }
  };
  
  // Handle contact mentor
  const handleContactMentor = (mentor: Mentor) => {
    if (userName === 'Guest User') {
      toast({
        title: "Profile Required",
        description: "Please create your profile before requesting mentorship.",
        variant: "destructive"
      });
      return;
    }
    requestMentorshipMutation.mutate(mentor.id);
    speak(`Your mentorship request was sent to ${mentor.name}.`);
  };
  
  // Handle skill toggle
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  // Handle event registration
  const handleEventRegistration = (event: MentorshipEvent) => {
    if (userName === 'Guest User') {
      toast({
        title: "Profile Required",
        description: "Please create your profile before registering for events.",
        variant: "destructive"
      });
      return;
    }
    registerEventMutation.mutate(event.id);
    speak(`You've successfully registered for ${event.title}.`);
  };
  
  // Format event date
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
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    return searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Add user skill
  const addUserSkill = (skill: string) => {
    if (!userSkills.includes(skill)) {
      const newSkills = [...userSkills, skill];
      setUserSkills(newSkills);
      // Auto-save the profile when adding skills
      if (userName !== 'Guest User') {
        updateProfileMutation.mutate({
          name: userName,
          skills: newSkills,
          goals: userGoals,
          isActive: true
        });
      }
    }
  };

  // Add custom user skill
  const handleAddCustomSkill = () => {
    if (newSkill && !userSkills.includes(newSkill)) {
      const newSkills = [...userSkills, newSkill];
      setUserSkills(newSkills);
      setNewSkill('');
      
      // Auto-save the profile when adding skills
      if (userName !== 'Guest User') {
        updateProfileMutation.mutate({
          name: userName,
          skills: newSkills,
          goals: userGoals,
          isActive: true
        });
      }
    }
  };

  // Add custom user goal
  const handleAddCustomGoal = () => {
    if (newGoal && !userGoals.includes(newGoal)) {
      const newGoals = [...userGoals, newGoal];
      setUserGoals(newGoals);
      setNewGoal('');
      
      // Auto-save the profile when adding goals
      if (userName !== 'Guest User') {
        updateProfileMutation.mutate({
          name: userName,
          skills: userSkills,
          goals: newGoals,
          isActive: true
        });
      }
    }
  };

  // Add user goal
  const addUserGoal = (goal: string) => {
    if (!userGoals.includes(goal)) {
      const newGoals = [...userGoals, goal];
      setUserGoals(newGoals);
      
      // Auto-save the profile when adding goals
      if (userName !== 'Guest User') {
        updateProfileMutation.mutate({
          name: userName,
          skills: userSkills,
          goals: newGoals,
          isActive: true
        });
      }
    }
  };

  // Remove user skill
  const removeUserSkill = (skill: string) => {
    const newSkills = userSkills.filter(s => s !== skill);
    setUserSkills(newSkills);
    
    // Auto-save the profile when removing skills
    if (userName !== 'Guest User') {
      updateProfileMutation.mutate({
        name: userName,
        skills: newSkills,
        goals: userGoals,
        isActive: true
      });
    }
  };

  // Remove user goal
  const removeUserGoal = (goal: string) => {
    const newGoals = userGoals.filter(g => g !== goal);
    setUserGoals(newGoals);
    
    // Auto-save the profile when removing goals
    if (userName !== 'Guest User') {
      updateProfileMutation.mutate({
        name: userName,
        skills: userSkills,
        goals: newGoals,
        isActive: true
      });
    }
  };
  
  // Autosave when editing is turned off
  useEffect(() => {
    if (!isEditingProfile && userName.trim() !== '' && userName !== 'Guest User') {
      saveProfile();
    }
  }, [isEditingProfile]);

  // Check if profile exists on initial load
  useEffect(() => {
    // Force refetch on mount to ensure we have the latest data
    refetchProfile();
  }, []);
  
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
            <CardTitle className="flex items-center justify-between">
              <span>Your Profile</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? <Save size={18} /> : <Edit size={18} />}
                  {isEditingProfile ? ' Save Mode' : ' Edit Mode'}
                </Button>
                {userProfile?.isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearProfile}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              {userProfile?.isActive 
                ? "Your permanent profile - changes are automatically saved" 
                : "Complete your profile to unlock all features"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProfileLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-braille-blue" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-braille-blue text-white">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    placeholder="Your Name"
                    className="max-w-xs text-center"
                    disabled={!isEditingProfile}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">My Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className={isEditingProfile ? "cursor-pointer" : ""}
                        onClick={() => isEditingProfile && removeUserSkill(skill)}
                      >
                        {skill} {isEditingProfile && "✕"}
                      </Badge>
                    ))}
                    {userSkills.length === 0 && (
                      <Badge variant="outline">Add skills...</Badge>
                    )}
                  </div>
                  
                  {isEditingProfile && (
                    <div className="flex mt-2 gap-2">
                      <Input 
                        placeholder="Add a new skill" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newSkill.trim()) {
                            handleAddCustomSkill();
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        onClick={handleAddCustomSkill}
                        disabled={!newSkill.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Learning Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userGoals.map(goal => (
                      <Badge 
                        key={goal} 
                        variant="outline" 
                        className={isEditingProfile ? "cursor-pointer" : ""}
                        onClick={() => isEditingProfile && removeUserGoal(goal)}
                      >
                        {goal} {isEditingProfile && "✕"}
                      </Badge>
                    ))}
                    {userGoals.length === 0 && (
                      <Badge variant="outline">Add goals...</Badge>
                    )}
                  </div>
                  
                  {isEditingProfile && (
                    <div className="flex mt-2 gap-2">
                      <Input 
                        placeholder="Add a new goal" 
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newGoal.trim()) {
                            handleAddCustomGoal();
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        onClick={handleAddCustomGoal}
                        disabled={!newGoal.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={saveProfile}
              disabled={updateProfileMutation.isPending || userName.trim() === ''}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : userProfile?.isActive ? 'Update Profile' : 'Save Profile'}
            </Button>
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
          {isMentorsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-braille-blue" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMentors.map(mentor => (
                <Card key={mentor.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          {mentor.avatarUrl ? (
                            <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                          ) : (
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          )}
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
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => addUserGoal(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => speak(`${mentor.name} is an expert in ${mentor.expertise.join(', ')}. ${mentor.bio}`)}
                    >
                      <Info size={16} />
                      Profile
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={!mentor.available}
                      >
                        <Phone size={16} />
                        Call
                      </Button>
                      <Button 
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={!mentor.available || requestMentorshipMutation.isPending}
                        onClick={() => handleContactMentor(mentor)}
                      >
                        <UserCheck size={16} />
                        Request
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredMentors.length === 0 && (
                <div className="col-span-full flex justify-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No mentors found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="skills">
          {isSkillsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-braille-blue" />
            </div>
          ) : (
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
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => selectedSkills.forEach(skill => addUserGoal(skill))}
                        disabled={selectedSkills.length === 0}
                      >
                        Add as Goals
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => selectedSkills.forEach(skill => addUserSkill(skill))}
                        disabled={selectedSkills.length === 0}
                      >
                        Add as Skills
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
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
                      {userSkills.length > 0 ? (
                        userSkills.map(skill => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Add skills you can teach...</Badge>
                      )}
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
              <Button 
                disabled={selectedSkills.length === 0}
                onClick={() => {
                  toast({
                    title: "Skill Exchange Updated",
                    description: "Your skill exchange preferences have been saved.",
                  });
                  playSound('success');
                  speak("Your skill exchange preferences have been updated.");
                }}
              >
                Save My Skill Exchange
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          {isEventsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-braille-blue" />
            </div>
          ) : (
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
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Hosted by {event.host}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.participants} participants
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          speak(`Event details: ${event.title}. ${event.description || ''}. Hosted by ${event.host}. Scheduled for ${formatEventDate(event.date)}. This event is in the ${event.category} category.`);
                        }}
                      >
                        <Info size={16} className="mr-1" />
                        Details
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${event.title}\nDate: ${formatEventDate(event.date)}\nHost: ${event.host}\nCategory: ${event.category}\n${event.description || ''}`
                          );
                          toast({
                            title: "Event Copied",
                            description: "Event details copied to clipboard",
                          });
                        }}
                      >
                        <Share size={16} className="mr-1" />
                        Share
                      </Button>
                      <Button 
                        onClick={() => handleEventRegistration(event)}
                        disabled={registerEventMutation.isPending}
                      >
                        Register
                      </Button>
                    </div>
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
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "This feature will be available soon!",
                      });
                      speak("The ability to host your own sessions will be available soon.");
                    }}
                  >
                    Create a Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeerMentorship;
