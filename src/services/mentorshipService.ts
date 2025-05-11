
import { useToast } from "@/hooks/use-toast";

// Mock API for now - would be replaced with actual backend calls
export interface Mentor {
  id: number;
  name: string;
  expertise: string[];
  bio: string;
  available: boolean;
  avatarUrl?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface MentorshipEvent {
  id: number;
  title: string;
  date: string;
  host: string;
  participants: number;
  category: string;
  description?: string;
  location?: string;
}

export interface UserProfile {
  name: string;
  skills: string[];
  goals: string[];
  joinedEvents?: number[];
  connectedMentors?: number[];
}

// Local storage keys
const PROFILE_STORAGE_KEY = 'braillely-user-profile';
const EVENTS_STORAGE_KEY = 'braillely-registered-events';
const MENTORS_STORAGE_KEY = 'braillely-connected-mentors';

// Mock data service - this would connect to a real backend API
export const mentorshipService = {
  // Get all mentors
  getMentors: async (): Promise<Mentor[]> => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            id: 1, 
            name: 'Sarah Johnson', 
            expertise: ['Braille Reading', 'Screen Readers', 'Math'],
            bio: 'Teaching assistant with 5 years experience in adaptive technologies.',
            available: true,
            avatarUrl: 'https://i.pravatar.cc/150?img=1'
          },
          { 
            id: 2, 
            name: 'Michael Chen', 
            expertise: ['Computer Science', 'Music', 'Accessibility'],
            bio: 'Software engineer specializing in accessible application design.',
            available: true,
            avatarUrl: 'https://i.pravatar.cc/150?img=2'
          },
          { 
            id: 3, 
            name: 'Aisha Patel', 
            expertise: ['Literature', 'Writing', 'Foreign Languages'],
            bio: 'Graduate student in linguistics with a passion for teaching.',
            available: false,
            avatarUrl: 'https://i.pravatar.cc/150?img=3'
          },
          { 
            id: 4, 
            name: 'James Wilson', 
            expertise: ['Science', 'Chemistry', 'Lab Techniques'],
            bio: 'Science teacher with extensive experience in adaptive lab equipment.',
            available: true,
            avatarUrl: 'https://i.pravatar.cc/150?img=4'
          },
          { 
            id: 5, 
            name: 'Elena Rodriguez', 
            expertise: ['Orientation & Mobility', 'Assistive Technology', 'Education'],
            bio: 'Certified O&M specialist with 10 years of experience in schools.',
            available: true,
            avatarUrl: 'https://i.pravatar.cc/150?img=5'
          }
        ]);
      }, 500);
    });
  },

  // Get all skill categories
  getSkillCategories: async (): Promise<SkillCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
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
        ]);
      }, 300);
    });
  },
  
  // Get all events
  getEvents: async (): Promise<MentorshipEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: 'Intro to Nemeth Braille Code',
            date: '2025-05-15T14:00:00',
            host: 'Sarah Johnson',
            participants: 12,
            category: 'Academic',
            description: 'Learn the basics of Nemeth Braille Code for mathematics and scientific notation.',
            location: 'Online'
          },
          {
            id: 2,
            title: 'Screen Reader Tips & Tricks',
            date: '2025-05-20T16:00:00',
            host: 'Michael Chen',
            participants: 8,
            category: 'Technology',
            description: 'Advanced techniques for navigating web applications with popular screen readers.',
            location: 'Online'
          },
          {
            id: 3,
            title: 'Study Group: English Literature',
            date: '2025-05-18T15:30:00',
            host: 'Aisha Patel',
            participants: 5,
            category: 'Academic',
            description: 'Discussion group on classical literature works with accessible formats.',
            location: 'Online'
          },
          {
            id: 4,
            title: 'Orientation & Mobility Workshop',
            date: '2025-06-01T10:00:00',
            host: 'Elena Rodriguez',
            participants: 15,
            category: 'Life Skills',
            description: 'Practical workshop on independent navigation techniques.',
            location: 'Community Center'
          }
        ]);
      }, 400);
    });
  },

  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        const defaultProfile = {
          name: 'Guest User',
          skills: [],
          goals: [],
          joinedEvents: [],
          connectedMentors: []
        };
        
        if (storedProfile) {
          try {
            resolve(JSON.parse(storedProfile));
          } catch (error) {
            console.error('Error parsing profile:', error);
            resolve(defaultProfile);
          }
        } else {
          resolve(defaultProfile);
        }
      }, 300);
    });
  },

  // Request mentorship with a mentor
  requestMentorship: async (mentorId: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Store in local storage
          const mentors = JSON.parse(localStorage.getItem(MENTORS_STORAGE_KEY) || '[]');
          if (!mentors.includes(mentorId)) {
            mentors.push(mentorId);
            localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(mentors));
          }
          
          resolve({
            success: true,
            message: `Your mentorship request has been sent successfully.`
          });
        } catch (error) {
          console.error('Error saving mentor:', error);
          resolve({
            success: false,
            message: 'An error occurred while saving your mentorship request.'
          });
        }
      }, 800);
    });
  },

  // Register for an event
  registerForEvent: async (eventId: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Store in local storage
          const events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
          if (!events.includes(eventId)) {
            events.push(eventId);
            localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
          }
          
          resolve({
            success: true,
            message: `You've successfully registered for the event.`
          });
        } catch (error) {
          console.error('Error registering for event:', error);
          resolve({
            success: false,
            message: 'An error occurred while registering for the event.'
          });
        }
      }, 600);
    });
  },

  // Update user profile
  updateProfile: async (profileData: UserProfile): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Save to local storage
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
          
          resolve({
            success: true,
            message: 'Your profile has been updated successfully.'
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          resolve({
            success: false,
            message: 'An error occurred while updating your profile.'
          });
        }
      }, 700);
    });
  }
};

// Custom hook to interact with the mentorship service
export const useMentorshipService = () => {
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Mentorship service error:', error);
    toast({
      title: 'Service Error',
      description: error.message || 'An error occurred while processing your request.',
      variant: 'destructive',
    });
  };

  return {
    getMentors: async () => {
      try {
        return await mentorshipService.getMentors();
      } catch (error: any) {
        handleError(error);
        return [];
      }
    },
    getSkillCategories: async () => {
      try {
        return await mentorshipService.getSkillCategories();
      } catch (error: any) {
        handleError(error);
        return [];
      }
    },
    getEvents: async () => {
      try {
        return await mentorshipService.getEvents();
      } catch (error: any) {
        handleError(error);
        return [];
      }
    },
    getUserProfile: async () => {
      try {
        return await mentorshipService.getUserProfile();
      } catch (error: any) {
        handleError(error);
        return { name: 'Guest User', skills: [], goals: [] };
      }
    },
    requestMentorship: async (mentorId: number) => {
      try {
        return await mentorshipService.requestMentorship(mentorId);
      } catch (error: any) {
        handleError(error);
        return { success: false, message: 'Failed to send mentorship request.' };
      }
    },
    registerForEvent: async (eventId: number) => {
      try {
        return await mentorshipService.registerForEvent(eventId);
      } catch (error: any) {
        handleError(error);
        return { success: false, message: 'Failed to register for event.' };
      }
    },
    updateProfile: async (profileData: UserProfile) => {
      try {
        return await mentorshipService.updateProfile(profileData);
      } catch (error: any) {
        handleError(error);
        return { success: false, message: 'Failed to update profile.' };
      }
    }
  };
};
