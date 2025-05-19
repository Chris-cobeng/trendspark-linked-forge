
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Edit, Copy, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const navItems = [
    { label: 'Generate Post', icon: <Edit size={20} />, path: '/dashboard' },
    { label: 'Posts', icon: <Copy size={20} />, path: '/posts' },
    { label: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You've been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold text-linkedBlue flex items-center">
            <span className="bg-linkedBlue text-white p-1 rounded mr-2 text-sm">LC</span>
            LinkedCraft
          </h1>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-linkedBlue text-white'
                    : 'text-grayScale-500 hover:bg-grayScale-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-grayScale-200 flex items-center justify-center text-white">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
              <p className="text-xs text-grayScale-500">Free Plan</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-gray-500 hover:text-linkedBlue"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
