
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import GeneratePage from "./pages/GeneratePage";
import PostsPage from "./pages/PostsPage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

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

// AuthGuard component to protect routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    // Set initial load to false after a delay to prevent quick flashes
    if (!loading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  if (loading || isInitialLoad) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-linkedBlue border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Page transition component with improved stability
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Redirect based on auth status */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Layout>{children}</Layout>
          </AuthGuard>
        } />
        <Route path="/posts" element={
          <AuthGuard>
            <Layout><PostsPage /></Layout>
          </AuthGuard>
        } />
        <Route path="/calendar" element={
          <AuthGuard>
            <Layout><CalendarPage /></Layout>
          </AuthGuard>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// We separate the AppRoutes to avoid the useAuth hook being called outside of AuthProvider
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isStable, setIsStable] = useState(false);
  
  // Improved stability for redirect
  useEffect(() => {
    // Only redirect when auth has fully loaded and stabilized
    if (!loading) {
      // Set a delay to ensure auth state is stable
      const timer = setTimeout(() => {
        setIsStable(true);
        if (user && window.location.pathname === '/') {
          window.history.pushState({}, '', '/dashboard');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);
  
  // Don't render routes until initial auth check is done and state is stable
  if (loading || !isStable) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-linkedBlue border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <PageTransition><GeneratePage /></PageTransition>;
};

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

export default App;
