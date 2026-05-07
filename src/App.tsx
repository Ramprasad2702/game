import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import Paths from "./pages/Paths";
import Leaderboard from "./pages/Leaderboard";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:domainId/:moduleId" element={<Room />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Legacy route fallbacks */}
          <Route path="/modules" element={<Rooms />} />
          <Route path="/modules/:domainId/:moduleId" element={<Room />} />
          <Route path="/lesson/:domainId/:moduleId/:lessonId" element={<Room />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
