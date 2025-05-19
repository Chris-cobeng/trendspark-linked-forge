
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import GeneratePage from "./pages/GeneratePage";
import PostsPage from "./pages/PostsPage";
import CalendarPage from "./pages/CalendarPage";
import TrendsPage from "./pages/TrendsPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";

// Configure React Query with more reliable cache options to reduce unnecessary re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 minutes - increased to prevent frequent refetches
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnReconnect: false, // Disable refetch on reconnect to improve stability
      refetchOnMount: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Separate component for routes to avoid hook issues
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Stabilize initial load to prevent flickering
  useEffect(() => {
    if (!loading) {
      // Only mark as ready after auth is done loading
      const timer = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Show loading screen until auth is ready
  if (loading || !isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-linkedBlue border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <Layout>
              <GeneratePage />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/posts" 
        element={
          user ? (
            <Layout>
              <PostsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/calendar" 
        element={
          user ? (
            <Layout>
              <CalendarPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/trends" 
        element={
          user ? (
            <Layout>
              <TrendsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
