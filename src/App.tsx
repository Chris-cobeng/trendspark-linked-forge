
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import GeneratePage from "./pages/GeneratePage";
import PostsPage from "./pages/PostsPage";
import CalendarPage from "./pages/CalendarPage";
import TrendsPage from "./pages/TrendsPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// AuthGuard component to protect routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard>
                  <Layout><GeneratePage /></Layout>
                </AuthGuard>
              } 
            />
            <Route 
              path="/posts" 
              element={
                <AuthGuard>
                  <Layout><PostsPage /></Layout>
                </AuthGuard>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <AuthGuard>
                  <Layout><CalendarPage /></Layout>
                </AuthGuard>
              } 
            />
            <Route 
              path="/trends" 
              element={
                <AuthGuard>
                  <Layout><TrendsPage /></Layout>
                </AuthGuard>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
