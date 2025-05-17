
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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to home");
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-linkedBlue" />
        <span className="ml-2 text-xl font-medium text-gray-700">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background font-inter">
      <Sidebar />
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
      <Toaster />
    </div>
  );
};

export default Layout;
