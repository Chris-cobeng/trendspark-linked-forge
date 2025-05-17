
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Edit, TrendingUp, Copy } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Generate Post', icon: <Edit size={20} />, path: '/' },
    { label: 'Posts', icon: <Copy size={20} />, path: '/posts' },
    { label: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { label: 'Trends', icon: <TrendingUp size={20} />, path: '/trends' },
  ];

  return (
    <div className="h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-linkedBlue flex items-center">
          <span className="bg-linkedBlue text-white p-1 rounded mr-2 text-sm">LC</span>
          LinkedCraft
        </h1>
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-grayScale-200 flex items-center justify-center text-white">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-grayScale-500">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
