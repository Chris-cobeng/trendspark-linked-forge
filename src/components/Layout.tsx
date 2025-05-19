
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Stable page transitions that won't cause layout shifts
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

// Memoize the animated main content to prevent unnecessary re-renders
const AnimatedContent = React.memo(({ children }: { children: React.ReactNode }) => (
  <motion.main 
    className="flex-1 overflow-y-auto p-6 md:p-8"
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.main>
));

AnimatedContent.displayName = 'AnimatedContent';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Stabilized auth redirection
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = () => {
      if (!loading && !user && isMounted) {
        console.log("No user found, redirecting to home");
        navigate('/', { replace: true });
      }
    };
    
    // Small delay to ensure auth state is stable
    const timer = setTimeout(checkAuth, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-linkedBlue" />
        <span className="ml-2 text-xl font-medium text-gray-700">Loading...</span>
      </div>
    );
  }
  
  // Only render when we have a user and are not loading
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-background font-inter">
      <Sidebar />
      <AnimatedContent>{children}</AnimatedContent>
      <Toaster />
    </div>
  );
};

export default Layout;
