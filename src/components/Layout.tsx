
import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };
  
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
