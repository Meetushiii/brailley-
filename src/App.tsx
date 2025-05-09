
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/text-to-braille" element={<TextToBraille />} />
                <Route path="/voice-to-braille" element={<VoiceToBraille />} />
                <Route path="/math-learning" element={<MathLearning />} />
                <Route path="/collaborative-editor" element={<CollaborativeBrailleEditor />} />
                <Route path="/braille-tutor" element={<BrailleTutor />} />
                <Route path="/tactile-map" element={<TactileMapGenerator />} />
                <Route path="/peer-mentorship" element={<PeerMentorship />} />
                <Route path="/braille-art" element={<BrailleArt />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
