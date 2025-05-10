
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import TextToBraille from "./pages/TextToBraille";
import VoiceToBraille from "./pages/VoiceToBraille";
import MathLearning from "./pages/MathLearning";
import CollaborativeBrailleEditor from "./pages/CollaborativeBrailleEditor";
import BrailleTutor from "./pages/BrailleTutor";
import TactileMapGenerator from "./pages/TactileMapGenerator";
import PeerMentorship from "./pages/PeerMentorship";
import BrailleArt from "./pages/BrailleArt";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AudioProvider } from "./context/AudioContext";
import ForgotPassword from "./pages/ForgotPassword";

// Create an auth context to replace the window.mockAuth approach
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create a dedicated QueryClient provider component
const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for authentication on app load
  useEffect(() => {
    const userAuth = localStorage.getItem("user-auth");
    setIsAuthenticated(!!userAuth);
  }, []);
  
  // Auth methods that would be replaced with real backend auth
  const login = () => {
    localStorage.setItem("user-auth", "true");
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem("user-auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <AudioProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </AudioProvider>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Separate component for routes to improve organization
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
          <Route path="/text-to-braille" element={isAuthenticated ? <TextToBraille /> : <Navigate to="/login" />} />
          <Route path="/voice-to-braille" element={isAuthenticated ? <VoiceToBraille /> : <Navigate to="/login" />} />
          <Route path="/math-learning" element={isAuthenticated ? <MathLearning /> : <Navigate to="/login" />} />
          <Route path="/collaborative-editor" element={isAuthenticated ? <CollaborativeBrailleEditor /> : <Navigate to="/login" />} />
          <Route path="/braille-tutor" element={isAuthenticated ? <BrailleTutor /> : <Navigate to="/login" />} />
          <Route path="/tactile-map" element={isAuthenticated ? <TactileMapGenerator /> : <Navigate to="/login" />} />
          <Route path="/peer-mentorship" element={isAuthenticated ? <PeerMentorship /> : <Navigate to="/login" />} />
          <Route path="/braille-art" element={isAuthenticated ? <BrailleArt /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;
