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
  isActive?: boolean;
}

// Local storage keys
const PROFILE_STORAGE_KEY = 'braillely-user-profile';
const EVENTS_STORAGE_KEY = 'braillely-registered-events';
const MENTORS_STORAGE_KEY = 'braillely-connected-mentors';

// Helper function to safely get/parse localStorage data
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to safely set localStorage data
const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

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
          },
          // Important: Add the current user as a mentor if they have a saved profile
          // This allows them to see themselves in the mentors list
          ...getUserAsMentor()
        ]);
      }, 500);
    });
  },

  // New function: Get the current user as a mentor if they have a saved profile
  getUserAsMentor: () => {
    return getUserAsMentor();
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

  // Get user profile - now with improved localStorage handling
  getUserProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const defaultProfile = {
          name: 'Guest User',
          skills: [],
          goals: [],
          joinedEvents: [],
          connectedMentors: [],
          isActive: false
        };
        
        const storedProfile = getStorageItem<UserProfile>(PROFILE_STORAGE_KEY, defaultProfile);
        
        // Set profile active
        if (!storedProfile.isActive && storedProfile.name !== 'Guest User') {
          storedProfile.isActive = true;
          setStorageItem(PROFILE_STORAGE_KEY, storedProfile);
        }
        
        resolve(storedProfile);
      }, 300);
    });
  },

  // Request mentorship with a mentor - improved storage
  requestMentorship: async (mentorId: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const userProfile = getStorageItem<UserProfile>(PROFILE_STORAGE_KEY, {
            name: 'Guest User',
            skills: [],
            goals: [],
            joinedEvents: [],
            connectedMentors: []
          });
          
          // Add to connected mentors if not already connected
          if (!userProfile.connectedMentors) {
            userProfile.connectedMentors = [];
          }
          
          if (!userProfile.connectedMentors.includes(mentorId)) {
            userProfile.connectedMentors.push(mentorId);
            setStorageItem(PROFILE_STORAGE_KEY, userProfile);
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

  // Register for an event - improved storage
  registerForEvent: async (eventId: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const userProfile = getStorageItem<UserProfile>(PROFILE_STORAGE_KEY, {
            name: 'Guest User',
            skills: [],
            goals: [],
            joinedEvents: [],
            connectedMentors: []
          });
          
          // Add to joined events if not already registered
          if (!userProfile.joinedEvents) {
            userProfile.joinedEvents = [];
          }
          
          if (!userProfile.joinedEvents.includes(eventId)) {
            userProfile.joinedEvents.push(eventId);
            setStorageItem(PROFILE_STORAGE_KEY, userProfile);
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

  // Update user profile - now with improved localStorage handling and permanent saving
  updateProfile: async (profileData: UserProfile): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Get existing profile to merge with any existing data not in the update
          const existingProfile = getStorageItem<UserProfile>(PROFILE_STORAGE_KEY, {
            name: 'Guest User',
            skills: [],
            goals: [],
            joinedEvents: [],
            connectedMentors: [],
            isActive: false
          });
          
          // Merge the existing profile with the new data
          const mergedProfile = {
            ...existingProfile,
            ...profileData,
            // Preserve these arrays if they exist in the existing profile
            joinedEvents: existingProfile.joinedEvents || [],
            connectedMentors: existingProfile.connectedMentors || [],
            // Always set active to true when updating profile
            isActive: true
          };
          
          // Save to local storage
          setStorageItem(PROFILE_STORAGE_KEY, mergedProfile);
          console.log('Profile saved permanently to localStorage:', mergedProfile);
          
          resolve({
            success: true,
            message: 'Your profile has been permanently saved.'
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
  },
  
  // Clear user profile and data (for testing)
  clearUserProfile: async (): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
          localStorage.removeItem(EVENTS_STORAGE_KEY);
          localStorage.removeItem(MENTORS_STORAGE_KEY);
          
          resolve({
            success: true,
            message: 'Your profile has been cleared.'
          });
        } catch (error) {
          console.error('Error clearing profile:', error);
          resolve({
            success: false,
            message: 'An error occurred while clearing your profile.'
          });
        }
      }, 300);
    });
  }
};

// Helper function to turn the current user profile into a mentor object
// This allows the user to see themselves in the mentor list
function getUserAsMentor(): Mentor[] {
  try {
    const userProfile = getStorageItem<UserProfile>(PROFILE_STORAGE_KEY, {
      name: 'Guest User',
      skills: [],
      goals: [],
      isActive: false
    });

    // Only add the user as a mentor if they have a saved and active profile
    if (userProfile.isActive && userProfile.name !== 'Guest User') {
      return [{
        id: 999, // Use a high ID to avoid conflicts with mock mentors
        name: userProfile.name + ' (You)',
        expertise: userProfile.skills || [],
        bio: 'This is your profile. Your skills are shown as your expertise.',
        available: true,
        avatarUrl: undefined // Could be added in future to let users set their avatar
      }];
    }
    return [];
  } catch (error) {
    console.error('Error creating user mentor profile:', error);
    return [];
  }
}

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
    getUserAsMentor: () => {
      try {
        return mentorshipService.getUserAsMentor();
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
        return { name: 'Guest User', skills: [], goals: [], isActive: false };
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
    },
    clearUserProfile: async () => {
      try {
        return await mentorshipService.clearUserProfile();
      } catch (error: any) {
        handleError(error);
        return { success: false, message: 'Failed to clear profile.' };
      }
    }
  };
};
