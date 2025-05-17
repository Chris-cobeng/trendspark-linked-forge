
import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
